'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Button, Select, MenuItem, Typography, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function DepartmentDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, resolved: 0, avgRating: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [updating, setUpdating] = useState(false);

  // Dummy department issues
  const dummyIssues = [
    { issue_id: 1, title: 'Pothole', category: 'Road', status: 'pending', priority: 'high', rating: 4, address: '123 Main St', latitude: 40.7589, longitude: -73.9851, createdAt: new Date().toISOString() },
    { issue_id: 2, title: 'Streetlight out', category: 'Electricity', status: 'inprogress', priority: 'medium', rating: 5, address: '456 Elm St', latitude: 40.761, longitude: -73.9815, createdAt: new Date().toISOString() },
    { issue_id: 3, title: 'Garbage not collected', category: 'Sanitation', status: 'pending', priority: 'low', rating: 3, address: '789 Oak St', latitude: 40.756, longitude: -73.99, createdAt: new Date().toISOString() },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setIssues(dummyIssues);
      setCategories([...new Set(dummyIssues.map(i => i.category))]);
      setStats({
        total: dummyIssues.length,
        pending: dummyIssues.filter(i => i.status === 'pending').length,
        inprogress: dummyIssues.filter(i => i.status === 'inprogress').length,
        resolved: dummyIssues.filter(i => i.status === 'resolved').length,
        avgRating: (dummyIssues.reduce((sum, i) => sum + (i.rating || 0), 0) / dummyIssues.length).toFixed(1)
      });
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'inprogress': return 'blue';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  const filteredIssues = issues.filter(issue => 
    (statusFilter === 'all' || issue.status === statusFilter) &&
    (categoryFilter === 'all' || issue.category === categoryFilter)
  );

  const barData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inprogress },
    { name: 'Resolved', value: stats.resolved },
  ];

  const categoryCounts = categories.map(c => ({
    name: c,
    value: issues.filter(i => i.category === c).length
  }));

  return (
    <Box p={4}>
      {/* KPI Cards */}
      <Grid container spacing={2} mb={4}>
        {['total', 'pending', 'inprogress', 'resolved'].map(key => (
          <Grid item xs={6} sm={3} key={key}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">{key.toUpperCase()}</Typography>
              {loading ? <CircularProgress size={24} /> :
                <Typography variant="h5" fontWeight="bold" color={getStatusColor(key)}>
                  {stats[key]}
                </Typography>
              }
            </Paper>
          </Grid>
        ))}
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2">AVG RATING</Typography>
            {loading ? <CircularProgress size={24} /> :
              <Typography variant="h5" fontWeight="bold" color="purple">{stats.avgRating}</Typography>
            }
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box display="flex" gap={2} mb={4}>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="inprogress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>
        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <Button variant="outlined" onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}>
          {viewMode === 'map' ? 'List View' : 'Map View'}
        </Button>
      </Box>

      {/* Charts */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Issues by Status</Typography>
            <BarChart width={400} height={250} data={barData}>
              <CartesianGrid stroke="#eee"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value" fill="#3B82F6"/>
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Issues by Category</Typography>
            <PieChart width={400} height={250}>
              <Pie data={categoryCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryCounts.map((entry, index) => <Cell key={index} fill={['#EF4444','#F59E0B','#10B981'][index % 3]} />)}
              </Pie>
            </PieChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Map/List */}
      {viewMode === 'map' ? (
        <Paper sx={{ height: 400, width: '100%', overflow: 'hidden' }}>
          <MapContainer center={[40.7589, -73.9851]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {filteredIssues.map(issue => issue.latitude && issue.longitude && (
              <Marker key={issue.issue_id} position={[issue.latitude, issue.longitude]} icon={L.icon({iconUrl:`https://via.placeholder.com/32/${getStatusColor(issue.status)}/ffffff?text=%20`,iconSize:[32,32]})}
                eventHandlers={{click:() => setSelectedIssue(issue)}}>
                <Popup>
                  <Box>
                    <Typography>{issue.title}</Typography>
                    <Typography>Status: {issue.status}</Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Priority</th><th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue.issue_id} style={{ cursor: 'pointer' }} onClick={() => setSelectedIssue(issue)}>
                  <td>{issue.issue_id}</td>
                  <td>{issue.title}</td>
                  <td>{issue.category}</td>
                  <td>{issue.status}</td>
                  <td>{issue.priority}</td>
                  <td>{issue.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <Box position="fixed" inset={0} bgcolor="rgba(0,0,0,0.5)" display="flex" alignItems="center" justifyContent="center" p={2}>
          <Paper sx={{ width: 500, maxHeight: '90vh', overflowY: 'auto', p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">{selectedIssue.title}</Typography>
              <Button onClick={() => setSelectedIssue(null)}><X /></Button>
            </Box>
            <Typography>Status: {selectedIssue.status}</Typography>
            <Typography>Category: {selectedIssue.category}</Typography>
            <Typography>Address: {selectedIssue.address}</Typography>
            <Typography>Rating: {selectedIssue.rating}</Typography>
            <Box mt={2} display="flex" gap={1}>
              <Select value={selectedIssue.status} onChange={e => setSelectedIssue({...selectedIssue, status: e.target.value})}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="inprogress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
              <Button variant="contained" color="primary" onClick={() => {
                setUpdating(true);
                setTimeout(() => {
                  setUpdating(false);
                  setIssues(prev => prev.map(i => i.issue_id === selectedIssue.issue_id ? {...i, status: selectedIssue.status} : i));
                  setSelectedIssue(null);
                }, 500);
              }} disabled={updating}>{updating ? 'Updating...' : 'Update Status'}</Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
