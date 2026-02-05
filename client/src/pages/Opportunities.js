import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import axios from 'axios';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('/api/opportunities');
      setOpportunities(response.data.opportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId) => {
    try {
      await axios.post(`/api/opportunities/${opportunityId}/apply`);
      alert('Application submitted successfully!');
      fetchOpportunities();
    } catch (error) {
      alert('Error submitting application');
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
        Opportunities Hub
      </Typography>

      {opportunities.map((opp) => (
        <Card key={opp._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Box>
                <Typography variant="h6">{opp.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {opp.company} • {opp.type}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {opp.description}
                </Typography>
                {opp.skills && opp.skills.length > 0 && (
                  <Box mt={1}>
                    {opp.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => handleApply(opp._id)}
                disabled={opp.status !== 'open'}
              >
                Apply
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Opportunities;


