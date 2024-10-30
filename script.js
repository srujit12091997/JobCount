// script.js
class JobApplicationTracker {
    constructor() {
        this.applications = [];
        this.initializeElements();
        this.loadData();
    }

    initializeElements() {
        this.elements = {
            totalApplications: document.getElementById('total-applications'),
            weeklyApplications: document.getElementById('weekly-applications'),
            monthlyApplications: document.getElementById('monthly-applications'),
            dailyAverage: document.getElementById('daily-average'),
            dateRange: document.getElementById('date-range'),
            lastUpdated: document.getElementById('last-updated'),
            applicationsList: document.getElementById('applications-list')
        };
    }

    async loadData() {
        try {
            console.log('Attempting to load text file...');
            
            // Change file extension to .txt
            const response = await fetch('applications.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const textData = await response.text();
            console.log('File content:', textData);

            this.applications = this.parseTextFile(textData);
            this.updateDashboard();
            this.showStatus('Data loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showStatus('Error: ' + error.message, 'error');
        }
    }

    parseTextFile(textData) {
        try {
            // Split into lines and filter out empty lines
            const lines = textData.split('\n').filter(line => line.trim());
            console.log('Text lines:', lines);

            // Check if first line is header
            const headerLine = lines[0].toLowerCase().trim();
            if (!headerLine.includes('date') || !headerLine.includes('company') || !headerLine.includes('position')) {
                throw new Error('Text file must have header with date, company, and position');
            }

            // Process data rows
            return lines
                .slice(1) // Skip header
                .filter(line => line.trim()) // Remove empty lines
                .map(line => {
                    // Split by comma and clean up each field
                    const [date, company, position] = line.split(',').map(item => item.trim());
                    const parsedDate = this.parseDate(date);
                    
                    return {
                        date: parsedDate,
                        company,
                        position,
                        daysAgo: this.calculateDaysAgo(parsedDate)
                    };
                })
                .sort((a, b) => b.date - a.date); // Sort by date, newest first
        } catch (error) {
            console.error('Text parsing error:', error);
            throw new Error('Failed to parse text file: ' + error.message);
        }
    }

    parseDate(dateString) {
        try {
            const [month, day, year] = dateString.split('/');
            return new Date(year, month - 1, day);
        } catch (error) {
            console.error('Date parsing error:', error);
            throw new Error('Invalid date format in file');
        }
    }

    calculateDaysAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    updateDashboard() {
        if (this.applications.length === 0) {
            this.showStatus('No applications found', 'error');
            return;
        }

        // Calculate statistics
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const weeklyCount = this.applications.filter(app => app.date >= oneWeekAgo).length;
        const monthlyCount = this.applications.filter(app => app.date >= oneMonthAgo).length;

        // Calculate daily average
        const totalDays = Math.ceil((this.applications[0].date - this.applications[this.applications.length - 1].date) / (1000 * 60 * 60 * 24)) + 1;
        const average = (this.applications.length / totalDays).toFixed(1);

        // Update UI
        this.elements.totalApplications.textContent = this.applications.length;
        this.elements.weeklyApplications.textContent = weeklyCount;
        this.elements.monthlyApplications.textContent = monthlyCount;
        this.elements.dailyAverage.textContent = average;

        // Update date range
        const firstDate = this.formatDate(this.applications[this.applications.length - 1].date);
        const lastDate = this.formatDate(this.applications[0].date);
        this.elements.dateRange.textContent = `${firstDate} - ${lastDate}`;

        // Update last updated timestamp
        this.elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;

        this.updateApplicationsList();
    }

    updateApplicationsList() {
        this.elements.applicationsList.innerHTML = this.applications
            .slice(0, 10) // Show last 10 applications
            .map(app => `
                <tr>
                    <td>${this.formatDate(app.date)}</td>
                    <td>${app.company}</td>
                    <td>${app.position}</td>
                    <td>${app.daysAgo} ${app.daysAgo === 1 ? 'day' : 'days'} ago</td>
                </tr>
            `)
            .join('');
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showStatus(message, type = 'info') {
        console.log(`Status: ${message} (${type})`);
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.className = `status-message show ${type}`;

        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobApplicationTracker();
});