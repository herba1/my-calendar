# AI-Powered Calendar & Task Manager

A full-stack task management application that combines natural language input with visual calendar organization. Users can describe their tasks in plain English, and AI automatically creates, updates, or deletes calendar events with proper scheduling and priority levels.

## Features

- **Natural Language Task Creation**: Describe tasks conversationally - "I have a dentist appointment next Tuesday at 2pm" or "Cancel my morning meeting"
- **Interactive Calendar View**: FullCalendar integration with month and day views
- **Priority-Based Color Coding**: Visual task organization with red (high), amber (medium), and blue (low) priorities
- **Real-time Updates**: Instant task synchronization across calendar and card views
- **CRUD Operations**: Complete task management with create, read, update, and delete functionality

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **AI Integration**: Google Gemini AI for natural language processing
- **Calendar**: FullCalendar with day/month views
- **UI Components**: Radix UI primitives, custom component library

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI Studio API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Database Schema**
   Create a `task` table in your Supabase database:
   ```sql
   CREATE TABLE task (
     task_id SERIAL PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     due_at TIMESTAMP WITH TIME ZONE,
     title TEXT NOT NULL DEFAULT 'Unnamed Task',
     description TEXT,
     tags JSON,
     is_completed BOOLEAN NOT NULL DEFAULT FALSE,
     is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
     priority TEXT NOT NULL DEFAULT 'medium'
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Add Tasks**: Type natural language descriptions in the text area
2. **View Calendar**: Switch between month and day views to see scheduled tasks
3. **Manage Tasks**: Click on task cards to mark complete or delete
4. **AI Processing**: The system automatically interprets your input and creates appropriate calendar events

## API Endpoints

- `POST /api/ai` - Process natural language input
- `GET /api/task` - Retrieve all tasks
- `POST /api/task` - Create new task
- `PUT /api/task` - Update existing task
- `DELETE /api/task` - Delete task

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

Built with modern web technologies for scalable task management and intelligent calendar organization.
