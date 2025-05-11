# School Vaccination Portal

A full-stack web application for managing and tracking vaccination drives in schools. This system helps school coordinators manage student records, schedule vaccination drives, update vaccination statuses, and generate reports.

## Project Overview

The School Vaccination Portal is a comprehensive solution for schools to manage their vaccination programs. It provides features for student management, vaccination drive scheduling, and reporting.

### Key Features

1. **Authentication & Access Control**
   - Secure login for school coordinators
   - Role-based access control
   - Protected routes and API endpoints

2. **Dashboard Overview**
   - Real-time metrics and insights
   - Vaccination statistics
   - Upcoming drives tracking
   - Quick navigation

3. **Student Management**
   - Individual student records
   - Bulk import via CSV
   - Search and filter capabilities
   - Vaccination status tracking

4. **Vaccination Drive Management**
   - Create and manage drives
   - Schedule validation
   - Conflict prevention
   - Edit capabilities

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js/Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based

## Project Structure

```
school-vaccination/
├── school-vaccination-frontend/    # React frontend application
├── school-vaccination-backend/     # Node.js/Express backend application
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-vaccination.git
   cd school-vaccination
   ```

2. Set up the backend:
   ```bash
   cd school-vaccination-backend
   npm install
   # Create .env file and configure environment variables
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd school-vaccination-frontend
   npm install
   npm start
   ```

## Documentation

- [Backend Documentation](./school-vaccination-backend/README.md)
- [Frontend Documentation](./school-vaccination-frontend/README.md)

## Features Implementation

### User Stories

1. **Dashboard View**
   - Landing page after login
   - Analytics display
   - Navigation menu
   - Empty state handling

2. **Student Management**
   - Individual student form
   - Bulk upload functionality
   - Search and filter options

3. **Report Generation**
   - Vaccination status reports
   - Student details with vaccination history
   - Export capabilities (CSV/Excel/PDF)

4. **Vaccination Drive Management**
   - Drive creation and scheduling
   - Date and capacity management
   - Edit capabilities for future drives

## Development

### Backend Development
- RESTful API design
- MongoDB integration
- Authentication middleware
- Input validation
- Error handling

### Frontend Development
- React components
- Material-UI integration
- State management
- Form handling
- API integration

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
- Password hashing
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