# API Documentation

Base URL: `http://localhost:5000/api`

All endpoints return JSON responses.

## Authentication

### Register User
**POST** `/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "graduationYear": 2024,
  "degree": "Computer Science"
}
```

**Response** (201):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "student",
    "isVerified": true
  }
}
```

### Login
**POST** `/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "student",
    "isVerified": true
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "alumni",
    "isVerified": true
  }
}
```

### Verify Alumni (Admin Only)
**POST** `/auth/verify-alumni/:userId`

**Headers**: `Authorization: Bearer <admin_token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Alumni account verified successfully",
  "user": { ... }
}
```

## Profiles

### Get All Profiles
**GET** `/profiles?page=1&limit=20&search=john&industry=tech`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Results per page
- `search` (optional): Search term
- `graduationYear` (optional): Filter by year
- `industry` (optional): Filter by industry
- `country` (optional): Filter by country
- `skills` (optional): Filter by skills
- `isAvailableForMentorship` (optional): true/false

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "profiles": [ ... ]
}
```

### Get My Profile
**GET** `/profiles/me`

**Response** (200):
```json
{
  "success": true,
  "profile": {
    "_id": "profile_id",
    "firstName": "John",
    "lastName": "Doe",
    "currentRole": "Software Engineer",
    "currentCompany": "Tech Corp",
    "skills": ["JavaScript", "React"],
    "giveBackScore": 150,
    "giveBackBreakdown": {
      "mentorshipHours": 10,
      "referralsGiven": 2,
      "talksGiven": 1,
      "donationsCount": 3,
      "eventsAttended": 5
    }
  }
}
```

### Update Profile
**PUT** `/profiles/me`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "currentRole": "Senior Engineer",
  "currentCompany": "New Corp",
  "bio": "Experienced developer...",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Add Career Timeline Entry
**POST** `/profiles/me/career-timeline`

**Request Body**:
```json
{
  "role": "Software Engineer",
  "company": "Tech Corp",
  "startDate": "2020-01-01",
  "endDate": "2022-12-31",
  "description": "Worked on web applications",
  "current": false
}
```

## Matching

### Get Mentor Matches
**GET** `/matching/mentors?limit=10`

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "matches": [
    {
      "profile": { ... },
      "compatibilityScore": 85,
      "matchReasons": [
        "Same industry: Technology",
        "Shared skills: JavaScript, React",
        "5 years of experience ahead"
      ]
    }
  ]
}
```

### Get Career Matches
**GET** `/matching/career?limit=10`

**Response**: Similar to mentor matches

### Get Match Suggestions
**GET** `/matching/suggestions`

**Response** (200):
```json
{
  "success": true,
  "suggestions": {
    "mentors": [ ... ],
    "careerMatches": [ ... ]
  }
}
```

## Opportunities

### Get All Opportunities
**GET** `/opportunities?type=job&status=open&page=1`

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "opportunities": [
    {
      "_id": "opp_id",
      "title": "Senior Software Engineer",
      "type": "job",
      "company": "Tech Corp",
      "description": "...",
      "skills": ["JavaScript", "React"],
      "status": "open"
    }
  ]
}
```

### Create Opportunity
**POST** `/opportunities`

**Request Body**:
```json
{
  "title": "Senior Software Engineer",
  "type": "job",
  "description": "We are looking for...",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "isRemote": true,
  "requirements": ["5+ years experience"],
  "skills": ["JavaScript", "React"],
  "applicationDeadline": "2024-12-31"
}
```

### Apply to Opportunity
**POST** `/opportunities/:id/apply`

**Request Body** (optional):
```json
{
  "notes": "I'm very interested in this position"
}
```

## Events

