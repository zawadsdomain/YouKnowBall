# API Cheatsheet

Quick reference for YouKnowBall API endpoints.

## Base URL
```
http://localhost:3000/api
```

## Authentication Header
```
Authorization: Bearer <your-token>
```

---

## User Endpoints

### Sign Up
```http
POST /users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJ...",
  "data": {
    "uid": "abc123",
    "email": "user@example.com",
    "username": "johndoe",
    "token": "eyJ..."
  }
}
```

### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJ...",
  "data": {
    "userId": "abc123",
    "email": "user@example.com",
    "token": "eyJ..."
  }
}
```

### Get Profile (Protected)
```http
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "username": "johndoe",
    "email": "user@example.com",
    "balance": 10000,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get All Users
```http
GET /users

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "username": "johndoe",
      "email": "user@example.com",
      "balance": 10000
    }
  ]
}
```

### Get User by ID
```http
GET /users/:userId

Response: 200 OK
{
  "success": true,
  "data": {
    "username": "johndoe",
    "email": "user@example.com",
    "balance": 10000
  }
}
```

### Delete Account (Protected)
```http
DELETE /users/delete
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Account deleted"
}
```

---

## Holdings Endpoints

### Get User Holdings
```http
GET /holdings/:userId

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "holding1",
      "userId": "abc123",
      "playerId": "player1",
      "quantity": 5,
      "purchasePrice": 100
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Common cURL Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJ..."
```

### Delete Account
```bash
curl -X DELETE http://localhost:3000/api/users/delete \
  -H "Authorization: Bearer eyJ..."
```

### Get Holdings
```bash
curl -X GET http://localhost:3000/api/holdings/abc123
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Token Management

### Extract Token from Response
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}' | jq -r '.data.token')

echo $TOKEN  # Use in Authorization header
```

### Decode JWT Token (for debugging)
```bash
echo $TOKEN | cut -d. -f2 | base64 -d
```

---

## Frontend API Usage

### Making Requests
```typescript
import apiClient from '../services/api';

// GET request
const response = await apiClient.get('/users/profile');

// POST request
const response = await apiClient.post('/users/signup', {
  email: 'user@example.com',
  password: 'password123',
  username: 'johndoe'
});

// DELETE request
const response = await apiClient.delete('/users/delete');
```

### Handling Errors
```typescript
try {
  const response = await apiClient.get('/users/profile');
  console.log(response.data);
} catch (error) {
  console.error('Error:', error.response?.data?.message);
}
```

---

## Rate Limiting (Planned)

Currently no rate limiting. Add to production:
- Max 100 requests/minute per IP
- Max 10 login attempts/hour per email

---

Last Updated: July 2026
