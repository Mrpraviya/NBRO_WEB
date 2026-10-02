# React + Vite

## Connect to the Spring backend

From `auth-backend/backend`, copy `.env.example` to `.env` and set
`MAIL_USERNAME` to your valid sender address and `MAIL_PASSWORD` to your Gmail
app password. The actual `.env` is git-ignored. Start the backend with
`.\mvnw.cmd spring-boot:run` in PowerShell, then start the frontend with
`npm run dev`. Vite proxies `/api` requests to `http://localhost:8080`, so local
auth requests do not require backend CORS changes.

To use a different backend host during development, set `VITE_BACKEND_URL` in a
frontend `.env` file. For a deployed frontend, set `VITE_API_BASE_URL` to an API
base URL served from the same origin or through a reverse proxy; the backend's
auth endpoints do not currently configure cross-origin access.

The connected auth endpoints support signup, email verification, password login,
and login OTP verification. Password recovery is not implemented by the backend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
