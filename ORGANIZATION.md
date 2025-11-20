# Web Application Directory Organization

This document explains the organization and purpose of each directory and file in the web application.

## Overview

The web application is organized into logical directories to separate concerns and make the codebase easier to navigate and maintain.

```
web-app/
├── index.html              # Entry point
├── README.md               # User guide and documentation
├── ORGANIZATION.md         # This file
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript modules
├── docs/                   # Documentation
└── tests/                  # Testing files
```

## Directory Structure

### Root Level

**`index.html`**
- Main application entry point
- Single-page application (SPA)
- Contains the complete UI structure
- Links to all CSS and JavaScript resources
- Can be opened directly in browser or served via local server

**`README.md`**
- Primary documentation for users and developers
- Features overview
- Quick start guide
- How-to instructions
- Troubleshooting section
- API usage details

**`ORGANIZATION.md`** (this file)
- Explains directory structure
- File purposes and relationships
- Navigation guide for developers

---

### `src/` - Source Code

All application source code organized by type.

#### `src/css/` - Stylesheets

**`styles.css`** (343 lines)
- All application styling
- Spotify-themed color scheme (#1DB954 green)
- Mobile-responsive design
- Component-specific styles (buttons, forms, progress bars, etc.)
- No external CSS frameworks (pure CSS)

#### `src/js/` - JavaScript Modules

**`spotify-api.js`** (130 lines)
- Spotify Web API wrapper class
- OAuth 2.0 authentication handling
- API endpoint methods (playlists, tracks, user info)
- Pagination handling
- Image downloading
- Error handling

**`export.js`** (162 lines)
- Playlist export orchestration
- Format generation (CSV, M3U, description, cover)
- Safe filename handling
- Date formatting
- CSV escaping (commas, quotes, newlines)
- M3U format generation with EXTINF tags

**`app.js`** (251 lines)
- Main application logic
- UI event handling
- OAuth callback processing
- Export workflow coordination
- Progress indicators
- ZIP file creation (using JSZip)
- Download handling
- Error message display

**Module Dependencies:**
```
index.html
  ├── spotify-api.js (loaded first)
  ├── export.js (loaded second, depends on spotify-api.js conceptually)
  └── app.js (loaded third, coordinates everything)
```

---

### `docs/` - Documentation

Comprehensive documentation for different audiences and purposes.

**`QUICKSTART.md`**
- **Purpose:** Get users testing in 5 minutes
- **Audience:** Users, testers
- **Contents:**
  - Quick setup instructions
  - Minimal steps to verify functionality
  - Troubleshooting common issues
  - Links to more detailed documentation

**`TESTING.md`** (30 test cases)
- **Purpose:** Comprehensive test procedures
- **Audience:** Developers, QA testers
- **Contents:**
  - 30 numbered test cases
  - Test environment setup
  - Pre-testing requirements
  - Pass/fail criteria for each test
  - Browser compatibility checklist
  - Edge case scenarios

**`SUMMARY.md`**
- **Purpose:** Technical overview of the project
- **Audience:** Developers, contributors
- **Contents:**
  - What was built (features, files)
  - Technical highlights
  - User experience walkthrough
  - Testing status
  - Known limitations
  - Deployment readiness
  - Next steps

---

### `tests/` - Testing Files

Automated and manual testing resources.

**`test-validation.html`**
- **Purpose:** Automated JavaScript validation
- **Type:** Self-contained HTML test runner
- **Tests:**
  - Module loading (spotify-api.js, export.js)
  - Class instantiation (SpotifyAPI, PlaylistExporter)
  - Method existence checks
  - Safe filename handling
  - CSV escaping (commas, quotes, newlines)
  - M3U format generation
  - Date formatting
- **Usage:** Open in browser, see green checkmarks (✅) or red X's (❌)
- **Path Updates:** Uses relative paths (`../src/js/`) to access source modules

---

## File Relationships

### How Files Work Together

1. **User opens `index.html`**
   - Browser loads HTML structure
   - Fetches `src/css/styles.css` for styling
   - Loads JavaScript modules in order:
     - `src/js/spotify-api.js` → defines `SpotifyAPI` class
     - `src/js/export.js` → defines `PlaylistExporter` class
     - `src/js/app.js` → initializes app, handles UI

2. **User interacts with UI**
   - `app.js` captures events (form submit, button clicks)
   - Creates instances of `SpotifyAPI` and `PlaylistExporter`
   - Coordinates OAuth flow and export process

3. **Export process**
   - `app.js` → calls `PlaylistExporter.exportAllPlaylists()`
   - `PlaylistExporter` → uses `SpotifyAPI` to fetch data
   - `PlaylistExporter` → generates CSV and M3U formats
   - `app.js` → creates ZIP file and triggers download

### Data Flow

```
User Input (credentials)
    ↓
app.js (UI coordination)
    ↓
spotify-api.js (OAuth & API calls)
    ↓
Spotify Web API
    ↓
spotify-api.js (returns data)
    ↓
export.js (format generation)
    ↓
app.js (ZIP creation)
    ↓
Browser Download (ZIP file)
```

---

## Path Conventions

All paths are relative to the `web-app/` root directory.

### From `index.html`:
```html
<link rel="stylesheet" href="src/css/styles.css">
<script src="src/js/spotify-api.js"></script>
<script src="src/js/export.js"></script>
<script src="src/js/app.js"></script>
```

### From `tests/test-validation.html`:
```javascript
script1.src = '../src/js/spotify-api.js';
script2.src = '../src/js/export.js';
```

### Within Documentation:
```markdown
See [docs/TESTING.md](docs/TESTING.md) for details.
See [tests/test-validation.html](tests/test-validation.html) for validation.
```

---

## Why This Organization?

### Benefits

1. **Separation of Concerns**
   - Source code (`src/`) separate from documentation (`docs/`)
   - Tests (`tests/`) isolated for easy discovery
   - Clear boundaries between code types (JS vs CSS)

2. **Easier Navigation**
   - All JavaScript in one place (`src/js/`)
   - All documentation in one place (`docs/`)
   - Logical grouping makes files easy to find

3. **Maintainability**
   - Adding new JS modules: put in `src/js/`
   - Adding new styles: add to or split from `src/css/`
   - Adding new docs: put in `docs/`
   - Clear conventions for contributors

4. **Professional Structure**
   - Standard web project layout
   - Scalable if project grows
   - Easy for new contributors to understand

5. **GitHub Pages Compatible**
   - Relative paths work locally and when hosted
   - No build process needed
   - Static file structure maps directly to URLs

### Alternative Considered

**Flat structure (previous):**
```
web-app/
├── index.html
├── styles.css
├── spotify-api.js
├── export.js
├── app.js
├── README.md
├── TESTING.md
├── SUMMARY.md
├── QUICKSTART.md
└── test-validation.html
```

**Why we reorganized:**
- 10 files in root was cluttered
- Hard to distinguish code from docs
- Difficult to find specific file types
- Doesn't scale well if more files are added

---

## Adding New Files

### Adding a New JavaScript Module

**Location:** `src/js/new-module.js`

**Update:**
1. Create file in `src/js/`
2. Add `<script src="src/js/new-module.js"></script>` to `index.html`
3. Consider load order (dependencies)
4. Update this ORGANIZATION.md to document the new module

### Adding a New Stylesheet

**Location:** `src/css/new-styles.css`

**Update:**
1. Create file in `src/css/` OR add to existing `styles.css`
2. If new file: add `<link rel="stylesheet" href="src/css/new-styles.css">` to `index.html`
3. Update this ORGANIZATION.md if creating separate stylesheet

### Adding New Documentation

**Location:** `docs/new-doc.md`

**Update:**
1. Create file in `docs/`
2. Add link from `README.md` if user-facing
3. Add link from `SUMMARY.md` if developer-facing
4. Update this ORGANIZATION.md to describe the new document

### Adding New Tests

**Location:** `tests/new-test.html` or `tests/new-test.js`

**Update:**
1. Create file in `tests/`
2. Use relative paths to access source: `../src/js/`
3. Document test in `docs/TESTING.md`
4. Update this ORGANIZATION.md to list the new test

---

## Common Tasks

### Running Locally

```bash
# Navigate to web-app directory
cd web-app

# Start local server
python -m http.server 8000

# Visit http://localhost:8000
# index.html loads automatically
```

### Running Tests

**Automated validation:**
```bash
# Open in browser
open tests/test-validation.html

# Or via local server
# Visit http://localhost:8000/tests/test-validation.html
```

**Manual testing:**
Follow procedures in `docs/TESTING.md`

### Modifying Styles

1. Edit `src/css/styles.css`
2. Refresh browser to see changes
3. No build process needed

### Modifying JavaScript

1. Edit files in `src/js/`
2. Refresh browser to reload scripts
3. Check browser console for errors
4. Use browser DevTools for debugging

### Adding Features

1. Plan which file(s) need changes:
   - UI changes → `index.html` + `src/css/styles.css`
   - New API methods → `src/js/spotify-api.js`
   - New export formats → `src/js/export.js`
   - New UI logic → `src/js/app.js`

2. Make changes

3. Test using `tests/test-validation.html` and `docs/TESTING.md`

4. Update documentation:
   - User-facing changes → `README.md`
   - Technical changes → `docs/SUMMARY.md`
   - New files → `ORGANIZATION.md`

---

## Related Documentation

- **[README.md](README.md)** - User guide and main documentation
- **[docs/QUICKSTART.md](docs/QUICKSTART.md)** - 5-minute testing guide
- **[docs/TESTING.md](docs/TESTING.md)** - Comprehensive test procedures
- **[docs/SUMMARY.md](docs/SUMMARY.md)** - Technical overview
- **[../docs/clarifying-function/refined-vision.md](../docs/clarifying-function/refined-vision.md)** - Project purpose
- **[../docs/design-decisions/authentication-architecture.md](../docs/design-decisions/authentication-architecture.md)** - Architecture rationale

---

## Quick Reference

| Need to... | Look in... |
|------------|-----------|
| Modify UI structure | `index.html` |
| Change styling | `src/css/styles.css` |
| Add Spotify API methods | `src/js/spotify-api.js` |
| Change export formats | `src/js/export.js` |
| Modify UI behavior | `src/js/app.js` |
| Learn how to use | `README.md` |
| Test the app | `docs/TESTING.md`, `tests/test-validation.html` |
| Understand architecture | `docs/SUMMARY.md` |
| Get started quickly | `docs/QUICKSTART.md` |
| Understand file organization | `ORGANIZATION.md` (this file) |

---

**Last Updated:** November 20, 2025

**Maintained By:** Project contributors

**Questions?** Open an issue on GitHub or consult the README.md
