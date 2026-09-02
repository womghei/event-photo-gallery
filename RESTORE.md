# Restore the gallery site

GitHub Pages is currently disabled for this repo. To bring the site back:

```bash
gh api repos/womghei/event-photo-gallery/pages -X POST \
  -f build_type=legacy \
  -f 'source[branch]=main' \
  -f 'source[path]=/'
```

The site will be available again at:

https://womghei.github.io/event-photo-gallery/

To re-enable the Cloudflare Worker with basic auth, see the `worker/` folder and run:

```bash
cd worker
echo "your-password" | wrangler secret put AUTH_PASS
wrangler deploy
```
