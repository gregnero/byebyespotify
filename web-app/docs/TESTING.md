# Testing Guide for Bye Bye Spotify Web App

This document provides comprehensive testing procedures to ensure the web application works correctly.

## Pre-Testing Setup

### Requirements
1. Modern web browser (Chrome, Firefox, Safari, or Edge)
2. Active Spotify account
3. At least one playlist in your Spotify account (for meaningful testing)
4. Internet connection

### Test Environment Setup

**Option A: Local File Testing**
```bash
# Simply open index.html in browser
open index.html  # macOS
start index.html # Windows
```

**Option B: Local Server (Recommended)**
```bash
# Using Python
cd web-app
python -m http.server 8000

# Then visit http://localhost:8000
```

## Test Cases

### 1. Initial Page Load

**Test:** Verify page loads correctly

**Steps:**
1. Open `index.html` in browser
2. Verify all sections are visible
3. Check that styles are applied correctly
4. Verify no JavaScript errors in console

**Expected Results:**
- ✅ Page title: "Bye Bye Spotify - Playlist Exporter"
- ✅ Three main sections visible (Setup, Credentials, Export hidden)
- ✅ Green Spotify-themed styling applied
- ✅ No errors in browser console
- ✅ "Why do I need to do this?" link present and functional

**Pass/Fail:** ___

---

### 2. Auto-Detection of Redirect URI

**Test:** Verify redirect URI is auto-detected correctly

**Steps:**
1. Visit the app (using either `http://localhost:8000/` or `http://127.0.0.1:8000/`)
2. Look at Step 1 instructions - check the displayed redirect URI
3. Check the "Redirect URI" field in Step 2 form
4. Verify it converts `localhost` to `127.0.0.1`

**Expected Results:**
- ✅ If visited via `localhost:8000`, displayed URI shows `http://127.0.0.1:8000/`
- ✅ Form field auto-fills with `http://127.0.0.1:8000/`
- ✅ URI uses explicit IP (127.0.0.1) not "localhost" (per Spotify requirements)
- ✅ Port number matches where app is running (8000, 5500, etc.)
- ✅ Includes trailing slash

**Pass/Fail:** ___

---

### 3. UI Interactions

**Test:** Verify UI elements respond correctly

**Steps:**
1. Click "Why do I need to do this?" link
2. Verify explanation appears
3. Click link again to hide
4. Click "Copy" button next to Redirect URI
5. Check clipboard content

**Expected Results:**
- ✅ Explanation section toggles visibility
- ✅ Explanation contains privacy and architecture info
- ✅ Copy button shows "Copied!" feedback
- ✅ Clipboard contains the auto-detected URI (e.g., `http://127.0.0.1:8000/`)
- ✅ Uses 127.0.0.1, not localhost

**Pass/Fail:** ___

---

### 4. Spotify Developer App Creation

**Test:** Guide user through app creation

**Manual Steps:**
1. Go to https://developer.spotify.com/dashboard
2. Log in to Spotify account
3. Click "Create app"
4. **Copy the redirect URI from the web app** (from Step 1, should be like `http://127.0.0.1:8000/`)
5. Fill in form:
   - **App name:** byebyespotify-test
   - **App description:** Testing playlist export
   - **Redirect URI:** Paste the URI from web app (click "Add")
   - Check "I understand and agree"
6. Click "Save"
7. Copy Client ID from app dashboard
8. Click "Show Client Secret" and copy it

**Expected Results:**
- ✅ App created successfully
- ✅ Redirect URI uses 127.0.0.1 (not localhost)
- ✅ Redirect URI matches exactly what web app displayed
- ✅ Client ID is a 32-character alphanumeric string
- ✅ Client Secret is a 32-character alphanumeric string
- ✅ Redirect URI is saved and visible in app settings

**Pass/Fail:** ___

---

### 4. Credential Entry

**Test:** Enter credentials and authenticate

**Steps:**
1. Paste Client ID into "Client ID" field
2. Paste Client Secret into "Client Secret" field
3. Verify Redirect URI is pre-filled correctly
4. Click "Connect to Spotify"

**Expected Results:**
- ✅ All fields accept input
- ✅ Client Secret field shows password dots
- ✅ Button click redirects to Spotify authorization page
- ✅ No JavaScript errors in console

**Pass/Fail:** ___

---

### 5. Spotify Authorization

**Test:** Complete OAuth flow

