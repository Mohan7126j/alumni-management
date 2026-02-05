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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events', {
        params: { upcoming: 'true' }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId, status = 'going') => {
    try {
      await axios.post(`/api/events/${eventId}/rsvp`, { rsvpStatus: status });
      alert('RSVP updated successfully!');
      fetchEvents();
    } catch (error) {
      alert('Error updating RSVP');
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
        Events
      </Typography>

      {events.map((event) => (
        <Card key={event._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Box>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.type} • {new Date(event.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {event.location} {event.isVirtual && '• Virtual'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.attendees?.length || 0} attendees
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => handleRSVP(event._id)}
              >
                RSVP
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Events;

