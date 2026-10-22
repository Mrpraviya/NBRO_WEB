# React + Vite

## Connect to the Spring backend

Start the frontend with `npm run dev`. Vite proxies `/api` requests to
`https://nbro-web-latest.onrender.com` by default, so local frontend testing
uses the hosted backend without requiring backend CORS changes. To use a local
backend instead, set `VITE_BACKEND_URL=http://localhost:8080` in a frontend
`.env` file and start the backend from `auth-backend/backend` with
`.\mvnw.cmd spring-boot:run` in PowerShell.

To use a different backend host during development, set `VITE_BACKEND_URL` in a
frontend `.env` file. Production builds use
`https://nbro-web-latest.onrender.com/api` by default. You can override this in
Vercel by setting `VITE_API_BASE_URL` to the backend API base URL
(`https://nbro-web-latest.onrender.com/api`) and redeploying. The backend auth
endpoints allow browser CORS requests, and the backend root returns a simple
health status response.

The connected auth endpoints support signup, email verification, password login,
and login OTP verification. Password recovery is not implemented by the backend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
