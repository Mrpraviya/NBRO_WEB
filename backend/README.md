Mock backend for NBRO frontend

Run:

```bash
cd frontend/backend
npm install
npm start
```

This starts an Express server on port 4000 with endpoints:
- `GET /api/reports` – list saved reports
- `POST /api/reports` – save a report (expects JSON body)

Data is persisted to `frontend/backend/db.json` using lowdb.

HTTPS (optional, recommended for testing secure uploads)
---------------------------------------------------
To avoid mixed-content errors when your frontend runs over HTTPS, generate a local trusted certificate using `mkcert` and place the files in `frontend/backend/certs` as `localhost.pem` and `localhost-key.pem`.

Install mkcert (https://github.com/FiloSottile/mkcert) and run:

```bash
# install local CA (one-time)
mkcert -install

# from frontend/backend (generate cert and key files)
mkcert -key-file localhost-key.pem localhost.pem localhost

# move the generated files into frontend/backend/certs
mkdir -p certs
mv localhost.pem localhost-key.pem certs/
```

When cert files are present the mock server will start with HTTPS on the same port (4000) and serve uploaded files at `https://localhost:4000/uploads/...`.

If you don't enable HTTPS the server will run over HTTP and uploads from an HTTPS-served frontend will be blocked by the browser (mixed-content). In that case run the frontend over HTTP during development (set `HTTPS=false` when starting Vite).
