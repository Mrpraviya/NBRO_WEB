# Deploy the backend to Render with GitHub Actions

The workflow at `.github/workflows/backend-render.yml` runs backend tests on pull
requests and pushes to `main`. A successful push to `main` builds a
`linux/amd64` image, publishes `latest` and a commit-specific tag to GHCR, then
asks Render to deploy that exact commit-specific image.

## One-time setup

1. Push the workflow and backend to `main`. The first run publishes the image;
   its deploy step will fail until the Render hook secret is configured.
2. Create a Render **Web Service** using the **Existing Image** option and set
   its image URL to `ghcr.io/<github-owner>/<repository>:latest`. The image
   name must be lowercase. Keep the GHCR package private and configure Render's
   registry credentials for `ghcr.io` with your GitHub username and a GitHub
   classic personal access token with `read:packages`. Do not put this token in
   the repository or GitHub Actions.
3. In the Render service settings, create a deploy hook. Add its URL in GitHub
   under **Settings → Secrets and variables → Actions** as
   `RENDER_DEPLOY_HOOK_URL`.
4. Set the service's runtime environment variables in Render. At minimum,
   configure `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and
   `SPRING_DATASOURCE_PASSWORD` with the production database credentials. OTP
   email uses Brevo's HTTPS API by default; configure `MAIL_PROVIDER=brevo`,
   `BREVO_API_KEY`, `MAIL_FROM`, and optionally `MAIL_FROM_NAME`. Verify the
   sender email address in Brevo first; a paid custom domain is not required to
   verify an individual sender address. To use SMTP instead, set
   `MAIL_PROVIDER=smtp` and configure `MAIL_USERNAME` and `MAIL_PASSWORD`;
   Render's free tier blocks outbound SMTP ports. Keep credentials out of
   Docker build arguments and source control.
5. Ensure the database permits connections from Render and requires TLS if
   appropriate. Configure a health check path in Render if the application has
   a suitable unauthenticated health endpoint.

After the first image is available and Render is configured, rerun the failed
workflow run to complete the initial deployment. Later pushes to `main` test
the backend, publish the image, and trigger Render automatically. Pull requests
run tests but do not publish images or deploy.

## Persistent files

The backend writes generated reports beneath `uploads/reports`. A container's
filesystem is not durable across replacement or redeployment unless persistent
storage is configured. Use a Render persistent disk mounted at `/app/uploads`
or move report storage to durable object storage before relying on these files
in production.
