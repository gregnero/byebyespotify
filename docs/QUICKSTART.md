# Quick Start Guide

## Test the Web App Locally (5 minutes)

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Spotify account with at least one playlist
- Internet connection

### Step 1: Open the App

**Option A: Direct File**
```bash
# Navigate to web-app directory
cd web-app

# Open in browser (choose one):
open index.html              # macOS
start index.html             # Windows
xdg-open index.html          # Linux
```

**Option B: Local Server (Recommended)**
```bash
# Navigate to web-app directory
cd web-app

# Start a local server (choose one):
python -m http.server 8000   # Python 3
python -m SimpleHTTPServer   # Python 2
npx http-server              # Node.js

# Then visit: http://localhost:8000 (or http://127.0.0.1:8000)
```

> **Note:** The app will auto-detect and convert `localhost` to `127.0.0.1` per Spotify's requirements.

### Step 2: Create Spotify Developer App (2 minutes)

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click **"Create app"**
4. **In the web app:** Look at Step 1 - it shows the auto-detected redirect URI
5. **Copy that exact URI** (will be something like `http://127.0.0.1:8000/`)
6. **Back in Spotify Developer Dashboard,** fill in the form:
   - **App name:** `byebyespotify-test`
   - **App description:** `Testing playlist export`
   - **Redirect URI:** Paste the URI from the web app
   - Click "Add"
   - Check "I understand and agree"
7. Click **"Save"**
8. On the app page:
   - Copy the **Client ID**
   - Click "Show Client Secret" and copy the **Client Secret**

> **Important:** Spotify requires `127.0.0.1` (explicit IP) not `localhost` for security. The web app handles this automatically.

### Step 3: Authenticate (30 seconds)

1. Back in the web app, paste:
   - Client ID into "Client ID" field
   - Client Secret into "Client Secret" field
   - Redirect URI should already be filled (auto-detected)
2. Click **"Connect to Spotify"**
3. On Spotify's page, click **"Agree"** to authorize
4. You'll be redirected back to the web app

### Step 4: Export (1-2 minutes)

1. You should now see: "Connected as: [Your Name]"
2. Click **"Export All Playlists"**
3. Watch the progress bar
4. When complete, click **"Download ZIP"**

### Step 5: Verify Export

1. Extract the downloaded ZIP file: `spotify_export_YYYY-MM-DD.zip`
2. You should see:
   ```
   My Playlists/
   └── YYYY-MM-DD - [Playlist Name]/
       ├── cover.jpg
       ├── description.txt
       ├── tracks.csv
       └── tracks.m3u

   Other Playlists/
   └── ...
   ```
3. Open `tracks.csv` - verify it has:
   - Headers: Track Name, Artists, Album, Release Date, Duration (ms), Popularity, ISRC, Added At, Track URL
   - Your tracks with ISRC codes
4. Open `tracks.m3u` - verify it has:
   - `#EXTM3U` at the top
   - `#EXTINF` lines with track info
   - Spotify URLs

## Quick Validation Test

Open `test-validation.html` in your browser to run automated syntax checks:

```bash
open test-validation.html
```

You should see a series of green checkmarks (✅) indicating:
- JavaScript modules load correctly
- Classes can be instantiated
- Core functions work as expected
- CSV escaping handles special characters
- M3U format generates correctly

## Troubleshooting

### "Failed to get access token"
- Double-check your Client ID and Client Secret
- Ensure Redirect URI is exactly: `http://127.0.0.1:8888/callback`
- Verify you clicked "Save" after creating the Spotify app

### "Redirect URI mismatch"
- The Redirect URI in the web app must EXACTLY match what's in your Spotify Developer app
- Check for trailing slashes, http vs https, port numbers

### No playlists exported
- Ensure you have at least one playlist in your Spotify account
- Check browser console for errors (F12 → Console)

### Images not downloading
- Some Spotify image URLs expire quickly - this is normal
- Most images should download successfully

### Browser shows "file:// protocol" error
- Use a local server instead (see Step 1, Option B)
- Direct file opening may have CORS restrictions

## For Full Testing

See `TESTING.md` for 30 comprehensive test cases covering:
- All UI interactions
- OAuth flow
- Export process
- File format validation
- Error handling
- Browser compatibility
- Mobile responsiveness
- Edge cases

## Next Steps

Once you've verified the app works:

1. **Deploy to GitHub Pages:**
   ```bash
   git add web-app/
   git commit -m "Add web application for playlist export"
   git push origin main

   # Then enable GitHub Pages in repo settings
   ```

2. **Share with users:**
   - Provide link to GitHub Pages URL
   - Include link to `web-app/README.md` for full instructions

3. **Gather feedback:**
   - Monitor for issues
   - Track common questions for FAQ updates

## Additional Resources

- `README.md` - Comprehensive user documentation
- `TESTING.md` - Full test procedures
- `SUMMARY.md` - Technical overview
- `docs/clarifying-function/refined-vision.md` - Project purpose
- `docs/design-decisions/authentication-architecture.md` - Architecture rationale

---

**Questions?** Check the main README.md or open an issue on GitHub.
