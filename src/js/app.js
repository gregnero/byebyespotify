/**
 * Main Application Logic
 * Handles UI interactions and coordinates export process
 */

// Global state
let spotifyAPI = null;
let exporter = null;

// DOM Elements
const setupSection = document.getElementById('setup-section');
const credentialsSection = document.getElementById('credentials-section');
const exportSection = document.getElementById('export-section');
const errorSection = document.getElementById('error-section');
const whyLink = document.getElementById('why-link');
const whyExplanation = document.getElementById('why-explanation');
const credentialsForm = document.getElementById('credentials-form');
const clientIdInput = document.getElementById('client-id');
const clientSecretInput = document.getElementById('client-secret');
const redirectUriInput = document.getElementById('redirect-uri-input');
const userInfo = document.getElementById('user-info');
const username = document.getElementById('username');
const exportBtn = document.getElementById('export-btn');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultsSection = document.getElementById('results-section');
const resultsText = document.getElementById('results-text');
const downloadBtn = document.getElementById('download-btn');
const errorText = document.getElementById('error-text');

// State
let exportedData = null;

/**
 * Auto-detect redirect URI based on current page URL
 * Follows Spotify's requirements:
 * - HTTPS for production
 * - HTTP only for loopback (127.0.0.1 or [::1])
 * - localhost is NOT allowed
 */
function autoDetectRedirectUri() {
    let currentUrl = window.location.origin + window.location.pathname;

    // Spotify requirement: Replace 'localhost' with '127.0.0.1' for loopback
    if (currentUrl.includes('localhost')) {
        currentUrl = currentUrl.replace('localhost', '127.0.0.1');
    }

    // Update the redirect URI input if it's still the default
    const currentValue = redirectUriInput.value;
    if (currentValue === 'http://localhost:8000/' ||
        currentValue === 'http://127.0.0.1:8888/callback' ||
        currentValue === 'http://127.0.0.1:8000/') {
        redirectUriInput.value = currentUrl;
    }

    // Update the displayed redirect URI in instructions
    const redirectUriDisplay = document.getElementById('redirect-uri');
    if (redirectUriDisplay) {
        redirectUriDisplay.textContent = currentUrl;
    }
}

/**
 * Initialize application
 */
function init() {
    // Auto-detect and set redirect URI based on current page URL
    autoDetectRedirectUri();

    // Toggle "why" explanation
    whyLink.addEventListener('click', (e) => {
        e.preventDefault();
        whyExplanation.classList.toggle('hidden');
    });

    // Handle credentials form submission
    credentialsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleAuthentication();
    });

    // Handle export button
    exportBtn.addEventListener('click', async () => {
        await handleExport();
    });

    // Handle download button
    downloadBtn.addEventListener('click', () => {
        downloadZIP();
    });

    // Check if returning from OAuth redirect
    checkOAuthCallback();
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const feedback = document.getElementById(`${elementId}-feedback`);
        feedback.classList.add('show');
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    });
}

/**
 * Show error message
 */
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.classList.add('hidden');
    }, 5000);
}

/**
 * Handle authentication flow
 */
async function handleAuthentication() {
    const clientId = clientIdInput.value.trim();
    const clientSecret = clientSecretInput.value.trim();
    const redirectUri = redirectUriInput.value.trim();

    if (!clientId || !clientSecret || !redirectUri) {
        showError('Please fill in all credentials');
        return;
    }

    // Store credentials in sessionStorage
    sessionStorage.setItem('clientId', clientId);
    sessionStorage.setItem('clientSecret', clientSecret);
    sessionStorage.setItem('redirectUri', redirectUri);

    // Create API instance
    spotifyAPI = new SpotifyAPI(clientId, clientSecret, redirectUri);

    // Redirect to Spotify authorization
    window.location.href = spotifyAPI.getAuthUrl();
}

/**
 * Check if returning from OAuth callback
 */
