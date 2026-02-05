# System Architecture

## Overview

The Alumni Management System follows a **3-tier architecture** with clear separation of concerns:

1. **Presentation Layer** (React Frontend)
2. **Application Layer** (Express.js Backend)
3. **Data Layer** (MongoDB Database)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │ Context   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       │              │              │                  │
│       └──────────────┼──────────────┘                  │
│                      │                                  │
│              ┌───────▼───────┐                          │
│              │  Axios Client │                          │
│              └───────┬───────┘                          │
└──────────────────────┼──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│              Express.js Backend                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │  │Middleware│  │ Services │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │              │                    │
│       └─────────────┼──────────────┘                    │
│                     │                                    │
│              ┌──────▼──────┐                             │
│              │   Models    │                             │
│              └──────┬──────┘                             │
└─────────────────────┼───────────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────────┐
│                  MongoDB Database                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Users   │  │ Profiles │  │  Events  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Opportunities│Donations│ │ Messages │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Presentation Layer (Frontend)

**Technology**: React 18 with Hooks

**Key Components**:
- **Pages**: Route-level components (Dashboard, Profile, etc.)
- **Components**: Reusable UI components (Navbar, PrivateRoute)
- **Context**: Global state management (AuthContext)
- **Services**: API communication layer (Axios)

**State Management**:
- React Context API for global auth state
- Local component state for UI-specific data
- Can be extended with Redux for complex state

**Routing**:
- React Router v6 for client-side routing
- Protected routes with role-based access

### 2. Application Layer (Backend)

**Technology**: Node.js + Express.js

**Structure**:

#### Routes (`/routes`)
- Handle HTTP requests
- Input validation
- Call service layer
- Return responses

#### Middleware (`/middleware`)
- **Authentication**: JWT verification
- **Authorization**: Role-based access control
- **Validation**: Input sanitization
- **Rate Limiting**: DDoS protection

#### Services (`/services`)
- Business logic
- Complex calculations
- External integrations
- Data transformations

**Key Services**:
- `matchingService.js`: AI-like matching algorithms
- `giveBackService.js`: Give Back Score calculations
- `transitionService.js`: Student-to-alumni transitions

#### Models (`/models`)
- MongoDB schemas
- Data validation
- Relationships
- Indexes

### 3. Data Layer (Database)

**Technology**: MongoDB with Mongoose ODM

**Schema Design Principles**:
- Normalized for data integrity
- Denormalized where needed for performance
- Indexed for query optimization
- Referenced relationships for scalability

## Data Flow

### Authentication Flow
```
1. User submits credentials
2. Frontend sends POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in subsequent requests
7. Backend middleware verifies token on protected routes
```

### Profile Update Flow
```
1. User edits profile form
2. Frontend sends PUT /api/profiles/me
3. Auth middleware verifies JWT
4. Route validates input
5. Service updates profile
6. Model saves to MongoDB
7. Response sent back to frontend
8. Frontend updates UI
```

### Matching Flow
```
1. User requests matches
2. Frontend sends GET /api/matching/suggestions
3. Backend fetches user profile
4. Matching service queries potential matches
5. Service calculates compatibility scores
6. Results sorted and filtered
7. Response sent to frontend
8. Frontend displays matches with scores
```

## Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication
- **Token Expiry**: Configurable (default 7 days)
- **Password Hashing**: bcrypt with salt rounds

### Authorization
- **Role-Based Access Control (RBAC)**: Admin, Alumni, Student, Faculty
- **Route Protection**: Middleware checks user role
- **Resource-Level Security**: Users can only modify their own data

### Input Validation
- **Express Validator**: Server-side validation
- **Mongoose Validation**: Schema-level validation
- **Sanitization**: XSS prevention

### Rate Limiting
- **Express Rate Limit**: 100 requests per 15 minutes per IP
- **Prevents**: DDoS attacks, brute force

## Scalability Considerations

### Database
- **Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Aggregation**: Efficient data aggregation for analytics

### Caching Strategy (Future)
- Redis for session management
- Cache frequently accessed data
- Invalidate on updates

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Load balancer ready
- Database connection pooling

## API Design Principles

### RESTful Conventions
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 201, 400, 401, 403, 404, 500)

### Response Format
```json
{
  "success": true/false,
  "data": {},
  "message": "string",
  "errors": []
}
```

### Error Handling
- Consistent error format
- Meaningful error messages
- Stack traces in development only

## Innovation Hooks Architecture

### 1. Give Back Score
- **Service**: `giveBackService.js`
- **Calculation**: Real-time scoring based on activities
- **Storage**: Stored in Profile model
- **Updates**: Triggered by relevant actions (donations, events, etc.)

### 2. Career Timeline
- **Storage**: Array in Profile model
- **Visualization**: Frontend rendering
- **Updates**: Via dedicated API endpoint

### 3. Auto-Transition
- **Service**: `transitionService.js`
- **Trigger**: Scheduled job or manual admin action
- **Process**: Updates User role, resets verification status

### 4. Success Index
- **Calculation**: Real-time aggregation
- **Metrics**: Engagement, career, contribution scores
- **Storage**: Calculated on-demand, not stored

## Deployment Architecture

### Development
- Local MongoDB
- Development server (nodemon)
- Hot reload for frontend

### Production
- MongoDB Atlas or self-hosted
- Environment variables for secrets
- Build optimization
- CDN for static assets

## Monitoring & Logging (Future)

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API usage metrics

## Testing Strategy (Future)

- Unit tests (Jest)
- Integration tests
- E2E tests (Cypress)
- API testing (Postman/Newman)

