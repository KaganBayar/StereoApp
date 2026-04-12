# STEREOAPP (müzikendim)

A full-stack music streaming application built with modern web technologies, featuring real-time audio playback, user authentication, playlist management, and an admin panel for content management.

App Link:
https://stereo-dt4imhgnu-kagan-bayars-projects.vercel.app/

---

## Technologies Used

### Frontend

- **Next.js 14** - React framework with App Router for server-side rendering and client components
- **TypeScript** - Static typing for improved developer experience and code reliability
- **Tailwind CSS** - Utility-first CSS framework for responsive styling
- **Radix UI** - Headless UI primitives for accessible components (Dialog, Slider, Alert Dialog)
- **Howler.js** - Audio library for cross-browser audio playback with advanced controls
- **Lucide React / React Icons** - Icon libraries for UI elements
- **TanStack React Query** - Server state management and data fetching

### Backend

- **Next.js Server Actions** - Server-side logic with seamless client integration
- **Prisma ORM** - Type-safe database client with schema migrations
- **PostgreSQL** - Relational database for persistent data storage
- **JWT (jose)** - JSON Web Token authentication with access/refresh token rotation
- **bcryptjs** - Password hashing for secure credential storage
- **Zod** - Runtime schema validation for type safety

### Infrastructure

- **Firebase Storage** - Cloud storage for audio files and images
- **Firebase Authentication** - Supplementary auth for client-side features

### Architecture Patterns

- **Layered Architecture** - Separation of concerns with Actions → Services → Repositories
- **Dependency Injection Container** - Centralized service management for testability
- **Repository Pattern** - Abstract database operations with base repository class
- **Context API** - Global state management for user session and audio playback

---

## Features

### User Features

- **Authentication System**

  - User registration and login with email/password
  - JWT-based session management with automatic token refresh
  - Secure cookie handling for access and refresh tokens

- **Music Playback**

  - Real-time audio streaming with Howler.js
  - Play, pause, seek, and volume controls
  - Loop toggle and progress tracking
  - Persistent player bar across navigation

- **Library Management**

  - Create and manage personal playlists
  - Browse songs, albums, and artists
  - Search functionality with filters (Songs, Artists, Albums, Playlists)
  - Genre-based music discovery

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
  - Add, edit, and delete songs with audio file upload
  - Manage albums with cover art
  - Create and update artist profiles
  - Automatic audio duration detection

---

## Setup and Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase project with Storage enabled
- npm or yarn package manager

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
   - Enable Storage and Authentication
   - Create a `config/firebase.ts` file with your Firebase configuration

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Register a new account or login
   - Access admin panel at `/admin` (requires admin role)

### Database Seeding (Optional)

To create an admin user, run:

```bash
npx ts-node src/scripts/createAdmin.ts
```

### Building for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (Home)/            # Protected routes with layout
│   │   ├── admin/         # Admin panel
│   │   ├── genre/         # Genre pages
│   │   ├── playlist/      # Playlist detail pages
│   │   └── search/        # Search page
│   └── components/        # React components
├── contexts/              # React Context providers
├── lib/
│   ├── client/           # Client-side utilities
│   ├── server/           # Server-side code
│   │   ├── DI_container/ # Dependency injection
│   │   ├── layers/       # Architecture layers
│   │   │   ├── actions/      # Server actions
│   │   │   ├── repositories/ # Data access
│   │   │   └── services/     # Business logic
│   │   └── Schemas/      # Zod validation schemas
│   └── shared/           # Shared types and utilities
└── provider/             # Context providers
```

---

## License

This project is for educational purposes.