### Get All Events
**GET** `/events?upcoming=true&type=webinar`

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "events": [
    {
      "_id": "event_id",
      "title": "Alumni Webinar",
      "type": "webinar",
      "startDate": "2024-03-15T10:00:00Z",
      "endDate": "2024-03-15T11:00:00Z",
      "location": "Virtual",
      "isVirtual": true,
      "attendees": [ ... ]
    }
  ]
}
```

### Create Event
**POST** `/events`

**Request Body**:
```json
{
  "title": "Alumni Reunion 2024",
  "type": "reunion",
  "description": "Annual alumni gathering",
  "startDate": "2024-06-15T18:00:00Z",
  "endDate": "2024-06-15T22:00:00Z",
  "location": "Main Campus",
  "isVirtual": false,
  "maxAttendees": 200
}
```

### RSVP to Event
**POST** `/events/:id/rsvp`

**Request Body**:
```json
{
  "rsvpStatus": "going"
}
```

**RSVP Status**: `going`, `maybe`, `not_going`

## Donations

### Get All Donations
**GET** `/donations?donor=user_id&paymentStatus=completed`

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "totalAmount": 50000,
  "donations": [
    {
      "_id": "donation_id",
      "amount": 1000,
      "currency": "USD",
      "donationType": "scholarship",
      "paymentStatus": "completed",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Donation
**POST** `/donations`

**Request Body**:
```json
{
  "amount": 1000,
  "currency": "USD",
  "donationType": "scholarship",
  "paymentMethod": "credit_card",
  "designation": "Computer Science Scholarship",
  "isAnonymous": false
}
```

## Messages

### Get Conversations
**GET** `/messages/conversations`

**Response** (200):
```json
{
  "success": true,
  "count": 3,
  "conversations": [
    {
      "_id": "conv_id",
      "participants": [ ... ],
      "lastMessage": { ... },
      "lastMessageAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Send Message
**POST** `/messages`

**Request Body**:
```json
{
  "recipient": "user_id",
  "subject": "Hello",
  "content": "Hi, I'd like to connect..."
}
```

### Get Unread Count
**GET** `/messages/unread`

**Response** (200):
```json
{
  "success": true,
  "unreadCount": 5
}
```

## Groups

### Get All Groups
**GET** `/groups?type=cohort`

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "groups": [
    {
      "_id": "group_id",
      "name": "Class of 2020",
      "type": "cohort",
      "members": [ ... ]
    }
  ]
}
```

### Create Group
**POST** `/groups`

**Request Body**:
```json
{
  "name": "Class of 2020",
  "type": "cohort",
  "description": "Alumni from 2020",
  "isPrivate": false,
  "metadata": {
    "graduationYear": 2020
  }
}
```

## Admin

### Get Dashboard Stats
**GET** `/admin/dashboard`

**Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1000,
    "totalAlumni": 800,
    "totalStudents": 200,
    "verifiedAlumni": 750,
    "pendingVerifications": 50
  }
}
```

### Transition Students
**POST** `/admin/transition-students`

**Response** (200):
```json
{
  "success": true,
  "message": "Transitioned 10 students to alumni",
  "transitions": [ ... ]
}
```

## Analytics

### Community Intelligence (Admin Only)
**GET** `/analytics/community-intelligence`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "distribution": {
      "industry": [
        { "_id": "Technology", "count": 300 },
        { "_id": "Finance", "count": 200 }
      ],
      "country": [ ... ],
      "graduationYear": [ ... ]
    },
    "engagement": {
      "totalEvents": 50,
      "upcomingEvents": 10,
      "totalOpportunities": 100,
      "openOpportunities": 75
    },
    "donations": {
      "totalAmount": 100000,
      "count": 200,
      "averageAmount": 500
    },
    "topContributors": [ ... ]
  }
}
```

### Success Index (Admin Only)
**GET** `/analytics/success-index`

**Response** (200):
```json
{
  "success": true,
  "successIndex": 85,
  "breakdown": {
    "totalAlumni": 800,
    "profilesWithJobs": 750,
    "mentorshipAvailable": 200,
    "openToHiring": 150,
    "openToReferrals": 300,
    "engagementScore": 25,
    "careerScore": 37,
    "contributionScore": 23
  }
}
```

### Give Back Leaderboard
**GET** `/analytics/give-back-leaderboard?limit=20`

**Response** (200):
```json
{
  "success": true,
  "leaderboard": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "giveBackScore": 500,
      "giveBackBreakdown": { ... }
    }
  ]
}
```

## Error Responses

All endpoints may return error responses:

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [ ... ]
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "User role 'student' is not authorized"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

