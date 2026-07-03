# TaskFlow

TaskFlow is a full-stack MERN task management and team collaboration application designed with a professional SaaS-style interface. It allows users to manage personal tasks, create teams, assign work to team members, track progress, and collaborate through role-based permissions.

## Live Demo

TaskFlow is deployed and available online.

**Live Application:** [Open TaskFlow](https://taskflow-app-huhk.onrender.com)

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Persistent login using local storage
- Secure password hashing

### Task Management

- Create, view, edit, and delete tasks
- Task status: To Do, In Progress, and Completed
- Priority levels: Low, Medium, and High
- Due date management
- Search tasks
- Filter by status and priority
- Quick task status updates
- Overdue task indicators

### Dashboard

- Real-time task statistics
- Total task count
- In-progress task count
- Completed task count
- Due-soon task count
- Completion percentage visualization
- Recent task activity
- Assigned-task collaboration indicators

### Team Collaboration

- Create a team or workspace
- Add registered users by email
- Owner and Member roles
- Remove team members
- Assign tasks to team members
- View tasks assigned by another user
- Members can update assigned task status
- Only task creators can edit or delete tasks

### Responsive Design

- Professional SaaS-style user interface
- Responsive dashboard
- Mobile navigation sidebar
- Responsive task cards and filters
- Mobile-friendly create/edit task modal
- Responsive team management page

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Lucide React
- Custom CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

### Deployment

- Render
- MongoDB Atlas

## Project Structure

```text
TaskManagementSystem/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── styles/
│
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/preetisha08/TaskFlow.git
cd TaskFlow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Install frontend dependencies

Open another terminal and run:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Future Improvements

- Task comments and activity history
- Notifications
- Team invitations
- Drag-and-drop Kanban board

## Author

**Preetisha Purkayastha**

- GitHub: https://github.com/preetisha08
- LinkedIn: https://www.linkedin.com/in/preetisha-purkayastha-159882352
