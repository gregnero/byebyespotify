# Redirect URI Fix

## ✅ Update: Auto-Detection Now Enabled

**The app now automatically detects the correct redirect URI!**

When you load the page, it will show you the exact URI to use based on where you're currently running the app.

---

## What Happened (If You Saw This Error)

You saw this error after authorizing with Spotify:

```
This site can't be reached
127.0.0.1 refused to connect.
ERR_CONNECTION_REFUSED
```

## Why This Happened

The redirect URI in your Spotify Developer app didn't match where you're actually running the web app.

When Spotify tries to redirect back after authorization, it goes to the URI you specified in the Developer app, not where your actual web app is running.

## The Fix

### ✨ New: Just Copy the Auto-Detected URI

1. **Refresh the web app** (to load the new auto-detection)
2. **Look at Step 1** in the app - it shows the auto-detected URI
3. **Copy that exact URI** using the "Copy" button
4. **Go to Spotify Developer Dashboard:**
   - https://developer.spotify.com/dashboard
   - Click on your app
   - Click "Edit Settings"
   - Remove any old URIs
   - Paste the auto-detected URI
   - Click "Add"
   - Click "Save"
5. **Back in the web app**, the redirect URI field should already match
6. **Click "Connect to Spotify"** again

### Old Method (If Not Using Auto-Detection)

If you haven't refreshed to get the new version:

1. Go to https://developer.spotify.com/dashboard
2. Click on your app (byebyespotify or whatever you named it)
3. Click "Edit Settings"
4. In the "Redirect URIs" section:
   - **Remove** `http://127.0.0.1:8888/callback`
   - **Add** the URL where you're actually running the app
   - Click "Add"
   - Click "Save"
5. Back in the web app, update the "Redirect URI" field to match
6. Click "Connect to Spotify" again

### Option 2: Use the Port from Your Spotify App

If you want to keep `http://127.0.0.1:8888/callback`:

1. Start your local server on port 8888:
   ```bash
   cd web-app
   python -m http.server 8888
   ```
2. Visit `http://localhost:8888` (or `http://127.0.0.1:8888`)
3. Enter your credentials
4. Make sure the "Redirect URI" field shows `http://127.0.0.1:8888/callback`
5. Try again

## How Redirect URIs Work

When you click "Connect to Spotify":

1. **You go to Spotify** → Spotify authorization page
2. **You approve** → Spotify wants to send you back with a code
3. **Spotify redirects to Redirect URI** → Must be EXACTLY what you registered
4. **Web app captures code from URL** → Uses it to get access token

The redirect URI must:
- Match EXACTLY (including http vs https, port, trailing slash)
- Be added to your Spotify Developer app
- Point to where your web app is actually running

## Common Redirect URI Patterns

Depending on how you run the app:

| How You Run It | Redirect URI |
|----------------|-------------|
| `python -m http.server 8000` | `http://localhost:8000/` |
| `python -m http.server 5500` | `http://localhost:5500/` |
| VS Code Live Server (default) | `http://127.0.0.1:5500/` |
| Opening `index.html` directly | `file:///path/to/index.html` (won't work - need server) |

## Updated Instructions

The web app has been updated to use `http://localhost:8000/` as the default redirect URI (since that's what `python -m http.server 8000` uses).

**If you're using a different port:**
1. Note what port your server is on (check the URL in your browser)
2. Update the "Redirect URI" field in the web app to match
3. Make sure it matches in your Spotify Developer app

## Quick Test

After fixing:

1. Spotify Developer app redirect URI: `http://localhost:8000/`
2. Web app "Redirect URI" field: `http://localhost:8000/`
3. Actually running on: `http://localhost:8000`
4. All three match → ✅ Should work!

## Still Having Issues?

Check these:

- [ ] Redirect URI in Spotify Developer app matches exactly
- [ ] Redirect URI in web app form matches exactly
- [ ] You're visiting the same URL where the server is running
- [ ] You clicked "Save" in Spotify Developer Dashboard
- [ ] You don't have any typos (trailing slashes matter!)

---

**The fix has been applied to the web app.** The default redirect URI is now `http://localhost:8000/` to match the common local development setup.
