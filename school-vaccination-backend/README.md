# School Vaccination Portal Backend

A Node.js/Express backend for managing school vaccination records and drives.

## Features

- User authentication and authorization
- Student record management
- Vaccination drive scheduling and management
- Comprehensive reporting and statistics
- CSV bulk import for student records
- Conflict detection for vaccination scheduling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/school-vaccination
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

#### POST /api/auth/login
Login with username and password.
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /api/auth/setup
Create initial admin user (first-time setup only).
```json
{
  "username": "string",
  "password": "string"
}
```

### Students

#### GET /api/students
Get all students with pagination and filters.
Query parameters:
- page (default: 1)
- limit (default: 10)
- search (optional)
- class (optional)
- vaccinationStatus (optional)

#### POST /api/students
Add a new student.
```json
{
  "studentId": "string",
  "name": "string",
  "class": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "parentName": "string",
  "contactNumber": "string"
}
```

#### POST /api/students/bulk-import
Bulk import students from CSV file.
Form data:
- file: CSV file

#### PATCH /api/students/:id/vaccination
Update student vaccination status.
```json
{
  "vaccineName": "string",
  "date": "date",
  "driveId": "string",
  "status": "scheduled|completed|missed"
}
```

### Vaccination Drives

#### GET /api/drives
Get all drives with pagination and filters.
Query parameters:
- page (default: 1)
- limit (default: 10)
- status (optional)
- dateFrom (optional)
- dateTo (optional)

#### POST /api/drives
Create a new vaccination drive.
```json
{
  "vaccineName": "string",
  "date": "date",
  "availableDoses": "number",
  "applicableClasses": ["string"],
  "coordinator": "string",
  "notes": "string"
}
```

#### PATCH /api/drives/:id/status
Update drive status.
```json
{
  "status": "scheduled|in-progress|completed|cancelled"
}
```

#### PATCH /api/drives/:id
Update drive details.
```json
{
  "vaccineName": "string",
  "date": "date",
  "availableDoses": "number",
  "applicableClasses": ["string"],
  "coordinator": "string",
  "notes": "string"
}
```

### Reports

#### GET /api/reports/statistics
Get overall vaccination statistics.

#### GET /api/reports/drives
Get drive performance report.
Query parameters:
- dateFrom (optional)
- dateTo (optional)

#### GET /api/reports/students
Get student vaccination report.
Query parameters:
- class (optional)
- vaccinationStatus (optional)

#### GET /api/reports/schedule
Get upcoming vaccination schedule.
Query parameters:
- dateFrom (optional)
- dateTo (optional)

## Error Handling

All API endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Success Response Format

All successful API responses follow this format:
```json
{
  "success": true,
  "data": {} // Response data
}
```

## Development

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm test`: Run tests

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Role-based access control
- CORS enabled
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 