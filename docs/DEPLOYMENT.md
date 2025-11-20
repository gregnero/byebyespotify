# Deployment Guide

## Overview

The web application now **auto-detects** the redirect URI based on where it's running. This means it works seamlessly in both local development and GitHub Pages production environments without any code changes.

## How Auto-Detection Works

When the page loads:
1. JavaScript detects the current URL (`window.location.origin + window.location.pathname`)
2. **Replaces `localhost` with `127.0.0.1`** (per Spotify requirements)
3. Updates the displayed redirect URI in the instructions
4. Pre-fills the form field with the detected URI
5. Users copy this exact value to their Spotify Developer app

### Spotify's Requirements

Per [Spotify's security requirements](https://developer.spotify.com/documentation/web-api/concepts/redirect-uris):
- ✅ **HTTPS required** for production (GitHub Pages, custom domains)
- ✅ **HTTP allowed** only for loopback addresses
- ✅ **Must use explicit IP** (`127.0.0.1` or `[::1]`) for loopback
- ❌ **`localhost` is NOT allowed** - use `127.0.0.1` instead

### Examples:

| Environment | User Visits | Auto-Detected URI |
|-------------|-------------|-------------------|
| Local (port 8000) | `http://localhost:8000/` | `http://127.0.0.1:8000/` ✅ |
| Local (port 5500) | `http://localhost:5500/` | `http://127.0.0.1:5500/` ✅ |
| GitHub Pages | `https://username.github.io/byebyespotify/` | `https://username.github.io/byebyespotify/` ✅ |
| Custom Domain | `https://your-domain.com/` | `https://your-domain.com/` ✅ |

## Local Development

### Step 1: Start Local Server

```bash
cd web-app
python -m http.server 8000
```

### Step 2: Visit the App

Open `http://localhost:8000/` in your browser (or `http://127.0.0.1:8000/`).

### Step 3: Note the Auto-Detected URI

Even if you visit `http://localhost:8000/`, the app will display: `http://127.0.0.1:8000/` ✅

This is correct! Spotify requires the explicit IP address.

### Step 4: Create Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Create app with redirect URI: `http://127.0.0.1:8000/` (copy from the app)
3. Copy Client ID and Client Secret

### Step 5: Authenticate and Export

Use the credentials in the web app.

---

## GitHub Pages Deployment

### Step 1: Push to GitHub

```bash
git add web-app/
git commit -m "Add Spotify playlist export web application"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to "Pages" section
3. **Source:** Deploy from a branch
4. **Branch:** `main`
5. **Folder:** `/web-app`
6. Click "Save"

### Step 3: Wait for Deployment

- GitHub Pages builds automatically (~1-2 minutes)
- You'll see a green checkmark when ready
- URL will be: `https://[username].github.io/byebyespotify/`

### Step 4: Visit Your Deployed App

Navigate to your GitHub Pages URL.

### Step 5: Note the Auto-Detected URI

The app will display: `https://[username].github.io/byebyespotify/`

### Step 6: Create or Update Spotify Developer App

**Option A: Create New App for Production**

1. Go to https://developer.spotify.com/dashboard
2. Create a NEW app named "byebyespotify-production"
3. Set redirect URI: `https://[username].github.io/byebyespotify/`
4. Copy Client ID and Client Secret

**Option B: Add Redirect URI to Existing App**

1. Go to your existing app in Spotify Developer Dashboard
2. Click "Edit Settings"
3. Add BOTH redirect URIs:
   - `http://localhost:8000/` (for local development)
   - `https://[username].github.io/byebyespotify/` (for production)
4. Click "Save"

> **Note:** Spotify allows multiple redirect URIs per app, so you can use the same app for both local and production.

### Step 7: Share with Users

Users should:
1. Visit your GitHub Pages URL
2. The app will auto-detect the correct redirect URI
3. Create their own Spotify Developer app with that URI
4. Use their own credentials

---

## Custom Domain Deployment

If you set up a custom domain for GitHub Pages:

### Step 1: Configure DNS

Point your domain to GitHub Pages (see [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).

### Step 2: Update GitHub Pages Settings

1. In repository Settings → Pages
2. Enter your custom domain
3. Enable "Enforce HTTPS" (recommended)

### Step 3: Visit Your Custom Domain

The app will auto-detect: `https://your-domain.com/`

### Step 4: Update Spotify Developer App

Add redirect URI: `https://your-domain.com/`

---

## Multi-Environment Strategy

### Recommended Approach: One App, Multiple URIs

Use a **single** Spotify Developer app with **multiple** redirect URIs:

**Spotify Developer App: "byebyespotify"**
- Redirect URIs:
  - `http://127.0.0.1:8000/` (local dev - note: uses IP not localhost)
  - `http://127.0.0.1:5500/` (if using VS Code Live Server)
  - `https://username.github.io/byebyespotify/` (production)
  - `https://your-domain.com/` (if using custom domain)

**Benefits:**
- One set of credentials for all environments
- Switch between local and production seamlessly
- No need to update app settings frequently

**How to use:**
1. Create app with all redirect URIs
2. Use same Client ID and Client Secret everywhere
3. App auto-detects which URI to use based on current URL

---

## User Instructions (For Production)

When sharing the deployed app with users, instruct them:

### For Users:

1. **Visit the app** at your GitHub Pages URL
2. **Note the redirect URI** displayed in Step 1 (auto-detected)
3. **Create their Spotify Developer app:**
   - Go to https://developer.spotify.com/dashboard
   - Click "Create app"
   - App name: `byebyespotify` (or anything)
   - App description: `Playlist export tool`
   - **Redirect URI:** Copy the exact URI shown in the web app
   - Check "I understand and agree"
   - Click "Save"
4. **Copy credentials** (Client ID and Client Secret)
5. **Return to web app** and paste credentials
6. **Export playlists**

The key point: **Users should copy the redirect URI shown in YOUR deployed app**, not make up their own.

---

## Troubleshooting

### "Redirect URI mismatch" Error

**Cause:** Redirect URI in Spotify app doesn't match where the web app is running.

**Solution:**
1. Check what URL you're visiting (e.g., `https://username.github.io/byebyespotify/`)
2. Check what the app auto-detected (shown in Step 1 instructions)
3. Go to Spotify Developer Dashboard → Your App → Edit Settings
4. Ensure redirect URI EXACTLY matches (including trailing slash)

### Auto-Detection Not Working

**Cause:** JavaScript error or old browser.

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Manually update the "Redirect URI" field in Step 2 to match your current URL
3. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

### Works Locally, Breaks on GitHub Pages

**Cause:** Used local redirect URI in production Spotify app.

**Solution:**
1. Update Spotify app to include production redirect URI
2. Or create separate Spotify app for production

### Multiple Developers

**Problem:** Different developers use different local ports.

**Solution:**
Each developer should:
1. Note their local port (e.g., 8000, 5500, etc.)
2. Add their specific `http://localhost:[port]/` to the Spotify app's redirect URIs
3. OR create their own personal Spotify Developer app

---

## Security Considerations

### HTTPS in Production

- GitHub Pages enforces HTTPS automatically
- Custom domains should also use HTTPS
- Never use HTTP in production (only for local development)

### Redirect URI Validation

- Spotify validates redirect URIs strictly
- Wildcard URIs are NOT supported
- Each exact URI must be registered

### Client Secret Exposure

- Client Secret is visible in browser (client-side app)
- This is acceptable for OAuth public clients
- Spotify's redirect URI whitelist provides security
- Users should not share their Client Secret publicly

---

## Testing Production Deployment

After deploying to GitHub Pages:

1. ✅ Visit the URL - page loads correctly
2. ✅ Check auto-detected URI - matches actual URL
3. ✅ Create test Spotify app with production URI
4. ✅ Complete authentication flow
5. ✅ Export a small test playlist
6. ✅ Verify ZIP download works
7. ✅ Check browser console - no errors

---

## Rollback Strategy

If production deployment has issues:

1. GitHub Pages builds from the `main` branch `/web-app` folder
2. To rollback: `git revert [commit-hash]` and push
3. GitHub Pages rebuilds automatically (~1-2 minutes)
4. Old version is live again

---

## Continuous Updates

When you update the app:

1. Make changes locally
2. Test thoroughly on `http://localhost:8000/`
3. Commit and push to `main` branch
4. GitHub Pages auto-deploys (~1-2 minutes)
5. Test on production URL

**No build process** means updates are instant (just push to GitHub).

---

## Documentation for Users

When sharing the deployed app, link users to:

- **Main page:** Your GitHub Pages URL
- **Instructions:** The app has built-in step-by-step guide
- **Troubleshooting:** `docs/QUICKSTART.md` or `REDIRECT-URI-FIX.md`

Users should be able to use the app without reading any separate documentation—everything is built into the UI.

---

## Summary

✅ **Auto-detection** makes deployment simple
✅ **Works locally** without configuration
✅ **Works on GitHub Pages** without code changes
✅ **Works with custom domains** automatically
✅ **Users create their own apps** with the correct URI
✅ **No environment variables** or build configuration needed

The app detects where it's running and guides users accordingly. Deploy once, works everywhere.
