# Spotify Redirect URI Requirements

## Official Requirements

Per [Spotify's documentation](https://developer.spotify.com/documentation/web-api/concepts/redirect-uris), redirect URIs must follow these security requirements:

### ✅ Required

1. **Use HTTPS for production** - Any publicly accessible URL must use HTTPS
2. **HTTP allowed ONLY for loopback** - HTTP is permitted only for local development
3. **Use explicit IP for loopback** - Must use `127.0.0.1` (IPv4) or `[::1]` (IPv6)
4. **Exact match required** - URI must match exactly (including trailing slashes)

### ❌ Not Allowed

1. **`localhost` is NOT allowed** - Must use explicit IP address instead
2. **Wildcards not supported** - Each URI must be explicitly registered
3. **HTTP in production** - Production URLs must use HTTPS

## Why These Requirements Exist

### Security

- **Explicit IPs prevent DNS hijacking** - Attacker can't redirect `localhost` to malicious server
- **HTTPS prevents man-in-the-middle attacks** - OAuth tokens can't be intercepted
- **Exact matching prevents spoofing** - Can't use similar-looking domains

### Compliance

- OAuth 2.0 best practices require secure redirect handling
- Prevents authorization code interception
- Protects user credentials and access tokens

## How Our App Complies

### Auto-Detection with Conversion

The app automatically converts `localhost` to `127.0.0.1`:

```javascript
// User visits: http://localhost:8000/
// App detects and converts to: http://127.0.0.1:8000/
```

### Examples

| User Visits | App Auto-Detects | Spotify Accepts |
|-------------|------------------|-----------------|
| `http://localhost:8000/` | `http://127.0.0.1:8000/` | ✅ Yes |
| `http://127.0.0.1:8000/` | `http://127.0.0.1:8000/` | ✅ Yes |
| `https://username.github.io/byebyespotify/` | `https://username.github.io/byebyespotify/` | ✅ Yes |
| `http://example.com/` | `http://example.com/` | ❌ No (must use HTTPS) |

## Valid Redirect URIs

### Local Development

**Valid:**
- ✅ `http://127.0.0.1:8000/`
- ✅ `http://127.0.0.1:5500/`
- ✅ `http://127.0.0.1:3000/callback`
- ✅ `http://[::1]:8000/` (IPv6 loopback)

**Invalid:**
- ❌ `http://localhost:8000/` (must use explicit IP)
- ❌ `http://192.168.1.100:8000/` (not a loopback address)
- ❌ `http://0.0.0.0:8000/` (not allowed)

### Production

**Valid:**
- ✅ `https://username.github.io/byebyespotify/`
- ✅ `https://www.example.com/`
- ✅ `https://example.com/callback`

**Invalid:**
- ❌ `http://example.com/` (must use HTTPS)
- ❌ `https://*.example.com/` (wildcards not supported)

## Common Issues

### Issue 1: Used `localhost`

**Error:** "Invalid redirect URI"

**Cause:** Used `http://localhost:8000/` in Spotify Developer app

**Solution:**
1. Use `http://127.0.0.1:8000/` instead
2. Or let the app auto-detect and copy that value

### Issue 2: HTTP in Production

**Error:** "Redirect URI must use HTTPS"

**Cause:** Used `http://example.com/` for production

**Solution:**
1. GitHub Pages automatically provides HTTPS
2. Custom domains should have SSL certificates
3. Never use HTTP for production

### Issue 3: Trailing Slash Mismatch

**Error:** "Redirect URI mismatch"

**Cause:**
- Spotify app: `http://127.0.0.1:8000/`
- Actual URI: `http://127.0.0.1:8000` (no slash)

**Solution:** Ensure exact match including trailing slashes

### Issue 4: Port Mismatch

**Error:** "Redirect URI mismatch"

**Cause:**
- Spotify app: `http://127.0.0.1:8000/`
- Running on: `http://127.0.0.1:5500/`

**Solution:**
1. Check which port you're using
2. Update Spotify app to match
3. Or add multiple ports to Spotify app

## Setting Up Multiple Environments

### Best Practice: One App, Multiple URIs

Create one Spotify Developer app and add all URIs you'll use:

```
App: "byebyespotify"

Redirect URIs:
✅ http://127.0.0.1:8000/        (local development)
✅ http://127.0.0.1:5500/        (VS Code Live Server)
✅ https://username.github.io/byebyespotify/  (production)
```

**Benefits:**
- One set of credentials for all environments
- Easy switching between local and production
- No need to update app settings frequently

### How to Add Multiple URIs

1. Go to https://developer.spotify.com/dashboard
2. Click on your app
3. Click "Edit Settings"
4. In "Redirect URIs" section:
   - Enter first URI → Click "Add"
   - Enter second URI → Click "Add"
   - Enter third URI → Click "Add"
   - ...
5. Click "Save"

## Testing Your Setup

### Local Development Test

1. Start server: `python -m http.server 8000`
2. Visit: `http://localhost:8000/` (or `http://127.0.0.1:8000/`)
3. Check auto-detected URI in app: Should show `http://127.0.0.1:8000/`
4. Spotify Developer app should have: `http://127.0.0.1:8000/`
5. ✅ Should match exactly

### Production Test

1. Deploy to GitHub Pages
2. Visit: `https://username.github.io/byebyespotify/`
3. Check auto-detected URI: Should show `https://username.github.io/byebyespotify/`
4. Spotify Developer app should have: `https://username.github.io/byebyespotify/`
5. ✅ Should match exactly

## Reference Links

- [Spotify OAuth Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Redirect URI Requirements](https://developer.spotify.com/documentation/web-api/concepts/redirect-uris)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## Summary

✅ **Always use `127.0.0.1` not `localhost`** for local development
✅ **Always use HTTPS** for production (GitHub Pages, custom domains)
✅ **Exact match required** - trailing slashes, ports, paths must match
✅ **Multiple URIs allowed** - add all environments to one Spotify app
✅ **App auto-converts** - visiting `localhost` shows `127.0.0.1` automatically

The app handles these requirements automatically, so you just need to copy the displayed URI to your Spotify Developer app!
