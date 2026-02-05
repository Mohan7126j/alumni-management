import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
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
        Messages
      </Typography>

      {conversations.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No conversations yet
        </Typography>
      ) : (
        conversations.map((conv) => (
          <Card key={conv._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Conversation with {conv.participants?.length} participant(s)
              </Typography>
              {conv.lastMessage && (
                <Typography variant="body2" color="text.secondary">
                  {conv.lastMessage.content}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Messages;

