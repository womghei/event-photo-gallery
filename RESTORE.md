# Restore the gallery site

GitHub Pages is currently disabled. Photos and ZIP releases remain in the repo.

## Bring the site back

```bash
gh api repos/womghei/event-photo-gallery/pages -X POST \
  -f build_type=legacy \
  -f 'source[branch]=main' \
  -f 'source[path]=/docs'
```

The site will be available again at:

https://womghei.github.io/event-photo-gallery/

## Assets kept

- **Photos:** `photos/pre-event/` in the repo (175 images)
- **ZIP download:** https://github.com/womghei/event-photo-gallery/releases/download/v1.3/pre-event.zip
