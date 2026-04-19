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
# Backend API Specification

Detailed API documentation for implementing the SoundWave backend.

Base URL: `http://localhost:3000/api`

## Response Format

All responses follow this structure:

**Success (200/201):**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message",
  "details": { "field": "validation error" }
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": null,
    "bio": null,
    "createdAt": "2026-04-19T19:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validation error (missing fields, invalid email)
- `409` - Email or username already exists

---

### POST /auth/login
Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatars/johndoe.jpg",
    "bio": "Music producer from LA",
    "createdAt": "2026-04-19T19:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### POST /auth/logout
Logout user (optional - can be client-side only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatars/johndoe.jpg",
  "bio": "Music producer from LA",
  "createdAt": "2026-04-19T19:00:00.000Z"
}
```

**Errors:**
- `401` - Invalid or missing token

---

### PUT /auth/me
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (multipart/form-data):**
```
username: "johndoe_updated"
bio: "Electronic music producer"
avatar: <file> (optional, jpg/png, max 5MB)
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe_updated",
  "email": "john@example.com",
  "avatar": "https://example.com/avatars/new-avatar.jpg",
  "bio": "Electronic music producer",
  "createdAt": "2026-04-19T19:00:00.000Z"
}
```

**Errors:**
- `400` - Invalid file type or size
- `401` - Unauthorized
- `409` - Username already taken

---

### DELETE /auth/me
Delete user account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized

---

## Track Endpoints

### GET /tracks
Get list of tracks with pagination and filters.

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)
- `genre` (string, optional) - Filter by genre
- `search` (string, optional) - Search in title/description
- `sort` (string, optional) - "trending", "new", "popular"

**Example Request:**
```
GET /tracks?page=1&limit=20&genre=Electronic&sort=trending
```

**Response (200):**
```json
{
  "tracks": [
    {
      "id": "track-uuid-1",
      "title": "Midnight Dreams",
      "description": "Chill electronic vibes",
      "audioUrl": "https://example.com/tracks/midnight-dreams.mp3",
      "coverUrl": "https://example.com/covers/midnight-dreams.jpg",
      "duration": 245,
      "genre": "Electronic",
      "userId": "user-uuid-1",
      "user": {
        "id": "user-uuid-1",
        "username": "djproducer",
        "avatar": "https://example.com/avatars/djproducer.jpg"
      },
      "plays": 15420,
      "likes": 892,
      "comments": 45,
      "createdAt": "2026-04-18T10:30:00.000Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

---

### GET /tracks/:id
Get single track by ID.

**Response (200):**
```json
{
  "id": "track-uuid-1",
  "title": "Midnight Dreams",
  "description": "Chill electronic vibes for late night coding sessions",
  "audioUrl": "https://example.com/tracks/midnight-dreams.mp3",
  "coverUrl": "https://example.com/covers/midnight-dreams.jpg",
  "duration": 245,
  "genre": "Electronic",
  "userId": "user-uuid-1",
  "user": {
    "id": "user-uuid-1",
    "username": "djproducer",
    "email": "dj@example.com",
    "avatar": "https://example.com/avatars/djproducer.jpg",
    "bio": "Electronic music producer"
  },
  "plays": 15420,
  "likes": 892,
  "comments": 45,
  "createdAt": "2026-04-18T10:30:00.000Z"
}
```

**Errors:**
- `404` - Track not found

---

### POST /tracks
Upload new track.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (multipart/form-data):**
```
title: "My New Track"
description: "This is my latest creation"
genre: "Hip-hop"
audio: <file> (required, mp3/wav/flac, max 100MB)
cover: <file> (optional, jpg/png, max 5MB)
```

**Response (201):**
```json
{
  "id": "new-track-uuid",
  "title": "My New Track",
  "description": "This is my latest creation",
  "audioUrl": "https://example.com/tracks/my-new-track.mp3",
  "coverUrl": "https://example.com/covers/my-new-track.jpg",
  "duration": 180,
  "genre": "Hip-hop",
  "userId": "current-user-uuid",
  "user": {
    "id": "current-user-uuid",
    "username": "johndoe",
    "avatar": "https://example.com/avatars/johndoe.jpg"
  },
  "plays": 0,
  "likes": 0,
  "comments": 0,
  "createdAt": "2026-04-19T19:15:00.000Z"
}
```

**Errors:**
- `400` - Missing required fields or invalid file
- `401` - Unauthorized
- `413` - File too large

---

### PUT /tracks/:id
Update track metadata.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Updated Track Title",
  "description": "Updated description",
  "genre": "Electronic"
}
```

**Response (200):**
```json
{
  "id": "track-uuid",
  "title": "Updated Track Title",
  "description": "Updated description",
  "audioUrl": "https://example.com/tracks/track.mp3",
  "coverUrl": "https://example.com/covers/track.jpg",
  "duration": 245,
  "genre": "Electronic",
  "userId": "user-uuid",
  "plays": 15420,
  "likes": 892,
  "comments": 45,
  "createdAt": "2026-04-18T10:30:00.000Z"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not track owner
- `404` - Track not found

---

### PATCH /tracks/:id/plays
Increment play count.

**Response (200):**
```json
{
  "plays": 15421
}
```

**Note:** Implement rate limiting to prevent spam (e.g., max 1 increment per user per track per minute)

---

### DELETE /tracks/:id
Delete track.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Track deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not track owner
- `404` - Track not found

---

## Like Endpoints

### GET /tracks/:id/likes
Get users who liked the track.

**Response (200):**
```json
[
  {
    "id": "user-uuid-1",
    "username": "musiclover",
    "avatar": "https://example.com/avatars/musiclover.jpg"
  },
  {
    "id": "user-uuid-2",
    "username": "djfan",
    "avatar": "https://example.com/avatars/djfan.jpg"
  }
]
```

---

### POST /tracks/:id/likes
Like a track.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "message": "Track liked successfully"
}
```

**Note:** Should be idempotent - if already liked, return 200 instead of error

**Errors:**
- `401` - Unauthorized
- `404` - Track not found

---

### DELETE /tracks/:id/likes
Unlike a track.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Track unliked successfully"
}
```

**Note:** Should be idempotent - if not liked, return 200 instead of error

**Errors:**
- `401` - Unauthorized
- `404` - Track not found

---

## Comment Endpoints

### GET /tracks/:id/comments
Get comments for a track.

**Response (200):**
```json
[
  {
    "id": "comment-uuid-1",
    "content": "Amazing track! Love the vibes",
    "trackId": "track-uuid",
    "userId": "user-uuid-1",
    "user": {
      "id": "user-uuid-1",
      "username": "musicfan",
      "avatar": "https://example.com/avatars/musicfan.jpg"
    },
    "createdAt": "2026-04-19T15:30:00.000Z"
  },
  {
    "id": "comment-uuid-2",
    "content": "This is fire 🔥",
    "trackId": "track-uuid",
    "userId": "user-uuid-2",
    "user": {
      "id": "user-uuid-2",
      "username": "producer123",
      "avatar": "https://example.com/avatars/producer123.jpg"
    },
    "createdAt": "2026-04-19T16:45:00.000Z"
  }
]
```

---

### POST /tracks/:id/comments
Create a comment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Great track! Keep it up"
}
```

**Response (201):**
```json
{
  "id": "new-comment-uuid",
  "content": "Great track! Keep it up",
  "trackId": "track-uuid",
  "userId": "current-user-uuid",
  "user": {
    "id": "current-user-uuid",
    "username": "johndoe",
    "avatar": "https://example.com/avatars/johndoe.jpg"
  },
  "createdAt": "2026-04-19T19:15:00.000Z"
}
```

**Errors:**
- `400` - Empty content
- `401` - Unauthorized
- `404` - Track not found

---

### PUT /comments/:id
Update a comment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Updated comment text"
}
```

**Response (200):**
```json
{
  "id": "comment-uuid",
  "content": "Updated comment text",
  "trackId": "track-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "username": "johndoe",
    "avatar": "https://example.com/avatars/johndoe.jpg"
  },
  "createdAt": "2026-04-19T15:30:00.000Z"
}
```

**Errors:**
- `400` - Empty content
- `401` - Unauthorized
- `403` - Not comment owner
- `404` - Comment not found

---

### DELETE /comments/:id
Delete a comment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not comment owner
- `404` - Comment not found

---

## Playlist Endpoints

### GET /playlists
Get current user's playlists.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "playlist-uuid-1",
    "title": "Chill Vibes",
    "description": "Relaxing tracks for coding",
    "coverUrl": "https://example.com/covers/playlist1.jpg",
    "userId": "current-user-uuid",
    "tracks": [
      {
        "id": "track-uuid-1",
        "title": "Midnight Dreams",
        "audioUrl": "https://example.com/tracks/track1.mp3",
        "coverUrl": "https://example.com/covers/track1.jpg",
        "duration": 245,
        "userId": "user-uuid-1",
        "user": {
          "id": "user-uuid-1",
          "username": "djproducer",
          "avatar": "https://example.com/avatars/djproducer.jpg"
        },
        "plays": 15420,
        "likes": 892
      }
    ],
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
]
```

---

### POST /playlists
Create a playlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "My Favorites",
  "description": "All my favorite tracks"
}
```

