import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('/api/profiles', {
        params: { search, limit: 20 }
      });
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Debounce search
    setTimeout(fetchProfiles, 500);
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
        Alumni Profiles
      </Typography>

      <TextField
        fullWidth
        label="Search profiles"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.currentRole} {profile.currentCompany && `at ${profile.currentCompany}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Class of {profile.graduationYear}
                </Typography>
                {profile.skills && profile.skills.length > 0 && (
                  <Box mt={1}>
                    {profile.skills.slice(0, 3).map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                )}
                {profile.giveBackScore !== undefined && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    Give Back Score: {profile.giveBackScore}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Profiles;

