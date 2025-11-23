# Bye Bye Spotify - Web Application

A client-side web application for exporting Spotify playlists with complete preservation of covers, descriptions, and metadata.

## Features

- **Complete Playlist Preservation**
  - Playlist titles (with all special characters preserved)
  - Playlist authors and contributor information
  - Custom cover images
  - Playlist descriptions
  - Full track metadata including ISRC codes
  - Date-stamped folder organization

- **Export Formats**
  - CSV (with ISRC codes for accurate track matching)
  - Title, author, and description text files
  - Cover images (JPEG)

- **Privacy-First Architecture**
  - All processing happens in your browser
  - Your data never leaves your device
  - No backend servers required
  - Fully transparent client-side code

- **User-Friendly Interface**
  - Step-by-step guided process
  - Progress indicators
  - Clear error messages
  - Mobile-responsive design

## Directory Structure

```
byebyespotify/
├── index.html              # Main application page
├── README.md               # This file
├── images/                 # Cloud decoration images
├── src/
│   ├── css/
│   │   └── styles.css      # All application styles
│   └── js/
│       ├── spotify-api.js  # Spotify API wrapper
│       ├── export.js       # Export & format conversion
│       └── app.js          # Main application logic
├── docs/
│   ├── QUICKSTART.md       # Quick testing guide
│   ├── TESTING.md          # Comprehensive test cases
│   ├── DEPLOYMENT.md       # Deployment instructions
│   └── SPOTIFY-REQUIREMENTS.md # Spotify API requirements
└── tests/
    └── test-validation.html # Automated validation tests
```

## Quick Start

### Option 1: Local Testing

1. Clone or download this repository
2. Navigate to the `web-app` directory
3. Open `index.html` in your browser (or use a local server)
4. Follow the on-screen instructions

**Using a local server (recommended):**
```bash
cd web-app
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: GitHub Pages (Production)

1. Fork this repository
2. Enable GitHub Pages in repository settings (Settings → Pages → Source: `main` branch, `/web-app` folder)
3. Visit your GitHub Pages URL (usually `https://[username].github.io/byebyespotify/`)

## How It Works

### Step 1: Create Spotify Developer App

Users create their own Spotify Developer app to ensure:
- Complete data privacy (data stays in browser)
- No backend infrastructure needed
- User control over credentials

**Process** (~2-3 minutes):
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create app"
3. Fill in form with provided values
4. Copy Client ID and Client Secret

### Step 2: Authenticate

1. Enter Client ID, Client Secret, and Redirect URI
2. Click "Connect to Spotify"
3. Authorize the app on Spotify's page
4. Redirected back to web app

### Step 3: Export

1. Click "Export All Playlists"
2. Wait for export to complete (progress indicator shown)
3. Download ZIP file containing all playlists

## Source Code Structure

All source code is organized in the `src/` directory:

- **`src/js/`** - JavaScript modules
  - `spotify-api.js` - Handles OAuth and Spotify API communication
  - `export.js` - Playlist export logic and format generation
  - `app.js` - UI coordination and user interaction handling

- **`src/css/`** - Stylesheets
  - `styles.css` - All application styling

## Export Structure

Downloaded ZIP file contains:

```
spotify_export_YYYY-MM-DD.zip
├── My Playlists/
│   ├── YYYY-MM-DD - Playlist Name 1/
│   │   ├── title.txt         # Full playlist name with special characters
│   │   ├── author.txt         # Owner info and follower count
│   │   ├── description.txt    # Playlist description
│   │   ├── cover.jpg          # Playlist cover image
│   │   └── tracks.csv         # Track metadata with ISRC codes
│   └── YYYY-MM-DD - Playlist Name 2/
│       └── ...
└── Other Playlists/
    └── ...
```

### CSV Format

Track metadata includes:
- Track Name
- Artists
- Album
- Release Date
- Duration (ms)
- Popularity
- **ISRC** (International Standard Recording Code for accurate matching)
- Added At
- Track URL

## Technical Details

