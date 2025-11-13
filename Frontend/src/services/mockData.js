// File path: src/services/mockData.js
// --- MOCK DATA SIMULATING BACKEND RESPONSES ---

const currentDate = new Date().toISOString().split('T')[0];

export const mockWorkerData = [
  { workerId: 'TPC001', name: 'Vivek Dhanawade', department: 'Safety', status: 'Active', riskLevel: 'Low', lastCheckin: currentDate, alerts: 0, actions: 'View' },
  { workerId: 'TPC002', name: 'Priya Desai', department: 'Operations', status: 'Flagged', riskLevel: 'Medium', lastCheckin: currentDate, alerts: 1, actions: 'View' },
  { workerId: 'TPC003', name: 'Amit Sharma', department: 'Maintenance', status: 'Active', riskLevel: 'Low', lastCheckin: currentDate, alerts: 0, actions: 'View' },
  { workerId: 'TPC004', name: 'Rajesh Kumar', department: 'Operations', status: 'Inactive', riskLevel: 'N/A', lastCheckin: '2025-11-01', alerts: 0, actions: 'View' },
  { workerId: 'TPC005', name: 'Sonal Patel', department: 'Safety', status: 'Flagged', riskLevel: 'High', lastCheckin: currentDate, alerts: 3, actions: 'View' },
];

export const mockAlertData = [
  { alertId: 'A-001', worker: 'Priya Desai', type: 'Fatigue', severity: 'High', status: 'Unresolved', time: '15 mins ago', action: 'Acknowledge' },
  { alertId: 'A-002', worker: 'Amit Sharma', type: 'Dizziness', severity: 'Medium', status: 'Acknowledged', time: '1 hr ago', action: 'Resolve' },
  { alertId: 'A-003', worker: 'Sonal Patel', type: 'PPE Missing', severity: 'Critical', status: 'Escalated', time: '2 hrs ago', action: 'View' },
  { alertId: 'A-004', worker: 'Vivek Dhanawade', type: 'Stress', severity: 'Low', status: 'Resolved', time: '4 hrs ago', action: 'View' },
];

export const mockMetrics = {
  totalWorkers: 1050,
  flaggedWorkers: 52,
  activeAlerts: 18,
  safetyScore: '92.3%',
  safetyScoreChange: '+1.2%',
  riskDistribution: [
    { name: 'High Risk', value: 10, color: '#DC2626' },
    { name: 'Medium Risk', value: 25, color: '#F59E0B' },
    { name: 'Low Risk', value: 65, color: '#10B981' },
  ],
  alertTrends: [
    { day: 'Mon', new: 15, resolved: 10 },
    { day: 'Tue', new: 20, resolved: 12 },
    { day: 'Wed', new: 18, resolved: 15 },
    { day: 'Thu', new: 25, resolved: 18 },
    { day: 'Fri', new: 10, resolved: 22 },
  ],
  flagReasons: [
    { reason: 'Fatigue', count: 35 },
    { reason: 'Breathing Issues', count: 20 },
    { reason: 'Stress', count: 15 },
    { reason: 'Dizziness', count: 10 },
  ],
  departmentPerformance: [
    { dept: 'Operations', workers: 423, score: 87, compliance: 85, risk: 'Medium' },
    { dept: 'Maintenance', workers: 312, score: 96, compliance: 95, risk: 'Low' },
    { dept: 'Safety', workers: 198, score: 99, compliance: 98, risk: 'Low' },
    { dept: 'Engineering', workers: 117, score: 89, compliance: 88, risk: 'Medium' },
  ],
};