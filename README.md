# CreditSea XML Credit Report Processor

A fullstack MERN application that processes XML credit pull data from Experian, stores it in MongoDB, and displays comprehensive reports through a React frontend.

## Features

- XML file upload and validation
- Extraction of credit report data including:
  - Basic personal details
  - Credit score information
  - Account summaries
  - Credit card details
- MongoDB data persistence
- Clean and intuitive React frontend for report visualization

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: MongoDB
- **Additional Tools**: 
  - XML parsing: xml2js
  - API documentation: Swagger/OpenAPI
  - Frontend styling: Material-UI
  - State management: Redux Toolkit

## Project Structure

```
xml-project/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   └── app.js         # Express app setup
│   ├── tests/             # Backend tests
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── App.js
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (v4.4 or higher)
3. npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/creditsea
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Documentation

### Endpoints

1. `POST /api/reports/upload`
   - Upload XML credit report file
   - Returns processed report ID

2. `GET /api/reports/:id`
   - Retrieve processed report by ID

3. `GET /api/reports`
   - List all processed reports

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## License

MIT
#   p a r s e r  
 