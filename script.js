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
            applicationsList: document.getElementById('applications-list'),
            deleteLastBtn: document.getElementById('delete-last'),
            clearAllBtn: document.getElementById('clear-all'),
            refreshBtn: document.getElementById('refresh-data'),
            confirmModal: document.getElementById('confirm-modal'),
            confirmYes: document.getElementById('confirm-yes'),
            confirmNo: document.getElementById('confirm-no')
        };

        // Add event listeners
        this.elements.deleteLastBtn.addEventListener('click', () => this.confirmDelete('last'));
        this.elements.clearAllBtn.addEventListener('click', () => this.confirmDelete('all'));
        this.elements.refreshBtn.addEventListener('click', () => this.loadData());
        this.elements.confirmYes.addEventListener('click', () => this.executeDelete());
        this.elements.confirmNo.addEventListener('click', () => this.closeModal());
    }

    async loadData() {
        try {
            console.log('Loading data...');
            const response = await fetch('applications.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            this.applications = this.parseTextFile(text);
            this.updateDashboard();
            this.showStatus('Data loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showStatus('Failed to load data: ' + error.message, 'error');
        }
    }

    parseTextFile(text) {
        try {
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].toLowerCase().trim();

            if (!headers.includes('date') || !headers.includes('company') || !headers.includes('position')) {
                throw new Error('Invalid file format');
            }

            return lines
                .slice(1)
                .filter(line => line.trim())
                .map(line => {
                    const [date, company, position] = line.split(',').map(item => item.trim());
                    return {
                        date: new Date(date),
                        company,
                        position,
                        daysAgo: this.calculateDaysAgo(new Date(date))
                    };
                })
                .sort((a, b) => b.date - a.date);
        } catch (error) {
            throw new Error('Failed to parse file: ' + error.message);
        }
    }

    updateDashboard() {
        if (this.applications.length === 0) {
            this.resetStats();
            return;
        }

        // Update statistics
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const weeklyCount = this.applications.filter(app => app.date >= oneWeekAgo).length;
        const monthlyCount = this.applications.filter(app => app.date >= oneMonthAgo).length;
        
        const totalDays = Math.ceil((this.applications[0].date - this.applications[this.applications.length - 1].date) / (1000 * 60 * 60 * 24)) + 1;
        const average = (this.applications.length / totalDays).toFixed(1);

        // Update UI elements
        this.elements.totalApplications.textContent = this.applications.length;
        this.elements.weeklyApplications.textContent = weeklyCount;
        this.elements.monthlyApplications.textContent = monthlyCount;
        this.elements.dailyAverage.textContent = average;

        const firstDate = this.formatDate(this.applications[this.applications.length - 1].date);
        const lastDate = this.formatDate(this.applications[0].date);
        this.elements.dateRange.textContent = `${firstDate} - ${last