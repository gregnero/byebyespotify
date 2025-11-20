/**
 * Spotify API Wrapper
 * Handles OAuth authentication and API calls
 */

class SpotifyAPI {
    constructor(clientId, clientSecret, redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.accessToken = null;
        this.baseUrl = 'https://api.spotify.com/v1';
    }

    /**
     * Generate authorization URL for OAuth flow
     */
    getAuthUrl() {
        const scope = 'playlist-read-private playlist-read-collaborative';
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            scope: scope,
        });
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     */
    async getAccessToken(code) {
        const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.redirectUri,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get access token');
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        return this.accessToken;
    }

    /**
     * Make authenticated API request
     */
    async apiCall(endpoint, method = 'GET') {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Get current user's profile
     */
    async getCurrentUser() {
        return await this.apiCall('/me');
    }

    /**
     * Get all user's playlists (with pagination)
     */
    async getAllPlaylists() {
        const playlists = [];
        let url = '/me/playlists?limit=50';

        while (url) {
            const data = await this.apiCall(url.replace(this.baseUrl, ''));
            playlists.push(...data.items);
            url = data.next ? data.next : null;
        }

        return playlists;
    }

    /**
     * Get playlist tracks (with pagination)
     */
    async getPlaylistTracks(playlistId) {
        const tracks = [];
        let url = `/playlists/${playlistId}/tracks?limit=100`;

        while (url) {
            const data = await this.apiCall(url.replace(this.baseUrl, ''));
            tracks.push(...data.items);
            url = data.next ? data.next : null;
        }

        return tracks;
    }

    /**
     * Download image as blob
     */
    async downloadImage(imageUrl) {
        if (!imageUrl) return null;

        try {
            const response = await fetch(imageUrl);
            if (!response.ok) return null;
            return await response.blob();
        } catch (error) {
            console.error('Failed to download image:', error);
            return null;
        }
    }

    /**
     * Get first track's added_at date for playlist
     */
    async getPlaylistDate(playlistId) {
        try {
            const data = await this.apiCall(`/playlists/${playlistId}/tracks?limit=1`);
            if (data.items && data.items.length > 0 && data.items[0].added_at) {
                return new Date(data.items[0].added_at);
            }
        } catch (error) {
            console.error('Failed to get playlist date:', error);
        }
        return new Date(); // Fallback to today
    }
}
