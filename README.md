# SoundWave - SoundCloud Clone Frontend

A modern music streaming platform frontend built with React, TypeScript, and Vite. This project serves as a practice application for backend development, providing a complete UI for a music streaming service.

## 🎵 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Automatic session restoration
- Profile management with avatar upload

### Music Player
- Full-featured audio player with HTML5 Audio API
- Play/pause, next/previous controls
- Volume control with slider
- Progress bar with seek functionality
- Queue management
- Automatic play count tracking

### Track Management
- Browse trending and new tracks
- Upload tracks with audio files and cover images
- Drag & drop file upload with validation
- Track metadata (title, description, genre, tags)
- Waveform visualization (canvas-based)
- Track statistics (plays, likes, comments)

### Social Features
- Like/unlike tracks
- Comment on tracks with CRUD operations
- Follow/unfollow users
- User profiles with track listings
- Related tracks recommendations

### UI/UX
- Dark theme with orange accents (#ff5500)
- Responsive layout with fixed navbar, sidebar, and player
- Infinite scroll for track listings
- Skeleton loading states
- Error handling with retry functionality
- Genre filtering and sorting

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **React Query (@tanstack/react-query)** - Server state management and caching
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS Modules** - Scoped styling

## 📁 Project Structure

```
src/
├── api/              # API client and endpoint functions
│   ├── client.ts     # Axios instance with interceptors
│   ├── auth.ts       # Authentication endpoints
│   ├── tracks.ts     # Track CRUD operations
│   ├── likes.ts      # Like/unlike functionality
│   ├── comments.ts   # Comment CRUD operations
│   ├── playlists.ts  # Playlist management
│   └── users.ts      # User profiles and follow
├── components/       # Reusable components
│   ├── Layout/       # Main layout with navbar, sidebar, player
│   ├── TrackCard/    # Track display card
│   └── ProtectedRoute.tsx
├── pages/            # Page components
│   ├── Home.tsx      # Main feed with trending tracks
│   ├── Track.tsx     # Individual track page
│   ├── Profile.tsx   # User profile page
│   ├── Upload.tsx    # Track upload form
│   ├── Login.tsx     # Login form
│   └── Register.tsx  # Registration form
├── store/            # Zustand stores
│   ├── authStore.ts  # Authentication state
│   ├── playerStore.ts # Audio player state
│   └── uiStore.ts    # UI state (modals, sidebar)
├── hooks/            # Custom React hooks
│   └── usePlayer.ts  # Audio player integration
├── types/            # TypeScript interfaces
│   └── index.ts      # User, Track, Playlist, Comment, Like
└── App.tsx           # Root component with routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scanalog-front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 🔌 API Integration

The frontend expects a REST API running on `http://localhost:3000/api` with the following endpoints:

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `PUT /auth/me` - Update profile (multipart/form-data)
- `DELETE /auth/me` - Delete account

### Tracks (`/tracks`)
- `GET /tracks` - List tracks (query: page, limit, genre, search)
- `GET /tracks/:id` - Get single track
- `POST /tracks` - Upload track (multipart/form-data)
- `PUT /tracks/:id` - Update track metadata
- `PATCH /tracks/:id/plays` - Increment play count
- `DELETE /tracks/:id` - Delete track

### Likes (`/tracks/:id/likes`)
- `GET /tracks/:id/likes` - Get users who liked track
- `POST /tracks/:id/likes` - Like track
- `DELETE /tracks/:id/likes` - Unlike track

### Comments (`/tracks/:id/comments`, `/comments/:id`)
- `GET /tracks/:id/comments` - Get track comments
- `POST /tracks/:id/comments` - Create comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Playlists (`/playlists`)
- `GET /playlists` - Get user playlists
- `POST /playlists` - Create playlist
- `PUT /playlists/:id` - Update playlist
- `DELETE /playlists/:id` - Delete playlist
- `POST /playlists/:id/tracks` - Add track to playlist
- `DELETE /playlists/:id/tracks/:trackId` - Remove track from playlist

### Users (`/users`)
- `GET /users/:id` - Get user profile
- `GET /users/:id/tracks` - Get user tracks
- `POST /users/:id/follow` - Follow user
- `DELETE /users/:id/follow` - Unfollow user
- `GET /users/:id/followers` - Get followers
- `GET /users/:id/following` - Get following

## 🔐 Authentication Flow

1. User registers/logs in via `/auth/register` or `/auth/login`
2. Backend returns JWT token and user object
3. Token stored in localStorage via Zustand persist
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. On 401 response, user is logged out and redirected to `/login`
6. On app load, if token exists, `GET /auth/me` restores session

## 🎨 Design System

### Colors
- Background: `#1a1a1a`
- Secondary Background: `#0f0f0f`
- Borders: `#2a2a2a`, `#3a3a3a`
- Primary (Orange): `#ff5500`
- Primary Hover: `#ff6a1a`
- Text: `#fff`, `#ccc`, `#999`, `#666`

### Typography
- System fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'`
- Logo: 24px, bold, orange
- Headings: 32-56px, bold
- Body: 14-16px

## 📝 Environment Variables

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

Then update `src/api/client.ts`:
```typescript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

## 🐛 Known Issues

- Upload progress tracking not fully implemented
- Playlist functionality is placeholder
- No real-time notifications
- Waveform is randomly generated (not from actual audio)

## 🔮 Future Enhancements

- WebSocket for real-time updates
- Advanced search with filters
- Playlist collaboration
- Audio visualization (real waveform from audio data)
- Social feed with activity
- Direct messaging
- Mobile responsive improvements

## 📄 License

MIT

---

## 🎯 Backend Implementation Guide

To complete this project, you need to implement a REST API with the following requirements:

### Technology Stack Recommendations
- **Node.js** with Express.js or Fastify
- **Database**: PostgreSQL or MongoDB
- **File Storage**: Local filesystem, AWS S3, or Cloudinary
- **Authentication**: JWT with bcrypt for password hashing
- **File Upload**: Multer or similar multipart/form-data handler

### Database Schema

#### Users Table
```sql
- id (UUID, primary key)
- username (string, unique)
- email (string, unique)
- password_hash (string)
- avatar_url (string, nullable)
- bio (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tracks Table
```sql
- id (UUID, primary key)
- title (string)
- description (text, nullable)
- audio_url (string)
- cover_url (string, nullable)
- duration (integer, seconds)
- genre (string, nullable)
- user_id (UUID, foreign key -> users.id)
- plays (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Likes Table
```sql
- id (UUID, primary key)
- track_id (UUID, foreign key -> tracks.id)
- user_id (UUID, foreign key -> users.id)
- created_at (timestamp)
- UNIQUE(track_id, user_id)
```

#### Comments Table
```sql
- id (UUID, primary key)
- content (text)
- track_id (UUID, foreign key -> tracks.id)
- user_id (UUID, foreign key -> users.id)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Playlists Table
```sql
- id (UUID, primary key)
- title (string)
- description (text, nullable)
- cover_url (string, nullable)
- user_id (UUID, foreign key -> users.id)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Playlist_Tracks Table
```sql
- id (UUID, primary key)
- playlist_id (UUID, foreign key -> playlists.id)
- track_id (UUID, foreign key -> tracks.id)
- position (integer)
- added_at (timestamp)
```

#### Follows Table
```sql
- id (UUID, primary key)
- follower_id (UUID, foreign key -> users.id)
- following_id (UUID, foreign key -> users.id)
- created_at (timestamp)
- UNIQUE(follower_id, following_id)
```

### Key Implementation Details

#### Authentication Middleware
```javascript
// Verify JWT token from Authorization header
// Attach user to request object
// Return 401 if invalid/missing token
```

#### File Upload Handling
- Accept `multipart/form-data`
- Validate file types (audio: mp3/wav/flac, images: jpg/png)
- Validate file sizes (audio: 100MB, images: 5MB)
- Generate unique filenames
- Store files and return URLs
- Extract audio duration using ffprobe or similar

#### Authorization Rules
- Users can only edit/delete their own tracks, comments, playlists
- Users can like any track
- Users can comment on any track
- Users can follow any other user

#### Query Parameters for GET /tracks
- `page` (integer, default 1)
- `limit` (integer, default 20, max 100)
- `genre` (string, filter by genre)
- `search` (string, search in title/description)
- `sort` (string: 'trending', 'new', 'popular')

#### Response Formats

Success (200/201):
```json
{
  "data": { ... },
  "message": "Success"
}
```

Error (4xx/5xx):
```json
{
  "error": "Error message",
  "details": { ... }
}
```

#### CORS Configuration
Allow requests from `http://localhost:5173` (or your frontend URL)

#### Security Considerations
- Hash passwords with bcrypt (10+ rounds)
- Validate all inputs
- Sanitize user-generated content
- Rate limiting on auth endpoints
- File type validation (magic bytes, not just extension)
- SQL injection prevention (use parameterized queries)
- XSS prevention (escape HTML in comments)

### Testing Checklist
- [ ] User registration with duplicate email/username handling
- [ ] User login with wrong credentials
- [ ] JWT token expiration and refresh
- [ ] File upload with invalid types/sizes
- [ ] Track CRUD operations with authorization
- [ ] Like/unlike idempotency
- [ ] Comment CRUD with authorization
- [ ] Follow/unfollow idempotency
- [ ] Pagination and filtering
- [ ] Play count increment (prevent spam)

### Deployment Considerations
- Use environment variables for secrets
- Set up file storage (S3 recommended for production)
- Configure CDN for audio/image delivery
- Set up database backups
- Monitor API performance and errors
- Implement logging (Winston, Pino)
- Set up health check endpoint

Good luck building the backend! 🚀
