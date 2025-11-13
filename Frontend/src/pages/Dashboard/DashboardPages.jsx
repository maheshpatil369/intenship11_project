// File path: src/pages/Dashboard/DashboardPages.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchWorkersData, fetchAlertsData, fetchDashboardMetrics, fetchDepartmentPerformance, fetchFlagReasons, fetchIncidentData } from '../../services/dashboardService.js';
import MetricCard from '../../components/dashboard/MetricCard.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import Chart from '../../components/dashboard/Chart.jsx';
import FilterBar from '../../components/dashboard/FilterBar.jsx';
import { Users, Bell, FileText, BarChart, TrendingUp, Briefcase, HardHat, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Utility for rendering status badges in tables
const StatusBadge = ({ status, risk }) => {
    let color = 'bg-gray-100 text-gray-700';
    if (status === 'Flagged' || status === 'Unresolved' || risk === 'High' || risk === 'Critical') color = 'bg-red-100 text-red-700 font-semibold';
    if (status === 'Active' || risk === 'Medium' || status === 'Under Investigation') color = 'bg-yellow-100 text-yellow-700';
    if (status === 'Resolved' || risk === 'Low') color = 'bg-green-100 text-green-700';
    return <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${color}`}>{risk || status}</span>;
};

// --- Helper to get current date for mock check-in status ---
const currentDate = new Date().toISOString().split('T')[0];

// -----------------------------------------------------------
// 1. WORKERS PAGE (0:15 - Worker Management)
// -----------------------------------------------------------
export function Workers() {
    const { token } = useAuth();
    const [workers, setWorkers] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [workerData, metricData] = await Promise.all([
                    fetchWorkersData(token, filters),
                    fetchDashboardMetrics(token)
                ]);
                setWorkers(workerData);
                setMetrics(metricData);
            } catch (error) {
                console.error("Failed to load worker data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token, filters]);
    
    const workerColumns = [
        { header: 'Worker ID', key: 'workerId' },
        { header: 'Name', key: 'name' },
        { header: 'Department', key: 'department' },
        { header: 'Status', key: 'status', render: (status) => <StatusBadge status={status} /> },
        { header: 'Risk Level', key: 'riskLevel', render: (risk) => <StatusBadge risk={risk} /> },
        { header: 'Last Check-in', key: 'lastCheckin' },
        { header: 'Alerts', key: 'alerts' },
        { header: 'Actions', key: 'actions', render: () => <button className="text-indigo-600 hover:text-indigo-900 text-xs">View</button> },
    ];

    const filterOptions = [
        { name: 'riskLevel', label: 'All Risk', options: [{ label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }] },
        { name: 'department', label: 'All Depts', options: [{ label: 'Operations', value: 'Operations' }, { label: 'Maintenance', value: 'Maintenance' }, { label: 'Safety', value: 'Safety' }] },
    ];

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="text-center py-10">Loading Workers Dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Worker Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard 
                    title="Total Workers" value={metrics.totalWorkers || '...'} icon={Users} iconColor="text-indigo-600"
                    change={`${workers.filter(w => w.lastCheckin === currentDate).length} Checked in Today`} changeType="neutral"
                />
                <MetricCard 
                    title="Flagged Workers" value={workers.filter(w => w.status === 'Flagged').length} icon={AlertTriangle} iconColor="text-red-600"
                    change="Require Attention" changeType="negative"
                />
                <MetricCard 
                    title="Active Alerts" value={metrics.activeAlerts || '...'} icon={Bell} iconColor="text-yellow-600"
                    change="0 Require Action" changeType="neutral"
                />
                <MetricCard 
                    title="Safety Score" value={metrics.safetyScore || '...'} icon={CheckCircle} iconColor="text-green-600"
                    change={metrics.safetyScoreChange || '0%'} changeType={metrics.safetyScoreChange?.startsWith('+') ? 'positive' : 'negative'}
                />
            </div>

            <FilterBar filters={filterOptions} onFilterChange={handleFilterChange} />
            
            <DataTable 
                title="Worker Management" 
                columns={workerColumns} 
                data={workers} 
                primaryAction="Add New Worker"
            />
        </div>
    );
}

// -----------------------------------------------------------
// 2. ALERTS PAGE (0:30 - Alert Management)
// -----------------------------------------------------------
export function Alerts() {
    const { token } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const alertData = await fetchAlertsData(token, filters);
                setAlerts(alertData);
            } catch (error) {
                console.error("Failed to load alerts data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token, filters]);

    const alertMetrics = {
        active: alerts.filter(a => a.status === 'Unresolved').length,
        acknowledged: alerts.filter(a => a.status === 'Acknowledged').length,
        escalated: alerts.filter(a => a.status === 'Escalated').length,
        resolved: alerts.filter(a => a.status === 'Resolved').length,
    };

    const alertColumns = [
        { header: 'Worker', key: 'worker' },
        { header: 'Alert Type', key: 'type' },
        { header: 'Severity', key: 'severity', render: (severity) => <StatusBadge risk={severity} /> },
        { header: 'Time', key: 'time' },
        { header: 'Status', key: 'status', render: (status) => <StatusBadge status={status} /> },
        { header: 'Action', key: 'action', render: (action) => <button className="text-green-600 hover:text-green-900 text-xs">{action}</button> },
    ];
    
    const filterOptions = [
        { name: 'status', label: 'All Status', options: [{ label: 'Unresolved', value: 'Unresolved' }, { label: 'Acknowledged', value: 'Acknowledged' }, { label: 'Resolved', value: 'Resolved' }] },
        { name: 'severity', label: 'All Severity', options: [{ label: 'High', value: 'High' }, { label: 'Medium', value: 'Medium' }, { label: 'Low', value: 'Low' }] },
    ];
    
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="text-center py-10">Loading Alerts Dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Alert Management</h1>
            <p className="text-gray-500">Monitor and manage worker safety alerts</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Active Alerts" value={alertMetrics.active} icon={AlertTriangle} iconColor="text-red-600" bgColor="bg-red-50" />
                <MetricCard title="Acknowledged" value={alertMetrics.acknowledged} icon={CheckCircle} iconColor="text-yellow-600" />
                <MetricCard title="Escalated" value={alertMetrics.escalated} icon={Clock} iconColor="text-orange-600" />
                <MetricCard title="Resolved" value={alertMetrics.resolved} icon={CheckCircle} iconColor="text-green-600" />
            </div>

            <FilterBar filters={filterOptions} onFilterChange={handleFilterChange} />
            
            <DataTable 
                title="Alert Records" 
                columns={alertColumns} 
                data={alerts} 
            />
        </div>
    );
}

// -----------------------------------------------------------
// 3. REPORTS PAGE (0:36 - Executive Summary)
// -----------------------------------------------------------
export function Reports() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        const loadMetrics = async () => {
            setLoading(true);
            try {
                const metricData = await fetchDashboardMetrics(token);
                setMetrics(metricData);
            } catch (error) {
                console.error("Failed to load reports metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMetrics();
    }, [token]);

    const executiveSummary = [
        "Fatigue remains the leading cause of worker flags (35%).",
        "Construction department shows highest flag rate (26.7%).",
        "Overall incident resolution rate is excellent at 93.2%.",
        "Daily flag percentage has decreased by 2.0% this week.",
    ];

    const recommendations = [
        "Implement fatigue management programs.",
        "Increase safety training in construction department.",
        "Continue current incident response protocols.",
        "Monitor dizziness trends for potential environmental factors.",
    ];

    if (loading) return <div className="text-center py-10">Loading Reports...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Analytics Health and Safety Metrics</h1>
            <p className="text-gray-500">Real-time insights into worker health and safety metrics</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Workers" value={metrics.totalWorkers} icon={Users} iconColor="text-indigo-600" />
                <MetricCard title="Flagged Workers" value={metrics.flaggedWorkers} icon={AlertTriangle} iconColor="text-red-600" change="From last month" changeType="negative" />
                <MetricCard title="Safety Score" value={metrics.safetyScore} icon={CheckCircle} iconColor="text-green-600" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Executive Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Key Findings</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                            {executiveSummary.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Recommendations</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                            {recommendations.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------
// 4. ANALYSIS PAGE (0:46 - Safety Analytics Dashboard)
// -----------------------------------------------------------
export function Analysis() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMetrics = async () => {
            setLoading(true);
            try {
                const metricData = await fetchDashboardMetrics(token);
                setMetrics(metricData);
            } catch (error) {
                console.error("Failed to load analysis metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMetrics();
    }, [token]);
    
    if (loading) return <div className="text-center py-10">Loading Safety Analysis...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Safety Analytics Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Workers" value="1,247" icon={Users} iconColor="text-indigo-600" />
                <MetricCard title="Active Alerts" value="23" icon={Bell} iconColor="text-yellow-600" />
                <MetricCard title="Safety Score" value="92.3%" icon={CheckCircle} iconColor="text-green-600" />
                <MetricCard title="Risk Level" value="Medium" icon={AlertTriangle} iconColor="text-orange-600" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Chart title="Alert Trends" type="Bar/Line" data={metrics.alertTrends} height={400} />
                </div>
                <div>
                    <Chart title="Risk Distribution" type="Donut" data={metrics.riskDistribution} height={400} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart title="Department Performance" type="Bar" data={metrics.departmentPerformance} height={300} />
                <Chart title="Hourly Alert Pattern" type="Area" data={metrics.alertTrends} height={300} />
            </div>
        </div>
    );
}

// -----------------------------------------------------------
// 5. FLAG REASONS PAGE (1:00 - Flag Reasons Breakdown)
// -----------------------------------------------------------
export function FlagReasons() {
    const { token } = useAuth();
    const [flagData, setFlagData] = useState({ reasons: [], severityDistribution: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchFlagReasons(token);
                setFlagData(data);
            } catch (error) {
                console.error("Failed to load flag reasons:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token]);

    const recentFlagsColumns = [
        { header: 'Worker', key: 'worker' },
        { header: 'Reason', key: 'reason' },
        { header: 'Severity', key: 'severity', render: (severity) => <StatusBadge risk={severity} /> },
        { header: 'Time', key: 'time' },
        { header: 'Status', key: 'status' },
        { header: 'Action', key: 'action' },
    ];
    
    const recentFlags = [
        { worker: 'Priya Verma', reason: 'Extreme Fatigue', severity: 'High', time: '15 mins ago', status: 'Active', action: 'Sent for medical evaluation' },
        { worker: 'Vikram Singh', reason: 'Dizziness', severity: 'Medium', time: '1 hour ago', status: 'In Progress', action: 'Supervisor contacted' },
    ];

    if (loading) return <div className="text-center py-10">Loading Flag Reasons Analysis...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Flag Reasons Analysis</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Most Common" value="Fatigue" icon={Users} iconColor="text-red-600" />
                <MetricCard title="Trending Up" value="Breathing" icon={AlertTriangle} iconColor="text-yellow-600" />
                <MetricCard title="High Risk Dept" value="Operations" icon={Briefcase} iconColor="text-indigo-600" />
                <MetricCard title="Avg Response" value="2.8 min" icon={Clock} iconColor="text-green-600" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart title="Breakdown of Flag Reasons" type="Bar" data={flagData.reasons} height={350} />
                <Chart title="Weekly Trends" type="Line" data={flagData.reasons} height={350} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart title="Department Breakdown" type="Stacked Bar" data={flagData.reasons} height={350} />
                <Chart title="Flag Severity Distribution" type="Donut" data={flagData.severityDistribution} height={350} />
            </div>

            <DataTable 
                title="Recent Flags" 
                columns={recentFlagsColumns} 
                data={recentFlags} 
            />
        </div>
    );
}

// -----------------------------------------------------------
// 6. DEPARTMENTS PAGE (1:17 - Department Performance)
// -----------------------------------------------------------
export function Departments() {
    const { token } = useAuth();
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchDepartmentPerformance(token);
                setPerformance(data);
            } catch (error) {
                console.error("Failed to load department data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token]);

    const deptColumns = [
        { header: 'Department', key: 'dept' },
        { header: 'Workers', key: 'workers' },
        { header: 'Safety Score', key: 'score', render: (score) => `${score}%` },
        { header: 'Compliance', key: 'compliance', render: (compliance) => `${compliance}%` },
        { header: 'Risk Level', key: 'risk', render: (risk) => <StatusBadge risk={risk} /> },
        { header: 'Supervisor', key: 'supervisor', render: () => 'Prasad D. Devikar' },
    ];

    if (loading) return <div className="text-center py-10">Loading Department Performance...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Monitor Departments Performance</h1>
            <p className="text-gray-500">View safety compliance across all departments</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {performance.map(dept => (
                    <div key={dept.dept} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 space-y-2">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{dept.dept}</h2>
                            <StatusBadge risk={dept.risk} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{dept.workers}</p>
                        <p className="text-sm text-gray-500">{dept.compliance}% Compliance</p>
                        <Link to="#" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">View Details</Link>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart title="Weekly Safety Trends" type="Line" data={performance} height={350} />
                <Chart title="Monthly Statistics" type="Bar" data={performance} height={350} />
            </div>

            <DataTable 
                title="Department Details" 
                columns={deptColumns} 
                data={performance} 
            />
        </div>
    );
}

// -----------------------------------------------------------
// 7. INCIDENTS PAGE (1:27 - Incident Tracking)
// -----------------------------------------------------------
export function Incidents() {
    const { token } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchIncidentData(token);
                setIncidents(data);
            } catch (error) {
                console.error("Failed to load incident data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token]);

    const incidentMetrics = {
        total: incidents.length,
        underInvestigation: incidents.filter(i => i.status === 'Under Investigation').length,
        resolved: incidents.filter(i => i.status === 'Resolved').length,
    };
    
    const incidentColumns = [
        { header: 'Incident ID', key: 'id' },
        { header: 'Title', key: 'title' },
        { header: 'Severity', key: 'severity', render: (severity) => <StatusBadge risk={severity} /> },
        { header: 'Status', key: 'status', render: (status) => <StatusBadge status={status} /> },
        { header: 'Department', key: 'dept' },
        { header: 'Reported By', key: 'reportedBy' },
        { header: 'Date', key: 'date' },
        { header: 'Actions', key: 'id', render: () => <button className="text-indigo-600 hover:text-indigo-900 text-xs">View/Edit</button> },
    ];

    if (loading) return <div className="text-center py-10">Loading Incident Management...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Incident Management</h1>
            <p className="text-gray-500">Track and manage safety incidents across all departments</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Incidents" value={incidentMetrics.total} icon={HardHat} iconColor="text-indigo-600" />
                <MetricCard title="Under Investigation" value={incidentMetrics.underInvestigation} icon={Clock} iconColor="text-yellow-600" />
                <MetricCard title="Resolved" value={incidentMetrics.resolved} icon={CheckCircle} iconColor="text-green-600" />
                <MetricCard title="Avg Resolution" value="5.2 days" icon={TrendingUp} iconColor="text-green-600" change="vs last month" changeType="negative" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Chart title="Incident Reporting and Resolution Trends" type="Line" data={incidents} height={350} />
                </div>
                <div>
                    <Chart title="Severity Distribution" type="Donut" data={incidents} height={350} />
                </div>
            </div>

            <DataTable 
                title="All Incidents" 
                columns={incidentColumns} 
                data={incidents} 
                primaryAction="Report Incident"
            />
        </div>
    );
}

// Export individual components for the router to import
export default { Workers, Alerts, Reports, Analysis, FlagReasons, Departments, Incidents };