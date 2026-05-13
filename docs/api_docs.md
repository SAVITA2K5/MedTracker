# MEDTRACK API Documentation

## Base URL
`http://127.0.0.1:8000`

## Interactive Docs
Visit `http://127.0.0.1:8000/docs` (Swagger UI) or `/redoc` after starting the server.

---

## Authentication

### POST `/users/register`
Register a new user.

**Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "+91-9000000000",
  "gender": "Male"
}
```

**Response:** `{ "access_token": "...", "token_type": "bearer", "user": {...} }`

---

### POST `/users/login`
Login with email/password.

**Body:** `{ "email": "john@example.com", "password": "secret123" }`

---

## Prediction

### POST `/predict/diabetes`
Run diabetes risk prediction.

**Body:** DiabetesInput schema (glucose, bmi, age, etc.)

### POST `/predict/heart`
Run heart disease risk prediction.

**Body:** HeartInput schema (age, sex, cp, chol, etc.)

---

## Recommendations

### POST `/recommendations/`
Get personalized recommendations.

**Body:** `{ "user_id": 1, "disease": "diabetes", "risk_level": "High" }`

---

## Explainability

### POST `/explain/`
Get SHAP-based feature explanation (Phase 3).

**Body:** `{ "disease": "diabetes", "features": {...} }`

---

## Chatbot

### POST `/chatbot/message`
Send a message to MedAI chatbot.

**Body:** `{ "message": "Tell me about diabetes", "user_id": 1 }`

---

## SOS

### POST `/sos/contacts`
Add emergency contact.

**Query:** `?user_id=1`

### GET `/sos/contacts/{user_id}`
List emergency contacts.

### POST `/sos/trigger`
Trigger SOS alert.

**Body:** `{ "user_id": 1, "latitude": 12.9, "longitude": 77.6, "message": "..." }`
