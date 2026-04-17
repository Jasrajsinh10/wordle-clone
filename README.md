# Wordle Clone 🔠

A full-stack Wordle clone built with **Next.js** and **Django REST Framework**. This project features a modern UI, user authentication with JWT, and persistent statistics tracking.

## 🚀 Features

-   **Classic Gameplay**: 6 attempts to guess a 5-letter word with color-coded feedback.
-   **User Accounts**: Secure registration and login using JWT (persistent via HTTP-only cookies).
-   **Stats Tracking**: Track wins, losses, and win percentages across sessions.
-   **Guest Mode**: Play without an account; statistics are saved locally in the browser.
-   **Modern Design**: Sleek, dark-mode interface with smooth animations and responsive layout.
-   **Robust Backend**: Django-powered API with random word generation and authenticated statistics updates.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Framework**: [Django](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
-   **Authentication**: [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
-   **Database**: SQLite (Local) / PostgreSQL (Production)
-   **Deployment**: Ready for [Render](https://render.com/) or Heroku.

---

## 📂 Project Structure

```text
.
├── backend/            # Django application
│   ├── config/         # Project settings
│   ├── game/           # Game logic & word list
│   ├── users/          # Authentication & user profiles
│   └── manage.py
└── frontend/           # Next.js application
    ├── src/
    │   ├── app/        # Pages & routes
    │   ├── components/ # Reusable UI components
    │   ├── hooks/      # Custom React hooks
    │   └── utils/      # API helpers
    └── package.json
```

---

## 🏃 Local Development

### 1. Prerequisites
-   Node.js (v18+)
-   Python (v3.10+)

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Mac/Linux
    # OR
    .\venv\Scripts\activate   # Windows
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations:
    ```bash
    python manage.py migrate
    ```
5.  Start the server:
    ```bash
    python manage.py runserver
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

The backend includes a `render-build.sh` script and a `Procfile` for easy deployment on **Render**.

### Backend Environment Variables
-   `SECRET_KEY`: Django secret key.
-   `DATABASE_URL`: PostgreSQL connection string (if using DB).
-   `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs.
-   `DEBUG`: Set to `False` in production.

### Frontend Environment Variables
-   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
