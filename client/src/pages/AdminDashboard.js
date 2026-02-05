import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, analyticsRes, successRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/analytics/community-intelligence'),
        axios.get('/api/analytics/success-index')
      ]);

      setStats({
        dashboard: dashboardRes.data.stats,
        analytics: analyticsRes.data.data,
        successIndex: successRes.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Container maxWidth="lg" className="main-content">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats?.dashboard?.totalUsers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Alumni</Typography>
              <Typography variant="h4">{stats?.dashboard?.totalAlumni || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Verified Alumni</Typography>
              <Typography variant="h4">{stats?.dashboard?.verifiedAlumni || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Success Index</Typography>
              <Typography variant="h4">{stats?.successIndex?.successIndex || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {stats?.analytics?.distribution?.industry && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Alumni by Industry
                </Typography>
                <BarChart width={400} height={300} data={stats.analytics.distribution.industry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
          </Grid>
        )}

        {stats?.analytics?.distribution?.country && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Alumni by Country
                </Typography>
                <PieChart width={400} height={300}>
                  <Pie
                    data={stats.analytics.distribution.country.slice(0, 5)}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {stats.analytics.distribution.country.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;