**Response (201):**
```json
{
  "id": "new-playlist-uuid",
  "title": "My Favorites",
  "description": "All my favorite tracks",
  "coverUrl": null,
  "userId": "current-user-uuid",
  "tracks": [],
  "createdAt": "2026-04-19T19:15:00.000Z"
}
```

**Errors:**
- `400` - Missing title
- `401` - Unauthorized

---

### PUT /playlists/:id
Update playlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Updated Playlist Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "playlist-uuid",
  "title": "Updated Playlist Name",
  "description": "Updated description",
  "coverUrl": "https://example.com/covers/playlist.jpg",
  "userId": "user-uuid",
  "tracks": [...],
  "createdAt": "2026-04-15T10:00:00.000Z"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not playlist owner
- `404` - Playlist not found

---

### DELETE /playlists/:id
Delete playlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Playlist deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not playlist owner
- `404` - Playlist not found

---

### POST /playlists/:id/tracks
Add track to playlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "trackId": "track-uuid"
}
```

**Response (200):**
```json
{
  "id": "playlist-uuid",
  "title": "My Favorites",
  "description": "All my favorite tracks",
  "coverUrl": null,
  "userId": "current-user-uuid",
  "tracks": [
    {
      "id": "track-uuid",
      "title": "Midnight Dreams",
      "audioUrl": "https://example.com/tracks/track.mp3",
      "coverUrl": "https://example.com/covers/track.jpg",
      "duration": 245,
      "userId": "user-uuid",
      "plays": 15420,
      "likes": 892
    }
  ],
  "createdAt": "2026-04-15T10:00:00.000Z"
}
```

**Errors:**
- `400` - Missing trackId
- `401` - Unauthorized
- `403` - Not playlist owner
- `404` - Playlist or track not found
- `409` - Track already in playlist

---

### DELETE /playlists/:id/tracks/:trackId
Remove track from playlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Track removed from playlist"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Not playlist owner
- `404` - Playlist or track not found

---

## User Endpoints

### GET /users/:id
Get user profile.

**Response (200):**
```json
{
  "id": "user-uuid",
  "username": "djproducer",
  "email": "dj@example.com",
  "avatar": "https://example.com/avatars/djproducer.jpg",
  "bio": "Electronic music producer from Berlin",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

**Errors:**
- `404` - User not found

---

### GET /users/:id/tracks
Get user's tracks.

**Response (200):**
```json
[
  {
    "id": "track-uuid-1",
    "title": "Midnight Dreams",
    "description": "Chill electronic vibes",
    "audioUrl": "https://example.com/tracks/track1.mp3",
    "coverUrl": "https://example.com/covers/track1.jpg",
    "duration": 245,
    "genre": "Electronic",
    "userId": "user-uuid",
    "user": {
      "id": "user-uuid",
      "username": "djproducer",
      "avatar": "https://example.com/avatars/djproducer.jpg"
    },
    "plays": 15420,
    "likes": 892,
    "comments": 45,
    "createdAt": "2026-04-18T10:30:00.000Z"
  }
]
```

**Errors:**
- `404` - User not found

---

### POST /users/:id/follow
Follow a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "message": "User followed successfully"
}
```

**Note:** Should be idempotent - if already following, return 200

**Errors:**
- `400` - Cannot follow yourself
- `401` - Unauthorized
- `404` - User not found

---

### DELETE /users/:id/follow
Unfollow a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User unfollowed successfully"
}
```