**Steps:**
1. On Spotify authorization page, review permissions
2. Verify requested scopes:
   - Read your private playlists
   - Read your collaborative playlists
3. Click "Agree" or "Authorize"

**Expected Results:**
- ✅ Redirected to Spotify's authorization page
- ✅ App name displayed correctly
- ✅ Permissions clearly listed
- ✅ After authorization, redirected back to web app
- ✅ URL contains `?code=` parameter

**Pass/Fail:** ___

---

### 6. Post-Authentication State

**Test:** Verify authenticated state

**Steps:**
1. After redirect, wait for page to load
2. Check that export section is now visible
3. Verify username is displayed
4. Check browser console for errors

**Expected Results:**
- ✅ Setup and credentials sections hidden
- ✅ Export section visible
- ✅ User info displays: "Connected as: [Your Spotify Username]"
- ✅ "Export All Playlists" button is enabled
- ✅ No errors in console
- ✅ URL cleaned up (no ?code= parameter)

**Pass/Fail:** ___

---

### 7. Export Process - Small Library (1-5 playlists)

**Test:** Export with small number of playlists

**Steps:**
1. Click "Export All Playlists" button
2. Watch progress bar and status messages
3. Wait for completion

**Expected Results:**
- ✅ Button becomes disabled during export
- ✅ Progress section becomes visible
- ✅ Progress bar animates from 0% to 100%
- ✅ Status messages update (e.g., "Exporting playlist 1 of 3...")
- ✅ "Creating ZIP file..." message appears at end
- ✅ Results section appears when complete
- ✅ Success message shows correct playlist count
- ✅ "Download ZIP" button appears
- ✅ Process completes in reasonable time (<2 minutes)

**Pass/Fail:** ___

---

### 8. Export Process - Large Library (10+ playlists)

**Test:** Export with larger number of playlists

**Prerequisites:** Test account with 10+ playlists

**Steps:**
1. Click "Export All Playlists" button
2. Monitor progress bar and messages
3. Wait for completion

**Expected Results:**
- ✅ Progress updates smoothly
- ✅ Progress percentages increase correctly
- ✅ No browser freezing or unresponsiveness
- ✅ All playlists exported successfully
- ✅ Completes within reasonable time (~1 minute per 10-15 playlists)

**Pass/Fail:** ___

---

### 9. ZIP File Download

**Test:** Download and verify ZIP file

**Steps:**
1. Click "Download ZIP" button
2. Save file to known location
3. Check file size
4. Extract ZIP file
5. Examine contents

**Expected Results:**
- ✅ Browser downloads file immediately
- ✅ Filename format: `spotify_export_YYYY-MM-DD.zip`
- ✅ File size is reasonable (a few KB to several MB depending on playlists)
- ✅ ZIP extracts without errors
- ✅ Contains "My Playlists" folder
- ✅ Contains "Other Playlists" folder
- ✅ Each playlist has its own folder

**Pass/Fail:** ___

---

### 10. Exported Playlist Structure

**Test:** Verify individual playlist folder contents

**Steps:**
1. Open one playlist folder from "My Playlists"
2. Check for required files
3. Open and verify each file

**Expected Results:**
- ✅ Folder name format: `YYYY-MM-DD - Playlist Name`
- ✅ Contains `description.txt`
- ✅ Contains `tracks.csv`
- ✅ Contains `tracks.m3u`
- ✅ Contains `cover.jpg` (if playlist has cover image)

**Pass/Fail:** ___

---

### 11. CSV File Validation

**Test:** Verify CSV format and content

**Steps:**
1. Open `tracks.csv` in text editor or spreadsheet app
2. Check headers
3. Verify track data
4. Count rows

**Expected Results:**
- ✅ Headers: Track Name, Artists, Album, Release Date, Duration (ms), Popularity, ISRC, Added At, Track URL
- ✅ Each row represents one track
- ✅ Data properly escaped (commas, quotes handled correctly)
- ✅ ISRC codes present for most tracks
- ✅ Spotify URLs valid
- ✅ Row count matches expected track count

**Pass/Fail:** ___

---

### 12. M3U File Validation

**Test:** Verify M3U format and content

**Steps:**
1. Open `tracks.m3u` in text editor
2. Check format
3. Verify track entries

