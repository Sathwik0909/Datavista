import  { useState, useEffect } from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaChartPie, FaChartLine, FaChartBar, FaCog, FaRobot } from 'react-icons/fa';
import AIChat from './components/Chat';
import './App.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#20B2AA'];
const API_BASE_URL = '/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF',
    },
    background: {
      default: '#F0F2F5',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-03-31'));
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    distributionData: [],
    engagementData: [],
    totalEngagement: { likes: 0, shares: 0, comments: 0 },
    performanceData: [],
    comparisonData: []
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [distribution, engagement, total, performance, comparison] = await Promise.all([
        fetch(`${API_BASE_URL}/distribution?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/engagement?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/total-engagement?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/performance?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/comparison?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json())
      ]);

      setDashboardData({
        distributionData: distribution,
        engagementData: engagement,
        totalEngagement: total,
        performanceData: performance,
        comparisonData: comparison
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="dashboard-container">
        <Sidebar className="sidebar">
          <div className="sidebar-header">
            <h1>DataVista</h1>
          </div>
          <Menu>
            <MenuItem icon={<FaChartPie />} active={true}>Overview</MenuItem>
            <SubMenu label="Analytics" icon={<FaChartLine />}>
              <MenuItem>Performance</MenuItem>
              <MenuItem>Engagement</MenuItem>
              <MenuItem>Audience</MenuItem>
            </SubMenu>
            <MenuItem icon={<FaChartBar />}>Comparison</MenuItem>
            <MenuItem icon={<FaCog />}>Settings</MenuItem>
          </Menu>
          
        </Sidebar>
        <div className="main-content">
          <header>
            <div className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <input {...params} className="date-input" />}
                />
                <span className="date-separator">to</span>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <input {...params} className="date-input" />}
                />
              </LocalizationProvider>
            </div>
            <button className="ai-chat-button" onClick={toggleChat}>
              <FaRobot size={24} />
            </button>
          </header>

          <div className="grid">
            <div className="card total-engagement-card">
              <h2>Total Engagement</h2>
              <div className="total-engagement">
                <div className="metric">
                  <h3>Likes</h3>
                  <span>{dashboardData.totalEngagement.likes?.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <h3>Shares</h3>
                  <span>{dashboardData.totalEngagement.shares?.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <h3>Comments</h3>
                  <span>{dashboardData.totalEngagement.comments?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Post Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2>Engagement Summary</h2>
              <div className="engagement-list">
                {dashboardData.engagementData.map((item, index) => (
                  <div key={index} className="engagement-item">
                    <span className="type">{item.type}</span>
                    <span className="value">{item.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card full-width">
              <h2>Post Performance Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dashboardData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke={COLORS[0]} dot={false} />
                  <Line type="monotone" dataKey="shares" stroke={COLORS[1]} dot={false} />
                  <Line type="monotone" dataKey="comments" stroke={COLORS[2]} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card full-width">
              <h2>Post Type Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dashboardData.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill={COLORS[0]} />
                  <Bar dataKey="shares" fill={COLORS[1]} />
                  <Bar dataKey="comments" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {isChatOpen && <AIChat onClose={toggleChat} />}
      </div>
    </ThemeProvider>
  );
}

export default App;

