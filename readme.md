# STEREOAPP (müzikendim)

A full-stack music streaming application built with modern web technologies, featuring real-time audio playback, user authentication, playlist management, and an admin panel for content management.

**Live App:** https://stereo-app-pied.vercel.app?_vercel_share=LYHWKNobROxlNpXtexcLThsuIvue4pPH

---

## Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router, Server Components, and Turbopack
- **React 19** - UI library
- **TypeScript 5** - Static typing throughout the codebase
- **Tailwind CSS** - Utility-first CSS framework for responsive styling
- **Radix UI** - Headless UI primitives for accessible components (Dialog, Slider, Alert Dialog, Popover)
- **Howler.js** - Audio library for cross-browser audio playback with advanced controls
- **Lucide React** - Icon library for UI elements
- **TanStack React Query** - Server state management and data fetching

### Backend

- **Next.js Server Actions** - Server-side logic with seamless client integration (no REST API)
- **Prisma ORM** - Type-safe database client with schema migrations
- **PostgreSQL** - Relational database for persistent data storage
- **JWT (jose)** - JSON Web Token authentication with access/refresh token rotation
- **bcryptjs** - Password hashing for secure credential storage
- **Zod** - Runtime schema validation for type safety

### Infrastructure

- **Firebase Storage** - Cloud storage for audio files and images
- **Vercel** - Deployment platform

### Architecture Patterns

- **Layered Architecture** - Separation of concerns with Actions → Services → Repositories
- **Dependency Injection Container** - Centralized service management for testability
- **Repository Pattern** - Abstract database operations with base repository class
- **Context API + Reducer** - Global state management for user session and audio playback

---

## Features

### User Features

- **Authentication System**
  - User registration and login with email/password
  - JWT-based session management with automatic token refresh
  - Secure HTTP-only cookie handling for access and refresh tokens

- **Music Playback**
  - Real-time audio streaming with Howler.js
  - Play, pause, seek, and volume controls
  - Loop toggle and progress tracking
  - Persistent player bar across navigation

- **Library Management**
  - Create and manage personal playlists
  - Add/remove songs from playlists
  - Favorite songs
  - Browse songs, albums, and artists
  - Genre-based music discovery
  - Search functionality with filters (Songs, Artists, Albums, Playlists)

- **Responsive UI**
  - Sidebar navigation with user library
  - Dark theme optimized for music streaming
  - Mobile-friendly layout

### Admin Features

- **User Management**
  - View all registered users
  - Edit user information and roles
  - Delete users with session invalidation

- **Content Management**
  - Add, edit, and delete songs with audio file upload to Firebase Storage
  - Manage albums with cover art
  - Create and update artist profiles
  - Automatic audio duration detection on upload

---

## Setup and Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase project with Storage enabled
- npm package manager

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/muzikendim"

# JWT Secrets
JWT_SECRET_KEY="your-access-token-secret"
JWT_REFRESH_KEY="your-refresh-token-secret"

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Environment
NODE_ENV="development"
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/stereoapp.git
   cd stereoapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Storage
   - Add your Firebase config to `config/firebase.js`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Register a new account or login
   - Access admin panel at `/admin` (requires admin role)

### Available Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Start development server with Turbopack |
| `npm run build`  | Build for production                    |
| `npm start`      | Start production server                 |
| `npm run lint`   | Run ESLint                              |
| `npm test`       | Run Vitest tests                        |
| `npm run studio` | Open Prisma Studio                      |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (Home)/            # Protected routes with shared layout
│   │   ├── admin/         # Admin panel
│   │   ├── genre/         # Genre pages
│   │   ├── playlist/      # Playlist detail pages
│   │   └── search/        # Search page
│   └── components/        # React components
│       ├── admin/         # Admin-specific components
│       └── ui/            # shadcn/ui base components
├── contexts/              # React Context providers (User, Audio, Playlist)
├── lib/
│   ├── client/           # Client-side utilities
│   ├── server/           # Server-side code
│   │   ├── DI_container/ # Dependency injection container
│   │   ├── Errors/       # Custom error classes
│   │   ├── Schemas/      # Zod validation schemas
│   │   ├── Types/        # TypeScript type definitions
│   │   └── layers/       # Architecture layers
│   │       ├── actions/      # Server Actions (entry points)
│   │       ├── repositories/ # Data access layer
│   │       └── services/     # Business logic layer
│   └── shared/           # Shared types and utilities
└── provider/             # Context providers
```

---

## Database Schema

Key models in the PostgreSQL database (managed via Prisma):

- **User** — email, hashed password, roles (`member` | `admin`)
- **Song** — name, genre, url, duration, artist/album relations
- **Artist** — name, bio, genre, photo
- **Album** — title, release date, cover art, artist relation
- **Playlist** — user-owned song collections
- **UserFavorite** — many-to-many user ↔ song favorites
- **RefreshToken** — stored tokens with rotation count for security

---

## License

This project is for educational purposes.
