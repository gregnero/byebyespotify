# Refined Vision: Bye Bye Spotify

*Written by Claude Code*

## Project Purpose

**Bye Bye Spotify** is a playlist preservation and archival tool that captures everything that makes your playlists unique-including the custom covers, descriptions, and metadata that commercial transfer tools lose.

### What This Tool Does

1. **Preserves Complete Playlist Identity**
   - Custom cover images (that transfer tools don't preserve)
   - Playlist descriptions (that transfer tools often lose)
   - Full track metadata including ISRC codes for accurate matching
   - Date-stamped folders organized by "My Playlists" and "Other Playlists"

2. **Exports in Transfer-Compatible Formats**
   - CSV format (compatible with all major transfer tools)
   - M3U format (universal playlist format)
   - Includes ISRC codes for improved track matching accuracy

3. **Creates a Permanent Archive**
   - Local storage independent of any platform
   - Organized, human-readable file structure
   - Everything zipped for easy storage or sharing

### What This Tool Doesn't Do

This tool **does not** automatically recreate your playlists on other streaming platforms. That's what commercial transfer tools are for (and they do it well). This tool ensures that before you transfer, you have a complete archive of your creative work.

---

## User Workflow

### Step 1: Archive Everything (This Tool)
**Goal:** Preserve your complete playlist collection with covers, descriptions, and metadata

**Process:**
1. Visit the web application
2. Create a Spotify Developer app (required for API access)
3. Paste your API credentials into the web app
4. Click "Export Playlists"
5. Download your complete archive as a ZIP file

**Result:** You have a permanent, platform-independent archive of your playlists with:
- Cover images saved as `cover.jpg`
- Descriptions saved as `description.txt`
- Full track data in both CSV and M3U formats
- ISRC codes for accurate track identification

### Step 2: Transfer Tracks (Third-Party Tools)
**Goal:** Recreate your playlists on your new platform

**Recommended Tools:**
- **TuneMyMusic** (free up to 500 songs, $4.50/month unlimited)
- **Soundiiz** ($3.25/month with advanced features)
- **MusConv** (125+ platform support)

**Process:**
1. Choose your destination platform (Apple Music, Tidal, YouTube Music, etc.)
2. Use a transfer tool to import your CSV files
3. ~80-90% of tracks will match successfully
4. Review and manually fix any mismatches

**Result:** Your track collections are now on your new platform (though covers and descriptions will be missing)

### Step 3: Restore Personality (Manual)
**Goal:** Re-add the visual and contextual elements that make your playlists special

**Process:**
1. On your new platform, locate each transferred playlist
2. Re-upload cover images from your archive (if platform supports custom covers)
3. Copy-paste descriptions from your archive (if platform supports descriptions)

**Result:** Your playlists are fully restored with their original personality intact

---

## Why This Matters

Commercial playlist transfer tools prioritize speed and track quantity. They treat playlists as simple song lists. But anyone who has spent years curating playlists knows they're more than that:

- The carefully chosen cover that sets the mood
- The description that explains the vibe or tells a story
- The specific order and flow of tracks
- The memory of when and why you added each song

This tool recognizes that **playlists are an art form**. When you leave Spotify, you shouldn't have to lose that artistry. You should have a complete, permanent record of your creative work-independent of any platform's terms of service, algorithm changes, or business decisions.

---

## Technical Approach

### Current Implementation
Python script (`export_playlists.py`) that:
- Uses Spotify Web API with OAuth authentication
- Auto-installs dependencies (spotipy, requests, pandas)
- Exports to organized folder structure
- Creates ZIP archive of all content

### Planned Web Application
Single-page static web app that:
- Runs entirely in the browser (client-side JavaScript)
- Uses Spotify Web API directly (no backend server)
- Maintains user privacy (all data processed locally)
- Hosted on GitHub Pages (free, simple deployment)
- Provides same functionality as Python script with no installation required

### Enhanced Export Formats
- **CSV** (existing): Compatible with all transfer tools
- **M3U** (new): Universal playlist format for widest compatibility
- **ISRC codes** (new): Improves track matching accuracy during transfers

---

## Success Criteria

This tool succeeds when users can:

1.  Archive their complete Spotify library in under 15 minutes
2.  Access their playlists in human-readable formats (CSV, M3U, images, text)
3.  Use standard transfer tools to move to any platform
4.  Manually restore covers and descriptions with minimal friction
5.  Own a permanent, platform-independent record of their curation work

---

## Looking Forward

This tool is intentionally focused and minimalistic. It does one thing well: preserves what matters. As Grey noted in the README, "a single executable python script seems like a manageable place to start." The web application maintains that philosophy-it's the simplest possible solution that solves the real problem.

The goal isn't to build another complex music management system. The goal is to help people preserve their playlist artistry and move on to platforms that align with their values, whether that's Bandcamp (best artist compensation), Tidal (highest per-stream rates), SoundCloud (independent artist focus), or physical media collections.

Your playlists are worth preserving. Let's make sure you can take them with you, personality intact.
