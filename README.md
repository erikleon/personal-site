# Erik Karwatowski's Personal Website

A personal website built with [Next.js](https://nextjs.org/), React, and TypeScript. Features a typewriter animation on the homepage, an about page, Spotify playlist integration, theme toggling, GitHub OAuth–protected routes via NextAuth, and a reusable events/RSVP system.

## Tech Stack

- **Framework:** Next.js 16 (Pages Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js with GitHub OAuth
- **Database:** Upstash Redis (RSVP storage + rate limiting)
- **Styling:** CSS Modules + Sass
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint
- **Analytics:** Vercel Speed Insights

## Pages

| Route        | Description                                      |
| ------------ | ------------------------------------------------ |
| `/`          | Home — typewriter animation cycling action words |
| `/about`     | Bio, resume link, causes, and links              |
| `/playlists` | Spotify playlists fetched via the Spotify API    |
| `/thanks`    | Confirmation page after contact form submission  |
| `/events/:slug` | Password-protected event pages with RSVP       |
| `/admin/rsvps` | Auth-gated RSVP management dashboard             |
| `/404`       | Custom 404 page                                  |

## Getting Started

### Prerequisites

- Node.js ^24.0.0

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

You will need:

- **GitHub OAuth App** credentials (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) — create one at https://github.com/settings/developers
- **NextAuth secret** (`NEXTAUTH_SECRET`) — generate with `openssl rand -base64 32`
- **Authorized GitHub user ID** (`AUTHORIZED_GITHUB_ID`) — find yours at `https://api.github.com/users/<your-username>`
- **Spotify API** credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`) — create an app at https://developer.spotify.com/dashboard/applications
- **Upstash Redis** credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) — create a free database at https://upstash.com

See [.env.local.example](.env.local.example) for the full list.

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Scripts

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the development server                  |
| `npm run build` | Generate the sitemap and build for production |
| `npm start`     | Start the production server                   |
| `npm run lint`  | Run ESLint                                    |
| `npm test`      | Run tests in watch mode                       |

## Project Structure

```
components/       — Reusable UI components (Navigation, Footer, Layout)
  events/         — Event system components (PasswordGate, RSVPForm, EventPage)
data/             — Static data definitions (events)
lib/              — Shared utilities (auth, event cookies, RSVP storage)
pages/            — Next.js pages and API routes
  api/auth/       — NextAuth API route
  api/events/     — Event password verification + RSVP endpoints
  events/         — Dynamic event pages
  admin/          — Auth-gated admin pages
public/           — Static assets and sitemap
scripts/          — Build-time scripts (sitemap, password hashing)
styles/           — CSS Modules
__tests__/        — Jest tests
```

## Deployment

Deploy on [Vercel](https://vercel.com) or any platform that supports Next.js. Make sure all environment variables from `.env.local.example` are configured in your hosting provider.
