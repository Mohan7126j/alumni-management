import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profiles/me');
      setProfile(response.data.profile);
      setFormData(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/profiles/me', formData);
      setProfile(formData);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
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
    <Container maxWidth="md" className="main-content">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Profile Information</Typography>
          <Button
            variant={editing ? 'outlined' : 'contained'}
            onClick={() => {
              setEditing(!editing);
              if (editing) setFormData(profile);
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Role"
                name="currentRole"
                value={formData.currentRole || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Company"
                name="currentCompany"
                value={formData.currentCompany || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                disabled={!editing}
                multiline
                rows={4}
              />
            </Grid>
            {editing && (
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Save Changes
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {profile?.giveBackScore !== undefined && (
          <Box mt={3} p={2} bgcolor="primary.light" borderRadius={1}>
            <Typography variant="h6">Give Back Score: {profile.giveBackScore}</Typography>
            <Typography variant="body2" color="text.secondary">
              Mentorship: {profile.giveBackBreakdown?.mentorshipHours || 0} hours | 
              Referrals: {profile.giveBackBreakdown?.referralsGiven || 0} | 
              Talks: {profile.giveBackBreakdown?.talksGiven || 0}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;


