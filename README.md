# TaskAI - AI-Powered Task Management System

TaskAI is a modern task management system that leverages artificial intelligence to help users organize, optimize, and complete their tasks more efficiently. The application features real-time updates, intelligent task suggestions, and a beautiful dark theme interface.

![TaskAI Screenshot](screenshots/taskai-dashboard.png)

## 🌟 Features

- **AI-Powered Task Management**
  - Intelligent task breakdown and suggestions
  - Smart time estimation and scheduling
  - Focus and productivity optimization
  - Real-time task assistance

- **Real-Time Collaboration**
  - WebSocket-based instant updates
  - Live task status changes
  - Collaborative task management

- **Modern User Interface**
  - Sleek dark theme with yellow accents
  - Responsive design for all devices
  - Smooth animations and transitions
  - Interactive task cards

- **Smart Authentication**
  - Secure user authentication
  - JWT-based session management
  - Protected routes and API endpoints

## 🚀 Technologies

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - shadcn/ui components
  - TanStack Query for data management
  - WebSocket for real-time updates

- **Backend**
  - Express.js (Node.js)
  - Google's Gemini AI for task suggestions
  - WebSocket server for real-time features
  - JWT authentication
  - In-memory storage (ready for PostgreSQL migration)

## 🛠️ Setup and Installation

1. **Environment Variables**
   ```env
   GOOGLE_API_KEY=your_gemini_ai_api_key
   SESSION_SECRET=your_session_secret
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /api/register
Body: { username: string, password: string }
Response: User object

POST /api/login
Body: { username: string, password: string }
Response: User object

POST /api/logout
Response: 200 OK

GET /api/user
Response: Current user object or 401
```

### Task Management Endpoints

```typescript
GET /api/tasks
Response: Task[]

POST /api/tasks
Body: {
  title: string,
  description?: string,
  dueDate?: Date,
  reminder?: Date,
  checkpoints?: string[]
}
Response: Task object

PATCH /api/tasks/:id
Body: Partial<Task>
Response: Updated Task object

POST /api/tasks/assist
Body: { taskId: number, query: string }
Response: AI assistance object
```

## 💡 Usage Examples

### Creating a Task with AI Assistance

1. Click the "New Task" button
2. Enter task details and optional due date/reminder
3. Submit to receive AI-generated suggestions
4. Use the AI Assistant button on any task to:
   - Get task optimization tips
   - Break down complex tasks
   - Set smart reminders
   - Get focus strategies

### Task Management

- Mark tasks as complete with the checkbox
- View AI suggestions in the expandable card
- Set due dates and reminders
- Track progress with checkpoints
- Get real-time updates across devices

## 🎨 Theme Customization

The application uses a custom theme with:
- Dark background with yellow accents
- Neon effects and gradients
- Smooth animations
- Glass-morphism elements

Customize the theme in `theme.json` and `index.css`.

## 🔄 Real-Time Features

TaskAI uses WebSocket connections to provide:
- Instant task updates
- Live status changes
- Real-time AI suggestions
- Collaborative features

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Future Enhancements

- PostgreSQL database integration
- Team collaboration features
- Advanced AI task analysis
- Mobile app development
- Calendar integration
- External API integrations

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
