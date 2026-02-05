import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Avatar,
  Chip,
  Stack
} from '@mui/material';
import {
  School,
  People,
  BusinessCenter,
  Event,
  TrendingUp,
  ConnectWithoutContact,
  Groups,
  Analytics
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ConnectWithoutContact sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Matching',
      description: 'AI-powered mentor-mentee pairing and career alignment to connect the right people at the right time.'
    },
    {
      icon: <BusinessCenter sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Opportunities Hub',
      description: 'Jobs, internships, referrals, and startup collaborations all in one centralized platform.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Community Intelligence',
      description: 'Data-driven insights into alumni distribution, engagement patterns, and success metrics.'
    },
    {
      icon: <Event sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Events & Networking',
      description: 'Organize reunions, webinars, meetups, and networking events with seamless RSVP management.'
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Messaging',
      description: 'Connect with alumni, mentors, and peers through our secure messaging and group chat system.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Career Growth',
      description: 'Track your career timeline, showcase achievements, and discover growth opportunities.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Alumni' },
    { number: '500+', label: 'Mentors Available' },
    { number: '1,200+', label: 'Job Opportunities' },
    { number: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Class of 2015, Software Engineer',
      company: 'Tech Corp',
      quote: 'The matching system helped me find the perfect mentor who guided me through my career transition.'
    },
    {
      name: 'Michael Chen',
      role: 'Class of 2018, Entrepreneur',
      company: 'Startup Founder',
      quote: 'I\'ve hired three alumni through this platform. The quality of candidates is exceptional.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Class of 2020, Data Scientist',
      company: 'Fortune 500',
      quote: 'The networking events and opportunities hub have been game-changers for my career growth.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, mb: 2 }}
              >
                St. Joseph College of Engineering
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ mb: 3, opacity: 0.9 }}
              >
                Alumni Management System
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.8, lineHeight: 1.8 }}
              >
                A living professional network connecting past, present, and future generations.
                Build lifelong relationships, advance your career, and give back to your community.
              </Typography>
              {!isAuthenticated && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/login"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Login
                  </Button>
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 6,
                  height: { xs: 300, md: 400 }
                }}
              >
                <img
                  src="/images/campus-view.jpg"
                  alt="St. Joseph's Block Campus"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Box
                  sx={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <School sx={{ fontSize: 80, opacity: 0.5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                height: { xs: 300, md: 400 }
              }}
            >
              <img
                src="/images/hostel-building.jpg"
                alt="St. Xavier Boy's Hostel"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              About Our Institution
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              St. Joseph College of Engineering, Erumbudur, Chennai
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
              Established with a vision to create excellence in engineering education, St. Joseph College 
              of Engineering has been nurturing talent and building futures for decades. Our alumni network 
              spans across industries and continents, creating a powerful community of professionals.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our state-of-the-art facilities, including the St. Xavier Boy's Hostel, provide a conducive 
              environment for learning and growth. We believe in fostering lifelong connections that extend 
              far beyond graduation.
            </Typography>
            <Stack direction="row" spacing={2} mt={3}>
              <Chip label="NAAC Accredited" color="primary" />
              <Chip label="ISO Certified" color="primary" variant="outlined" />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Powerful Features
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Everything you need to stay connected, grow your career, and give back to your community
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box mb={2}>{feature.icon}</Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Community Photo Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Our Community
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A vibrant network of professionals, mentors, and leaders
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 4,
            mb: 6
          }}
        >
          <img
            src="/images/group-photo.jpg"
            alt="St. Joseph's Community Group Photo"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
            onError={(e) => {
                e.target.style.display = 'none';
            }}
          />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={3}>
              <People sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Global Network
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with alumni across 50+ countries and 100+ industries
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={3}>
              <School sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Lifelong Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access webinars, workshops, and continuous education opportunities
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={3}>
              <BusinessCenter sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Career Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get mentorship, job referrals, and career guidance from experienced alumni
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              What Our Alumni Say
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real stories from our community members
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ mt: 2, display: 'block' }}>
                    {testimonial.company}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            py: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Join Our Growing Community
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect with thousands of alumni, discover opportunities, and build your professional network
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 4,
                  py: 1.5
                }}
              >
                Create Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/login"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 4,
                  py: 1.5
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Container>
        </Box>
      )}

      {/* Footer Info */}
      <Box sx={{ py: 4, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                St. Joseph College of Engineering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Erumbudur, Chennai - 602117<br />
                Tamil Nadu, India
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button component={Link} to="/profiles" size="small" color="inherit">
                  Browse Alumni
                </Button>
                <Button component={Link} to="/opportunities" size="small" color="inherit">
                  Opportunities
                </Button>
                <Button component={Link} to="/events" size="small" color="inherit">
                  Events
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: alumni@stjoseph.edu<br />
                Phone: +91-XXX-XXXXXXX
              </Typography>
            </Grid>
          </Grid>
          <Box mt={4} pt={3} borderTop={1} borderColor="divider">
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © {new Date().getFullYear()} St. Joseph College of Engineering. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