async function checkOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
        showError(`Spotify authorization failed: ${error}`);
        return;
    }

    if (code) {
        // Get stored credentials
        const clientId = sessionStorage.getItem('clientId');
        const clientSecret = sessionStorage.getItem('clientSecret');
        const redirectUri = sessionStorage.getItem('redirectUri');

        if (!clientId || !clientSecret || !redirectUri) {
            showError('Missing credentials. Please start over.');
            return;
        }

        try {
            // Create API instance
            spotifyAPI = new SpotifyAPI(clientId, clientSecret, redirectUri);

            // Exchange code for token
            await spotifyAPI.getAccessToken(code);

            // Get user info
            const user = await spotifyAPI.getCurrentUser();
            username.textContent = user.display_name || user.id;

            // Create exporter
            exporter = new PlaylistExporter(spotifyAPI);

            // Show export section
            credentialsSection.classList.add('hidden');
            setupSection.classList.add('hidden');
            exportSection.classList.remove('hidden');
            userInfo.classList.remove('hidden');

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            showError(`Authentication failed: ${error.message}`);
            console.error(error);
        }
    }
}

/**
 * Handle export process
 */
async function handleExport() {
    if (!exporter) {
        showError('Not authenticated. Please refresh and try again.');
        return;
    }

    try {
        // Disable export button
        exportBtn.disabled = true;
        progressSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');

        // Export playlists
        const onProgress = (message, percent) => {
            progressText.textContent = message;
            progressFill.style.width = `${percent}%`;
        };

        exportedData = await exporter.exportAllPlaylists(onProgress);

        // Create ZIP
        progressText.textContent = 'Creating ZIP file...';
        await createZIPFile(exportedData);

        // Show results
        const totalPlaylists = exportedData.myPlaylists.length + exportedData.otherPlaylists.length;
        resultsText.textContent = `Successfully exported ${totalPlaylists} playlists!`;
        progressSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

    } catch (error) {
        showError(`Export failed: ${error.message}`);
        console.error(error);
        exportBtn.disabled = false;
        progressSection.classList.add('hidden');
    }
}

/**
 * Create ZIP file from exported data
 */
async function createZIPFile(data) {
    // Load JSZip library dynamically if not already loaded
    if (typeof JSZip === 'undefined') {
        await loadJSZip();
    }

    const zip = new JSZip();
    const dateStamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Create folder structure
    const myPlaylistsFolder = zip.folder('My Playlists');
    const otherPlaylistsFolder = zip.folder('Other Playlists');

    // Add "My Playlists"
    for (const playlist of data.myPlaylists) {
        const playlistFolder = myPlaylistsFolder.folder(playlist.folderName);
        playlistFolder.file('description.txt', playlist.description);
        playlistFolder.file('tracks.csv', playlist.csv);
        playlistFolder.file('tracks.m3u', playlist.m3u);
        if (playlist.coverBlob) {
            playlistFolder.file('cover.jpg', playlist.coverBlob);
        }
    }

    // Add "Other Playlists"
    for (const playlist of data.otherPlaylists) {
        const playlistFolder = otherPlaylistsFolder.folder(playlist.folderName);
        playlistFolder.file('description.txt', playlist.description);
        playlistFolder.file('tracks.csv', playlist.csv);
        playlistFolder.file('tracks.m3u', playlist.m3u);
        if (playlist.coverBlob) {
            playlistFolder.file('cover.jpg', playlist.coverBlob);
        }
    }

    // Generate ZIP
    const blob = await zip.generateAsync({ type: 'blob' });

    // Store for download
    exportedData.zipBlob = blob;
    exportedData.zipFilename = `spotify_export_${dateStamp}.zip`;
}

/**
 * Download ZIP file
 */
function downloadZIP() {
    if (!exportedData || !exportedData.zipBlob) {
        showError('No export data available');
        return;
    }

    // Create download link
    const url = URL.createObjectURL(exportedData.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportedData.zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Load JSZip library dynamically
 */
function loadJSZip() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make copyToClipboard available globally
window.copyToClipboard = copyToClipboard;
