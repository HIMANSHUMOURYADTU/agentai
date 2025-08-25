# Onboarding Analyzer API Documentation

## Authentication

All API endpoints require authentication. Use one of the following methods:

### JWT Token (Recommended)
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

### API Key (Coming Soon)
\`\`\`
X-API-Key: <your_api_key>
\`\`\`

## Endpoints

### Projects

#### GET /api/projects
Get all projects for the authenticated user.

**Response:**
\`\`\`json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project description",
      "funnel_steps": ["Step 1", "Step 2", "Step 3"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "user_id": "uuid"
    }
  ]
}
\`\`\`

#### POST /api/projects
Create a new project.

**Request Body:**
\`\`\`json
{
  "name": "Project Name",
  "description": "Optional description",
  "funnel_steps": ["Step 1", "Step 2", "Step 3"]
}
\`\`\`

#### GET /api/projects/{id}
Get a specific project.

#### PUT /api/projects/{id}
Update a project.

#### DELETE /api/projects/{id}
Delete a project.

### Reports

#### GET /api/reports
Get funnel reports. Optional query parameter: `project_id`

#### POST /api/reports
Create a new funnel report.

**Request Body:**
\`\`\`json
{
  "project_id": "uuid",
  "report_data": {
    "conversion_rates": [100, 85, 72, 58],
    "drop_off_points": [0, 15, 13, 14],
    "total_users": 10000,
    "completion_rate": 58,
    "step_names": ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
}
\`\`\`

### Data Ingestion

#### POST /api/data/ingest
Ingest funnel data from external sources.

**Request Body:**
\`\`\`json
{
  "project_id": "uuid",
  "funnel_data": {
    "step_completions": [10000, 8500, 7200, 5800],
    "total_users": 10000,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### AI Insights

#### POST /api/insights/generate
Generate AI insights for a project.

**Request Body:**
\`\`\`json
{
  "projectId": "uuid",
  "reportData": {
    "conversion_rates": [100, 85, 72, 58],
    "drop_off_points": [0, 15, 13, 14],
    "total_users": 10000,
    "completion_rate": 58,
    "step_names": ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
}
\`\`\`

### Webhooks

#### POST /api/webhooks/funnel-update
Receive real-time funnel updates.

**Request Body:**
\`\`\`json
{
  "user_id": "uuid",
  "project_id": "uuid",
  "event_type": "funnel_completion|step_completion|user_drop_off",
  "data": {
    "step": "Step Name",
    "user_id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### Health Check

#### GET /api/health
Check API health status.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
\`\`\`

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
