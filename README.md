# essence

Task management application with natural language input. Type "dentist appointment next Tuesday at 2pm" and AI creates the calendar event.

The point is just dump your thoughts, i used to do this alot with claude but then im like why not do it but make a pretty ui and something thats easy to use so i can organize myself quickly! this is the result ongoing? maybe im unsure.

[the site](https://tryessence.app)

## Features

- Natural language task creation and modification
- Calendar view with priority-based color coding
- Google OAuth and anonymous authentication
- Daily usage limits with token-based rate limiting
- Real-time task synchronization

## Tech Stack

- Frontend: Next.js 15, React 19, TailwindCSS
- Backend: Next.js API Routes, Supabase PostgreSQL
- AI: Google Gemini for natural language processing
- UI: FullCalendar, Radix UI, shadcn/ui, custom

## Architecture

The application processes natural language through Google Gemini AI, which outputs structured JSON for database operations. Tasks are stored in PostgreSQL with timezone handling and real-time updates via Supabase.

Built with Next.js 15 and React 19.