### Dependencies

**Required (loaded from CDN):**
- [JSZip](https://stuk.github.io/jszip/) - ZIP file creation (loaded dynamically)

**No build process required** - pure HTML/CSS/JavaScript.

### Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported

**Requirements:**
- Modern browser with JavaScript enabled
- Fetch API support (all modern browsers)
- Blob and File API support

### API Usage

**Spotify API Endpoints Used:**
- `GET /v1/me` - Get current user
- `GET /v1/me/playlists` - Get user's playlists
- `GET /v1/playlists/{id}/tracks` - Get playlist tracks

**Scopes Required:**
- `playlist-read-private` - Access private playlists
- `playlist-read-collaborative` - Access collaborative playlists

### OAuth Flow

1. User provides credentials → App generates authorization URL
2. User redirected to Spotify → Authorizes app
3. Spotify redirects back with authorization code
4. App exchanges code for access token
5. Access token used for API calls

**Security:**
- Client Secret stored only in sessionStorage (cleared on browser close)
- Access token never leaves the browser
- All API calls made directly to Spotify from client

## Development

### Local Development

Simply open `index.html` in a browser. No build process needed.

**For live reload during development**, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then visit http://localhost:8000
```

### Testing

See [`docs/TESTING.md`](docs/TESTING.md) for comprehensive testing procedures.

Run automated validation tests by opening [`tests/test-validation.html`](tests/test-validation.html) in your browser.

### Debugging

Use browser DevTools:
- Console for error messages
- Network tab to monitor API calls
- Application tab to check sessionStorage

## Deployment

### GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Set source to `main` branch, `/web-app` folder
4. Save and wait for deployment (~1-2 minutes)
5. Visit the provided URL

### Custom Domain (Optional)

1. Add `CNAME` file to `web-app/` with your domain
2. Configure DNS settings with your domain provider
3. Update Redirect URI in Spotify Developer app

## Troubleshooting

### "Failed to get access token"

**Cause:** Incorrect Client ID, Client Secret, or Redirect URI

**Solution:**
- Verify credentials from Spotify Developer Dashboard
- Ensure Redirect URI exactly matches (including http:// and port)
- Check that you clicked "Save" after creating the app

### "Authentication failed"

**Cause:** OAuth flow interrupted or credentials expired

**Solution:**
- Clear browser cache and sessionStorage
- Refresh page and try again
- Verify Spotify Developer app is still active

### "Export failed"

**Cause:** Network issues or API rate limiting

**Solution:**
- Check internet connection
- Wait a few minutes and try again
- Refresh page and re-authenticate

### Images not downloading

**Cause:** CORS restrictions or expired image URLs

**Solution:**
- This is normal for some playlists (Spotify's temporary URLs)
- Most playlist covers should download successfully
- Missing covers will simply be skipped

### ZIP file not downloading

**Cause:** Browser pop-up blocker or insufficient permissions

**Solution:**
- Allow downloads from this site
- Check browser's download permissions
- Try in a different browser

## Privacy & Security

### What We Collect

**Nothing.** This application:
- Runs entirely in your browser
- Makes no server-side requests (except to Spotify's API)
- Stores no data on any server
- Uses no analytics or tracking
- Is fully open source and auditable

### What You Control

- Your Spotify Developer app credentials
- Your Spotify account access
- Your exported data (stored locally)

### What Spotify Sees

- That an app with your credentials accessed your playlists
- Standard OAuth authentication flow
- API requests for playlist and track data

## Known Limitations

1. **Large Libraries:** Very large libraries (500+ playlists) may take several minutes to export
2. **Rate Limiting:** Spotify may rate limit if exporting too frequently
3. **Image URLs:** Some Spotify image URLs are temporary and may expire
4. **Browser Memory:** Extremely large exports may strain browser memory (consider closing other tabs)

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

See main repository LICENSE file.

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review documentation in `docs/` folder
3. Open an issue on GitHub

---

**Your playlists are worth preserving. This tool helps you take them with you, personality intact.**