**Expected Results:**
- ✅ First line: `#EXTM3U`
- ✅ Second line: `#PLAYLIST:[Playlist Name]`
- ✅ Each track has `#EXTINF` line with duration and "Artist - Track" format
- ✅ Each track has Spotify URL line
- ✅ Format is valid M3U

**Pass/Fail:** ___

---

### 13. Description File Validation

**Test:** Verify description text

**Steps:**
1. Open `description.txt`
2. Compare with Spotify playlist description
3. Check special characters

**Expected Results:**
- ✅ Description matches Spotify exactly
- ✅ Special characters preserved (emojis, unicode, etc.)
- ✅ Empty file if playlist has no description
- ✅ Line breaks preserved

**Pass/Fail:** ___

---

### 14. Cover Image Validation

**Test:** Verify cover image quality

**Steps:**
1. Open `cover.jpg`
2. Check image quality
3. Compare with Spotify

**Expected Results:**
- ✅ Image opens correctly
- ✅ Reasonable quality (not blurry or pixelated)
- ✅ Matches playlist cover on Spotify
- ✅ File size reasonable (typically 50-500KB)

**Pass/Fail:** ___

---

### 15. Error Handling - Invalid Credentials

**Test:** Verify error messages for bad credentials

**Steps:**
1. Refresh page to reset
2. Enter fake Client ID (random string)
3. Enter fake Client Secret (random string)
4. Click "Connect to Spotify"
5. Try to authorize on Spotify page

**Expected Results:**
- ✅ Spotify shows "Invalid client" error OR authorization fails
- ✅ Web app shows clear error message
- ✅ User can retry with correct credentials

**Pass/Fail:** ___

---

### 16. Error Handling - Empty Credentials

**Test:** Verify validation for empty fields

**Steps:**
1. Leave Client ID empty
2. Click "Connect to Spotify"

**Expected Results:**
- ✅ Error message: "Please fill in all credentials"
- ✅ Form does not submit
- ✅ User can correct and resubmit

**Pass/Fail:** ___

---

### 17. Error Handling - Network Failure

**Test:** Verify behavior during network issues

**Steps:**
1. Start export process
2. Disable internet connection mid-export
3. Observe behavior

**Expected Results:**
- ✅ Clear error message displayed
- ✅ Export button re-enabled
- ✅ User can retry after reconnecting
- ✅ No browser crash or freeze

**Pass/Fail:** ___

---

### 18. Browser Compatibility - Chrome

**Test:** Full workflow in Chrome

**Steps:**
1. Complete full export process in Chrome
2. Verify all features work

**Expected Results:**
- ✅ All UI elements render correctly
- ✅ OAuth flow works
- ✅ Export completes successfully
- ✅ ZIP downloads correctly

**Pass/Fail:** ___

---

### 19. Browser Compatibility - Firefox

**Test:** Full workflow in Firefox

**Steps:**
1. Complete full export process in Firefox
2. Verify all features work

**Expected Results:**
- ✅ All UI elements render correctly
- ✅ OAuth flow works
- ✅ Export completes successfully
- ✅ ZIP downloads correctly

**Pass/Fail:** ___

---

### 20. Browser Compatibility - Safari

**Test:** Full workflow in Safari (if available)

**Steps:**
1. Complete full export process in Safari
2. Verify all features work

**Expected Results:**
- ✅ All UI elements render correctly
- ✅ OAuth flow works
- ✅ Export completes successfully
- ✅ ZIP downloads correctly

**Pass/Fail:** ___

---

### 21. Mobile Responsiveness

**Test:** Verify mobile display

**Steps:**
1. Open page on mobile device OR use browser dev tools responsive mode
2. Check layout at 375px width (iPhone)
3. Check layout at 768px width (iPad)
4. Try completing workflow on mobile

**Expected Results:**
- ✅ All text readable (no overflow)
- ✅ Buttons accessible and sized appropriately
- ✅ No horizontal scrolling
- ✅ Form fields usable on mobile
- ✅ OAuth flow works on mobile browser

**Pass/Fail:** ___

---

### 22. Session Persistence

**Test:** Verify session handling

**Steps:**
1. Complete authentication
2. Refresh page (before export)
3. Check state

**Expected Results:**
- ✅ Returns to initial state (credentials cleared)
- ✅ No errors thrown
- ✅ User must re-authenticate

**Pass/Fail:** ___

---

### 23. Multiple Export Attempts

**Test:** Export multiple times in same session

