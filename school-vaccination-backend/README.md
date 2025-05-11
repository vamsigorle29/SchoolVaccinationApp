# School Vaccination Portal

A full-stack web application for managing and tracking vaccination drives in schools. This system helps school coordinators manage student records, schedule vaccination drives, update vaccination statuses, and generate reports.

## System Overview

The School Vaccination Portal is built using:
- Frontend: React.js with Material-UI
- Backend: Node.js/Express
- Database: MongoDB Atlas
- Authentication: JWT-based

## Features

### 1. Authentication & Access Control
- Secure login system for school coordinators
- JWT-based authentication
- Role-based access control
- Protected routes and API endpoints

### 2. Dashboard Overview
- Real-time metrics and insights
- Total number of students
- Vaccination statistics and percentages
- Upcoming vaccination drives (next 30 days)
- Quick navigation to key features
- Empty state handling

### 3. Student Management
- Individual student record management
- Bulk import via CSV upload
- Search and filter capabilities
- Vaccination status tracking
- Duplicate vaccination prevention

### 4. Vaccination Drive Management
- Create and manage vaccination drives
- Schedule validation (15-day advance notice)
- Conflict prevention
- Edit capabilities for future drives
- Automatic disabling of past drives

## Architecture

### Backend Architecture
```
school-vaccination-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── app.js          # Express application
├── scripts/            # Utility scripts
└── tests/             # Test files
```

### Frontend Architecture
```
school-vaccination-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── App.js         # Main application
```

## API Documentation

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/setup-admin - Initial admin setup

### Students
- GET /api/students - Get all students
- POST /api/students - Add new student
- PATCH /api/students/:id - Update student
- POST /api/students/bulk-import - Bulk import students

### Vaccination Drives
- GET /api/drives - Get all drives
- POST /api/drives - Create new drive
- PATCH /api/drives/:id - Update drive
- GET /api/drives/upcoming - Get upcoming drives

### Reports
- GET /api/reports/statistics - Get vaccination statistics
- GET /api/reports/students - Get student vaccination report
- GET /api/reports/drives - Get drive performance report

## Database Schema

### Student Model
```javascript
{
  studentId: String,
  name: String,
  class: String,
  dateOfBirth: Date,
  gender: String,
  parentName: String,
  contactNumber: String,
  vaccinationStatus: String,
  vaccinationHistory: [{
    vaccineName: String,
    date: Date,
    doseNumber: Number,
    driveId: String
  }]
}
```

### Vaccination Drive Model
```javascript
{
  vaccine: String,
  date: Date,
  totalDoses: Number,
  applicableClasses: [String],
  status: String,
  coordinator: String
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd school-vaccination-backend
   npm install
   ```
3. Create `.env` file:
   ```
   PORT=8080
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.kyjazba.mongodb.net/school-vaccination?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd school-vaccination-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Testing

### Backend Tests
```bash
cd school-vaccination-backend
npm test
```

### Frontend Tests
```bash
cd school-vaccination-frontend
npm test
```

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Environment variable management
- Role-based access control

## Assumptions
1. Single school implementation
2. One coordinator per school
3. Vaccination drives are school-specific
4. No real-time updates required
5. Basic file handling for CSV imports

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any queries, please contact the development team. 