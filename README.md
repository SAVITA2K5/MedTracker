# 🏥 MedAI Guardian – AI-Powered Health Risk Prediction App

![MedAI Guardian Header](https://via.placeholder.com/800x200.png?text=MedAI+Guardian+-+Empowering+Health)

**MEDTRACK** is a production-ready, mobile-first, AI-powered health risk prediction full-stack application. It leverages Random Forest modeling to accurately predict disease risks (Diabetes, Heart Disease), utilizes **SHAP (SHapley Additive exPlanations)** to provide transparent explainable AI factors (XAI), and integrates a suite of advanced patient tools including Twilio Emergency SOS alerts, Medical Chatbots, and Voice-to-Text inputs.

---

## ✨ Features (Fully Implemented)

### User App (React Native Frontend)
- **Fluid UI & Theming:** Mobile-first dark-mode UX leveraging `expo-linear-gradient` and styled components.
- **Risk Assessment Module:** Fill out structured health metrics to receive a highly accurate probability score.
- **XAI Results Engine:** Understand *why* an AI made its decision through intuitive, color-coded visual SHAP bars explaining feature importance.
- **Rule-Based MedAI Chatbot:** NLP logic that responds contextually to your health/disease queries.
- **Microphone Integration:** Send hands-free voice-to-text messages to the chatbot via the Web Speech API right in the browser.
- **Twilio SOS Emergency Trigger:** Hold the "SOS" button to instantly fire off SMS alerts (containing your Google Maps coordinates) to all saved emergency contacts.

### Intelligence Core (FastAPI & ML Backend)
- **Scikit-Learn ML Models:** Pre-trained Random Forest Classifiers explicitly tailored for Diabetes and Heart Disease distributions.
- **SHAP Integration:** Evaluates each user's unique tensor to extract real-time predictive contributions.
- **JWT Authorization:** Bulletproof access token architecture connected via React Context layer.
- **Adaptive DB Config:** Effortlessly switches between production PostgreSQL and zero-config local SQLite for testing flexibility.

---

## 🛠 Tech Stack

| Layer | Architecture | Libraries & Tools |
|---|---|---|
| **Frontend** | React Native (Expo) | `react-navigation`, `expo-location`, `axios`, `@react-native-async-storage` |
| **Backend** | Python FastAPI | `pydantic`, `jose`, `bcrypt`, `twilio` |
| **Database** | PostgreSQL | `sqlalchemy` (ORM), `psycopg2` |
| **Machine Learning** | Model & Validation | `scikit-learn`, `shap`, `numpy`, `pandas`, `joblib` |

---

## 🚀 Quick Start & Setup Guide

### 1. Backend Setup & Booting
Start by navigating to the `backend` directory and initializing the Python environment.

```bash
cd backend

# Create & activate a virtual environment
python -m venv venv
venv\Scripts\activate       # On Windows
# source venv/bin/activate  # On Mac/Linux

# Install all required Python packages (including scikit-learn & SHAP)
pip install -r requirements.txt
```

**Configure the Database:**
Copy the example config into your active `.env`:
```bash
cp .env.example .env
```
Inside `.env`, verify your `DATABASE_URL`. It will seamlessly use SQLite natively or connect directly to a PostgreSQL server:
`DATABASE_URL=postgresql://postgres:password@localhost:5432/medtrack` (PostgreSQL)

**Start the Server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The FastAPI backend will auto-initialize the database schema if missing, load the `.pkl` ML models into RAM, and expose the swagger UI at `http://localhost:8000/docs`.*

### 2. Frontend Setup & Booting
In a brand new terminal, initialize the React Native Expo app.

```bash
cd frontend

# Install dependencies (automatically installs expo and react-native variants)
npm install

# Start the Expo bundler for Web testing (or iOS/Android Go scanning)
npx expo start --clear --web
```
*The React app will compile and launch directly in your browser on `localhost:8081`.*

---

## 📂 Project Structure
```text
MedTracker/
├── backend/
│   ├── app/
│   │   ├── core/           # Security, Auth, Settings
│   │   ├── models/         # SQLAlchemy Schemas (User, HealthData, Contacts)
│   │   ├── ml/             # Training script, data generator, and .pkl models
│   │   ├── routes/         # Standardized FastAPI endpoints
│   │   └── services/       # Decoupled business logic (Twilio, SHAP inference)
│   ├── test_api.py         # Automated End-to-End integration test
│   └── requirements.txt
├── frontend/
│   ├── context/            # Global state handling (AuthContext, HealthContext)
│   ├── navigation/         # React Navigation Stacks
│   ├── screens/            # Visual Application Pages
│   │   ├── Auth/           # Login / Register
│   │   ├── Chatbot/        # NLP UI & Voice Input
│   │   ├── Prediction/     # Assessment Forms & SHAP Result Renderer
│   │   └── SOS/            # Emergency Trigger UI
│   └── services/           # Axios network calls mirroring backend routes
└── README.md
```

## 🔒 Environment Variables

Inside your `backend/.env`, you can customize the Twilio keys to make SOS triggers functional natively on mobile devices.

```env
# Twilio Console credentials (Used to send real SMS texts via the SOS feature)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890

# Note: In Development Mode, leaving these fields blank allows the app 
# to gracefully mock the SMS visually in the Python terminal logging!
```

---
**License**: MIT  
**Developers**: Developed and built fully throughout a highly rigorous, phase-based architecture pipeline utilizing AI pair-programming.
