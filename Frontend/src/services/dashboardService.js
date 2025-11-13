// File path: src/services/dashboardService.js
import { mockWorkerData, mockAlertData, mockMetrics } from "./mockData.js";

const API_BASE = "http://localhost:8000/api/v1";

const mockFetch = async (data, delay = 300) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, delay));
    return JSON.parse(JSON.stringify(data)); // Deep copy to simulate fresh data
};

// Note: Auth headers would be handled in the fetch calls in a real application

export async function fetchWorkersData(token, filters = {}) {
    console.log("[DATA] Fetching Workers Data...");
    return mockFetch(mockWorkerData.filter(worker => {
        if (filters.department && filters.department !== 'All' && worker.department !== filters.department) return false;
        if (filters.riskLevel && filters.riskLevel !== 'All' && worker.riskLevel !== filters.riskLevel) return false;
        return true;
    }));
}

export async function fetchAlertsData(token, filters = {}) {
    console.log("[DATA] Fetching Alerts Data...");
    return mockFetch(mockAlertData.filter(alert => {
        if (filters.status && filters.status !== 'All' && alert.status !== filters.status) return false;
        return true;
    }));
}

export async function fetchDashboardMetrics(token) {
    console.log("[DATA] Fetching Dashboard Metrics...");
    return mockFetch(mockMetrics);
}

export async function fetchDepartmentPerformance(token) {
    console.log("[DATA] Fetching Department Performance Data...");
    return mockFetch(mockMetrics.departmentPerformance);
}

export async function fetchFlagReasons(token) {
    console.log("[DATA] Fetching Flag Reasons Data...");
    return mockFetch({
        reasons: mockMetrics.flagReasons,
        severityDistribution: mockMetrics.riskDistribution, // Reusing risk data for mock severity
    });
}

export async function fetchIncidentData(token) {
    console.log("[DATA] Fetching Incident Data...");
    return mockFetch([
        { id: 'INC-001', title: 'Equipment Malfunction', severity: 'High', status: 'Under Investigation', dept: 'Operations', reportedBy: 'R. Sharma', date: '2025-11-10' },
        { id: 'INC-002', title: 'Worker Slip and Fall', severity: 'Medium', status: 'Resolved', dept: 'Maintenance', reportedBy: 'P. Kumar', date: '2025-11-08' },
    ]);
}