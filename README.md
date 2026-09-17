# 🛒 Premium Shop — Commercial E-Commerce Platform

A production-grade, decoupled full-stack e-commerce web platform engineered with **React** on the frontend and **Django REST Framework** on the backend. The platform provides real-time state-synchronized shopping, JWT user authentication, persistent cart sessions, and automated **Stripe Checkout** natively denominated in Nigerian Naira (NGN).

---

## 🌐 Live Deployments & Links

- **Live Storefront (Frontend):** [https://ecommerce-project-theta-red.vercel.app](https://ecommerce-project-theta-red.vercel.app)
- **API Engine (Backend):** Deployed via Gunicorn on [Render](https://render.com)
- **Source Repository:** [https://github.com/Tobiscus100/ecommerce-project](https://github.com/Tobiscus100/ecommerce-project)

---

## ⚡ Core Features

- **Decoupled Architecture:** Clean separation of concerns with a React client communicating asynchronously via RESTful endpoints to a Django backend.
- **Stripe Checkout (NGN/Kobo):** Native transaction processing in Nigerian Naira with sub-unit (kobo) arithmetic, webhooks, and post-payment order fulfillment.
- **Unified Cart Synchronization:** React Context API and storage event triggers eliminate badge desynchronization across route changes and browser tabs.
- **JWT Authentication:** Secure user registration, login, and session persistence using `rest_framework_simplejwt`.
- **Dynamic Product Catalog:** Real-time search and category filtering with responsive UI feedback and loading skeletons.
- **Order Tracking:** Detailed past order histories, line-item breakdowns, and fulfillment receipts.
- **Dark/Light Theme Engine:** Persistent UI mode toggle styled via Bootstrap and custom CSS.

---

## 🛠️ Tech Stack

### Frontend
- **Framework / Bundler:** React 18, Vite
- **UI & Styling:** React Bootstrap, Bootstrap 5, React Icons
- **Routing:** React Router v6
- **State Management:** React Context API, LocalStorage persistence
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Framework:** Python, Django 4+, Django REST Framework (DRF)
- **Authentication:** SimpleJWT (JSON Web Tokens)
- **Static Asset Management:** WhiteNoise (`CompressedStaticFilesStorage`)
- **Security & Networking:** `django-cors-headers`, secure CSRF domain whitelisting
- **Payment Gateway:** Stripe API (Checkout Sessions & Webhooks)
- **Deployment:** Render (Gunicorn WSGI)

### Database
- **Production:** PostgreSQL (Managed via `dj-database-url`)
- **Development / Local:** MariaDB / SQLite3

---

## 📁 Repository Structure

```text
├── backend/
│   ├── api/                  # DRF serializers, views, models, and custom auth backends
│   ├── backend/              # Django project core configuration (settings.py, urls.py, wsgi.py)
│   ├── manage.py
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # ProductCard, Rating, Navigation, Footers
│   │   ├── context/          # CartContext state provider
│   │   ├── screens/          # HomeScreen, CartScreen, PlaceOrderScreen, ProfileScreen, etc.
│   │   ├── App.jsx           # Root layout and route declarations
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json           # Client-side SPA routing redirects
│   └── vite.config.js
└── README.md
