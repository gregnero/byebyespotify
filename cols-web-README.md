*Strange development README from Claude.*

# Bye Bye Spotify ! <3

You've worked so hard on your playlists. Carefully choosing cover pictures, writing angsty and deep descriptions with the hope that ur crush will see them and fall in love with you and run away with you into the Italian countryside ... no? Just me? Awkward...

Whatever the case, the playlist in its entirety is an art form. The cover image and the description are critically important to the integrity and personality of the playlist. Here is a way that you can export all of these things.

## What This Is

This tool lets you archive and export all of your playlists—covers, descriptions, and tracks included. This way, you can ditch Spotify and rest easy knowing that all of your hard work making playlists will be around in your personal files long after you're gone.

There are two versions:
- **Web app** (`web-app/`) - No Python needed, works in your browser
- **Python script** (`export_playlists.py`) - The original, still works great

The web app does everything the Python script does, but makes it accessible to folks who don't want to mess with terminal commands. Your data never leaves your browser—everything happens client-side.

## Using the Web App

**🌐 Live version:** [Deploy to GitHub Pages and add URL here]

Or run it locally:
```bash
cd web-app
python -m http.server 8000
# Visit http://localhost:8000
```

The web app will guide you through everything. It takes about 5 minutes if you've never done this before.

## Using the Python Script

If you prefer the original script, check out `greys-py-README.md` for instructions. It's still here and still works!

## What Gets Exported

Both versions export the same stuff:
- **Playlist covers** (JPEG images)
- **Descriptions** (text files)
- **Track lists** in multiple formats:
  - CSV with ISRC codes (for accurate transfers to other platforms)
  - M3U playlists (universal format)
- **Organized folders** (My Playlists / Other Playlists)
- **Everything in a ZIP** ready to download

## For Developers & Curious Users

Want to understand how this works? Here's the structure:

### Project Organization

```
byebyespotify/
├── web-app/              # The web application
├── docs/                 # Project documentation & research
├── planning-docs/        # Development history
├── export_playlists.py   # Original Python script
├── letter-to-grey.md     # Navigation guide for all docs
└── next-steps.md         # Deployment instructions
```

### Web App Architecture

The web app is built with vanilla HTML/CSS/JavaScript—no frameworks, no build process, no backend. It's designed to be simple, transparent, and run forever with zero maintenance.

**Core files:**
```
web-app/
├── index.html           # Main UI and user instructions
├── src/
│   ├── js/
│   │   ├── app.js           # UI coordination & OAuth flow
│   │   ├── spotify-api.js   # Spotify Web API wrapper
│   │   └── export.js        # Export logic & format generation
│   └── css/
│       └── styles.css       # Styling (Spotify green theme)
├── docs/                # User & developer documentation
└── tests/               # Automated validation tests
```

**How it works:**

1. **Authentication** - User creates their own Spotify Developer app (keeps data private, no backend needed)
2. **OAuth Flow** - Standard authorization code flow with Spotify Web API
3. **Data Fetching** - Paginated requests to get all playlists and tracks
4. **Format Generation** - Creates CSV (with ISRC codes), M3U, and text files
5. **Image Download** - Fetches playlist cover images (with CORS handling)
6. **ZIP Creation** - Uses JSZip to bundle everything client-side
7. **Download** - Browser downloads the final ZIP

**Key technical decisions:**

- **Client-side only** - Your data never hits a server, ever
- **Auto-detection** - Figures out redirect URIs automatically (localhost → 127.0.0.1 per Spotify requirements)
- **ISRC codes** - Improves track matching when transferring to other platforms
- **M3U format** - Universal playlist format, works everywhere
- **GitHub Pages ready** - Static files, no deployment complexity

### Documentation

We've documented *everything* because this tool is about preservation and transparency:

**Start here:**
- `letter-to-grey.md` - Navigation guide for all documentation

**Understanding the project:**
- `docs/clarifying-function/refined-vision.md` - Why this tool exists
- `docs/clarifying-function/research-with-claude.md` - Research on transfer tools

**Using the web app:**
- `web-app/docs/README.md` - Complete user guide
- `web-app/docs/QUICKSTART.md` - 5-minute testing guide

**Technical details:**
- `web-app/docs/SUMMARY.md` - Architecture overview
- `web-app/docs/SPOTIFY-REQUIREMENTS.md` - Spotify's requirements
- `web-app/ORGANIZATION.md` - Directory structure

**Development:**
- `planning-docs/development-log.md` - Complete development history
- `web-app/docs/TESTING.md` - 30+ test cases
- `next-steps.md` - Deployment instructions

### Why User-Created Apps?

You might wonder: "Why do I have to create my own Spotify Developer app?"

We *could* host a centralized backend that handles authentication for everyone, but that would mean:
- Your playlist data would pass through our servers
- Ongoing hosting costs and maintenance
- You'd have to trust us with your data

Instead, by creating your own app, **your data never leaves your browser**. This is more private, sustainable, and aligned with the tool's philosophy of user control.

Full rationale: `docs/design-decisions/authentication-architecture.md`

### Testing

The app has comprehensive test coverage:
- **13 automated tests** (`web-app/tests/test-validation.html`)
- **30+ manual test cases** (`web-app/docs/TESTING.md`)
- **Browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Mobile responsiveness** (works on phones and tablets)

Run automated tests:
```bash
cd web-app
python -m http.server 8000
# Visit http://localhost:8000/tests/test-validation.html
```

Expected: 13 green checkmarks ✅

### Deploying Your Own

Want to host your own version? It's straightforward:

1. **Fork this repo**
2. **Enable GitHub Pages** (Settings → Pages → Source: main, /web-app folder)
3. **Access at:** `https://[your-username].github.io/byebyespotify/`

See `next-steps.md` for detailed deployment instructions.

## Research Findings

Tools like TuneMyMusic, Soundiiz, and MusConv do a great job transferring *tracks* (80-90% success rate), but they completely ignore:
- Custom playlist covers
- Playlist descriptions
- The artistic intention behind the playlist

This tool is different. It's not a transfer tool—it's an **archival tool**. You use it to preserve what commercial tools lose. Then you can use those commercial tools to transfer your tracks, and manually restore your covers and descriptions on the new platform.

Full research: `docs/clarifying-function/research-with-claude.md`

## Moving On, from Grey

I've been exploring music in the digital world on:
* Bandcamp
* NTS Radio

And other places like:
* The radio
* Live shows
* Physical media (vinyls, cassettes)

I encourage you to check out any platforms that aren't actively supporting the fascist regime and platforms that compensate their musicians fairly. <3

## Credits

**Original Python script:** Grey (using ChatGPT)
**Web application:** Col (using Claude Code)

The playlist in its entirety is an art form. This tool helps you take it with you, personality intact.

---

**Need help?** Check `letter-to-grey.md` for navigation to all documentation.

**Ready to export?** Visit the web app or follow the instructions at `grey-py-README.md` and run the Python script.
