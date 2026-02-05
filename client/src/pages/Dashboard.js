import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user-specific data
      const [profileRes, matchingRes] = await Promise.all([
        axios.get('/api/profiles/me'),
        axios.get('/api/matching/suggestions')
      ]);

      setStats({
        profile: profileRes.data.profile,
        suggestions: matchingRes.data.suggestions
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

  return (
    <Container maxWidth="lg" className="main-content">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {stats?.profile?.firstName || user?.email}!
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Profile
              </Typography>
              {stats?.profile ? (
                <Box>
                  <Typography variant="body1">
                    {stats.profile.firstName} {stats.profile.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.profile.currentRole} at {stats.profile.currentCompany}
                  </Typography>
                  {stats.profile.giveBackScore !== undefined && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      Give Back Score: {stats.profile.giveBackScore}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Complete your profile to get started
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {stats?.suggestions?.mentors?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mentor Suggestions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.suggestions.mentors.length} mentor matches found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {stats?.suggestions?.careerMatches?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Career Matches
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.suggestions.careerMatches.length} career-aligned alumni found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;


