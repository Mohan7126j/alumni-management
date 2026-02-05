import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  TextField
} from '@mui/material';
import axios from 'axios';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    donationType: 'one-time',
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/api/donations');
      setDonations(response.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/donations', formData);
      alert('Donation submitted successfully!');
      fetchDonations();
      setFormData({ amount: '', donationType: 'one-time', paymentMethod: 'credit_card' });
    } catch (error) {
      alert('Error submitting donation');
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
        Donations & Impact
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Make a Donation
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Donate
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Recent Donations
      </Typography>
      {donations.map((donation) => (
        <Card key={donation._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              ${donation.amount} - {donation.donationType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(donation.createdAt).toLocaleDateString()} • {donation.paymentStatus}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Donations;

