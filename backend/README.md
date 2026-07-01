# URL Shortener Backend

This is the backend service for the URL Shortener application, built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) using a PostgreSQL database.

## Architecture

The application is structured into domain-driven modules:

- **Auth Module (`src/auth`)**: Handles user registration and authentication using JWT and bcrypt.
- **Users Module (`src/users`)**: Manages user data and database operations.
- **Urls Module (`src/urls`)**: Core module for creating short URLs, handling redirects, and managing user URLs.
- **Analytics Module (`src/analytics`)**: Records click events for short URLs and provides analytics data (e.g., clicks by day, top referrers).

## Database Schema (Entities)

The application uses three main entities:

1. **User (`src/users/user.entity.ts`)**: Stores user credentials.
   - `id` (UUID)
   - `email` (Unique)
   - `passwordHash` (hashed using bcrypt)
   - One-to-Many relationship with `Url`

2. **Url (`src/urls/urls.entity.ts`)**: Stores short link data.
   - `id` (UUID)
   - `code` (Unique short code)
   - `originalUrl` (Destination URL)
   - `clicks` (Total click counter)
   - `expiresAt` (Optional expiry date)
   - Many-to-One relationship with `User` (owner)

3. **Click (`src/analytics/click.entity.ts`)**: Stores analytics for each redirect.
   - `id` (UUID)
   - `urlId` (Foreign key to Url)
   - `clickedAt` (Timestamp)
   - `referer` (HTTP referer)
   - `userAgent` (Client user agent)
   - `ipHash` (Privacy-safe hashed IP address)

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user (expects `email`, `password`). Returns user info and `accessToken`.
- `POST /auth/login` - Authenticate an existing user. Returns user info and `accessToken`.

### URLs
*Note: Endpoints with *(Auth Required)* expect a valid JWT Bearer token in the `Authorization` header.*

- `POST /urls` *(Auth Required)* - Create a short URL. Accepts `originalUrl`, and optional `customCode`, `expiresInDays`.
- `GET /:code` *(Public)* - Redirects to the original URL and asynchronously records a click event. If the link is expired, returns a `410 Gone`.
- `GET /urls/:code/stats` *(Auth Required)* - Retrieve basic stats for a short URL owned by the current user.
- `DELETE /urls/:code` *(Auth Required)* - Delete a short URL owned by the current user.

### Analytics
- `GET /urls/:code/analytics?days=30` *(Auth Required)* - Get detailed analytics for a URL, including clicks by day and top referrers.

## Setup and Installation

### Prerequisites
- Node.js
- PostgreSQL Database

### Configuration
1. Create a `.env` file in the root of the `backend` folder.
2. Provide the following environment variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=url_shortener_db
   PORT=3000
   ```

### Running the Application

```bash
# Install dependencies
npm install

# Run in development mode (watch mode)
npm run start:dev

# Run in production mode
npm run start:prod
```

## Key Features

- **Privacy-First Analytics**: IP addresses are hashed using SHA-256 before being stored in the database (`AnalyticsService.hashIp`) to protect user privacy.
- **Performant Redirects**: Click analytics are processed asynchronously (fire-and-forget) to ensure minimal latency during the redirect process.
- **Global Validation**: DTOs are validated globally using the NestJS `ValidationPipe` with `whitelist: true` to strip out unrecognized properties.
- **Exception Handling**: A global `AllExceptionsFilter` catches and consistently formats all unhandled exceptions.