**Note:** Should be idempotent - if not following, return 200

**Errors:**
- `401` - Unauthorized
- `404` - User not found

---

### GET /users/:id/followers
Get user's followers.

**Response (200):**
```json
[
  {
    "id": "follower-uuid-1",
    "username": "musicfan",
    "avatar": "https://example.com/avatars/musicfan.jpg",
    "bio": "Music enthusiast"
  },
  {
    "id": "follower-uuid-2",
    "username": "producer123",
    "avatar": "https://example.com/avatars/producer123.jpg",
    "bio": "Aspiring producer"
  }
]
```

**Errors:**
- `404` - User not found

---

### GET /users/:id/following
Get users that this user follows.

**Response (200):**
```json
[
  {
    "id": "following-uuid-1",
    "username": "djmaster",
    "avatar": "https://example.com/avatars/djmaster.jpg",
    "bio": "Professional DJ"
  },
  {
    "id": "following-uuid-2",
    "username": "beatmaker",
    "avatar": "https://example.com/avatars/beatmaker.jpg",
    "bio": "Hip-hop producer"
  }
]
```

**Errors:**
- `404` - User not found

---

## Implementation Notes

### Authentication
- Use JWT with expiration (e.g., 7 days)
- Store hashed passwords with bcrypt (10+ rounds)
- Include user ID in JWT payload

### File Storage
- Generate unique filenames (UUID + original extension)
- Validate MIME types using magic bytes, not just extensions
- Store files in organized directories (e.g., `/uploads/tracks/2026/04/`)
- Return full URLs in responses

### Audio Duration Extraction
Use ffprobe or similar:
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio.mp3
```

### Rate Limiting
- Auth endpoints: 5 requests per minute per IP
- Upload endpoints: 10 requests per hour per user
- Play increment: 1 per track per user per minute

### Database Indexes
- Users: email, username
- Tracks: userId, genre, createdAt
- Likes: (trackId, userId) unique
- Comments: trackId, userId
- Follows: (followerId, followingId) unique

### CORS
```javascript
{
  origin: 'http://localhost:5173',
  credentials: true
}
```
