import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import axios from 'axios';

const Matching = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('/api/matching/suggestions');
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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
        Smart Matching
      </Typography>

      {suggestions?.mentors && suggestions.mentors.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Mentor Matches
          </Typography>
          <Grid container spacing={3}>
            {suggestions.mentors.map((match, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {match.profile.firstName} {match.profile.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {match.profile.currentRole} at {match.profile.currentCompany}
                    </Typography>
                    <Box mt={2}>
                      <Typography variant="body2">Compatibility: {match.compatibilityScore}%</Typography>
                      <LinearProgress variant="determinate" value={match.compatibilityScore} sx={{ mt: 1 }} />
                    </Box>
                    {match.matchReasons && match.matchReasons.length > 0 && (
                      <Box mt={2}>
                        {match.matchReasons.map((reason, i) => (
                          <Chip key={i} label={reason} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {suggestions?.careerMatches && suggestions.careerMatches.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Career-Aligned Alumni
          </Typography>
          <Grid container spacing={3}>
            {suggestions.careerMatches.map((match, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {match.profile.firstName} {match.profile.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {match.profile.currentRole} at {match.profile.currentCompany}
                    </Typography>
                    <Box mt={2}>
                      <Typography variant="body2">Alignment: {match.compatibilityScore}%</Typography>
                      <LinearProgress variant="determinate" value={match.compatibilityScore} sx={{ mt: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Matching;


