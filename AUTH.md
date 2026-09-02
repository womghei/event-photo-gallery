# Gallery access

GitHub Pages cannot enforce HTTP Basic Auth on its own. This project uses a Cloudflare Worker in front of the site.

## Protected URL

After deployment, open the Worker URL (for example `https://event-photo-gallery.<account>.workers.dev`).

The browser will prompt for a username and password.

## Default credentials

- Username: `gallery`
- Password: `event2026`

Change the password with:

```bash
cd worker
echo "your-new-password" | wrangler secret put AUTH_PASS
```

Change the username in `worker/wrangler.jsonc` (`AUTH_USER`) and redeploy.

## Note

The GitHub Pages URL remains publicly reachable unless you disable Pages. Use the Worker URL as the shared link for protected access.