**Prerequisites:** Must be authenticated

**Steps:**
1. Complete one export
2. Click "Export All Playlists" again
3. Complete second export
4. Download second ZIP

**Expected Results:**
- ✅ Second export works without re-authentication
- ✅ New ZIP file downloaded with current date
- ✅ Contents are current/accurate

**Pass/Fail:** ___

---

### 24. Special Characters in Playlist Names

**Test:** Verify handling of special characters

**Prerequisites:** Create test playlist with name: `Test/Playlist: "Special" <Characters>`

**Steps:**
1. Export playlists
2. Check folder name in ZIP
3. Verify files are accessible

**Expected Results:**
- ✅ Invalid characters replaced with underscores
- ✅ Folder name: `YYYY-MM-DD - Test_Playlist_ _Special_ _Characters_`
- ✅ All files present and openable
- ✅ Original name preserved in playlist metadata if needed

**Pass/Fail:** ___

---

### 25. Empty Playlists

**Test:** Handle playlists with no tracks

**Prerequisites:** Create playlist with 0 tracks

**Steps:**
1. Export all playlists
2. Locate empty playlist in ZIP
3. Open its CSV and M3U files

**Expected Results:**
- ✅ Folder created for empty playlist
- ✅ CSV has headers only
- ✅ M3U has playlist name only
- ✅ Description and cover still included
- ✅ No errors during export

**Pass/Fail:** ___

---

### 26. Very Long Playlists

**Test:** Handle playlists with 100+ tracks

**Prerequisites:** Playlist with 100+ tracks

**Steps:**
1. Export playlists
2. Open CSV file
3. Count rows

**Expected Results:**
- ✅ All tracks exported
- ✅ CSV row count = track count + 1 (header)
- ✅ No truncation
- ✅ Export completes in reasonable time

**Pass/Fail:** ___

---

### 27. Playlists Without Covers

**Test:** Handle playlists with no cover image

**Prerequisites:** Playlist with no custom cover

**Steps:**
1. Export playlists
2. Check folder contents

**Expected Results:**
- ✅ Folder created successfully
- ✅ CSV and M3U files present
- ✅ Description file present
- ✅ No cover.jpg file (or auto-generated cover handled gracefully)
- ✅ No errors during export

**Pass/Fail:** ___

---

### 28. Collaborative Playlists

**Test:** Export collaborative playlists

**Prerequisites:** At least one collaborative playlist

**Steps:**
1. Export all playlists
2. Locate collaborative playlist
3. Verify it's in correct folder

**Expected Results:**
- ✅ Collaborative playlists appear in "My Playlists" if owned by user
- ✅ Collaborative playlists appear in "Other Playlists" if owned by others
- ✅ All tracks exported correctly
- ✅ Proper attribution in metadata

**Pass/Fail:** ___

---

### 29. Performance - Large Export

**Test:** Monitor performance during large export

**Prerequisites:** 50+ playlists OR 1000+ total tracks

**Steps:**
1. Open browser dev tools (Performance tab)
2. Start export
3. Monitor CPU/memory usage
4. Complete export

**Expected Results:**
- ✅ Browser remains responsive
- ✅ Memory usage stays reasonable (<500MB)
- ✅ No memory leaks
- ✅ Progress updates smoothly
- ✅ Completes successfully

**Pass/Fail:** ___

---

### 30. Console Errors Check

**Test:** Verify no unexpected errors

**Steps:**
1. Open browser console
2. Complete entire workflow
3. Check for any errors or warnings

**Expected Results:**
- ✅ No JavaScript errors
- ✅ No unhandled promise rejections
- ✅ No CORS errors
- ✅ Only expected API calls logged
- ✅ Clean console output

**Pass/Fail:** ___

---

## Summary

### Test Results Overview

**Total Tests:** 30

**Passed:** ___

**Failed:** ___

**Skipped:** ___

**Pass Rate:** ___%

### Critical Issues Found

List any critical bugs or issues discovered:

1.
2.
3.

### Minor Issues Found

List any minor issues or improvements:

1.
2.
3.

### Browser Compatibility Summary

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  |         | ✅/❌   |
| Firefox |         | ✅/❌   |
| Safari  |         | ✅/❌   |
| Edge    |         | ✅/❌   |

### Recommendations

Based on testing results:

1.
2.
3.

---

**Tester Name:** _______________

**Date:** _______________

**Environment:** _______________
