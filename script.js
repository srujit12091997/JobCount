class JobCounter {
    constructor() {
        this.applications = [];
        this.initializeElements();
        this.loadData();
    }

    initializeElements() {
        this.elements = {
            totalCount: document.getElementById('total-count'),
            weekCount: document.getElementById('week-count'),
            monthCount: document.getElementById('month-count'),
            dateRange: document.getElementById('date-range'),
            applicationsList: document.getElementById('applications-list')
        };
    }

    async loadData() {
        try {
            const response = await fetch('applications.txt');
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            const text = await response.text();
            console.log('Raw file content:', text); // Debug log
            this.processData(text);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    processData(text) {
        // Split into lines and clean thoroughly
        const lines = text
            .split('\n')
            .map(line => line.trim()) // Remove whitespace
            .filter(line => line && line !== 'date,company,position'); // Remove empty lines and header

        console.log('Cleaned lines:', lines); // Debug log

        // Create unique entries to avoid duplicates
        const uniqueEntries = new Set(lines);
        console.log('Unique entries:', uniqueEntries); // Debug log

        // Parse applications
        this.applications = Array.from(uniqueEntries).map(line => {
            const [date, company, position] = line.split(',').map(item => item.trim());
            return {
                date: new Date(date),
                company,
                position
            };
        });

        console.log('Processed applications:', this.applications); // Debug log
        this.updateDisplay();
    }

    updateDisplay() {
        // Update total count
        this.elements.totalCount.textContent = this.applications.length;

        // Calculate dates
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // Count recent applications
        const weeklyCount = this.applications.filter(app => app.date >= oneWeekAgo).length;
        const monthlyCount = this.applications.filter(app => app.date >= oneMonthAgo).length;

        // Update counts
        this.elements.weekCount.textContent = weeklyCount;
        this.elements.monthCount.textContent = monthlyCount;

        // Update date range
        if (this.applications.length > 0) {
            const firstDate = this.formatDate(this.applications[0].date);
            const lastDate = this.formatDate(this.applications[this.applications.length - 1].date);
            this.elements.dateRange.textContent = `${firstDate} to ${lastDate}`;
        }

        // Update applications list
        this.elements.applicationsList.innerHTML = this.applications
            .map(app => `
                <tr>
                    <td>${this.formatDate(app.date)}</td>
                    <td>${app.company}</td>
                    <td>${app.position}</td>
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
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JobCounter();
});