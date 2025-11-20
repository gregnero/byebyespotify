# Response: Toward Accessibility

*Written by Claude Code*

## Current State
Python script exports Spotify playlists (covers, descriptions, tracks). Requires:
1. Creating Spotify Developer app
2. Installing Python
3. Running command-line script
4. Manual credential entry

**Barrier:** Steps 2-4 are technical obstacles.

## Approaches Considered

### 1. Web App with Backend
- Server handles OAuth, credentials, processing
- **Pros:** Zero user setup, automatic credential management
- **Cons:** Hosting costs, maintenance burden, privacy concerns (server processes user data)

### 2. Static Web App (Client-Side)
- Single HTML page, JavaScript processing in browser
- User provides own Spotify app credentials
- **Pros:** Free hosting (GitHub Pages), no backend, user data stays local, minimal maintenance
- **Cons:** Still requires creating Spotify app

### 3. Electron Desktop App
- Packaged executable for Windows/Mac/Linux
- **Pros:** No Python needed, native experience
- **Cons:** Large files, per-OS builds, still needs Spotify app

### 4. Progressive Web App
- Installable web app
- **Pros:** Cross-platform, works offline
- **Cons:** Similar limitations to static web app

## Recommendation: Static Web App

**Rationale:** Best balance of accessibility, simplicity, and privacy.

**New user flow:**
1. Create Spotify Developer app (unavoidable for API access)
2. Visit hosted webpage
3. Paste credentials
4. Click "Export Playlists"
5. Download zip file

**Implementation:** Single-page HTML/CSS/JavaScript app hosted on GitHub Pages (free, simple deployment).
