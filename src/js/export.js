/**
 * Playlist Export Functionality
 * Handles exporting playlists to various formats
 */

class PlaylistExporter {
    constructor(spotifyAPI) {
        this.api = spotifyAPI;
    }

    /**
     * Safe filename creation
     */
    safeFilename(name) {
        if (!name || name.trim() === '') {
            return 'untitled';
        }
        // Replace filesystem-invalid characters
        return name.trim().replace(/[<>:"/\\|?*]/g, '_');
    }

    /**
     * Format date as YYYY-MM-DD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Create CSV content from tracks
     */
    createCSV(tracks) {
        const headers = [
            'Track Name',
            'Artists',
            'Album',
            'Release Date',
            'Duration (ms)',
            'Popularity',
            'ISRC',
            'Added At',
            'Track URL'
        ];

        const rows = tracks.map(item => {
            const track = item.track;
            if (!track) return null;

            const artists = track.artists ? track.artists.map(a => a.name || '').join(', ') : '';
            const album = track.album ? track.album.name || '' : '';
            const releaseDate = track.album ? track.album.release_date || '' : '';
            const duration = track.duration_ms || 0;
            const popularity = track.popularity || 0;
            const isrc = track.external_ids?.isrc || '';
            const addedAt = item.added_at || '';
            const trackUrl = track.external_urls?.spotify || '';

            return [
                this.escapeCSV(track.name || ''),
                this.escapeCSV(artists),
                this.escapeCSV(album),
                releaseDate,
                duration,
                popularity,
                isrc,
                addedAt,
                trackUrl
            ].join(',');
        }).filter(row => row !== null);

        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Escape CSV values
     */
    escapeCSV(value) {
        if (typeof value !== 'string') return value;
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }

    /**
     * Create M3U playlist content
     */
    createM3U(tracks, playlistName) {
        let content = '#EXTM3U\n';
        content += `#PLAYLIST:${playlistName}\n\n`;

        tracks.forEach(item => {
            const track = item.track;
            if (!track) return;

            const artists = track.artists ? track.artists.map(a => a.name || '').join(', ') : '';
            const duration = track.duration_ms ? Math.floor(track.duration_ms / 1000) : 0;
            const title = track.name || 'Unknown Track';
            const url = track.external_urls?.spotify || '';

            content += `#EXTINF:${duration},${artists} - ${title}\n`;
            content += `${url}\n\n`;
        });

        return content;
    }

    /**
     * Create description text file content
     */
    createDescription(description) {
        return description || '';
    }

    /**
     * Export all playlists
     */
    async exportAllPlaylists(onProgress) {
        const currentUser = await this.api.getCurrentUser();
        const userId = currentUser.id;

        onProgress('Fetching playlists...', 0);
        const playlists = await this.api.getAllPlaylists();

        if (playlists.length === 0) {
            throw new Error('No playlists found');
        }

        const totalPlaylists = playlists.length;
        const exportData = {
            myPlaylists: [],
            otherPlaylists: []
        };

        let unnamedCounter = 1;

        for (let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];
            const progress = Math.floor(((i + 1) / totalPlaylists) * 100);
            onProgress(`Exporting playlist ${i + 1} of ${totalPlaylists}...`, progress);

            try {
                // Determine if this is user's playlist or not
                const isMyPlaylist = playlist.owner?.id === userId;

                // Get playlist date
                const playlistDate = await this.api.getPlaylistDate(playlist.id);
                const datePrefix = this.formatDate(playlistDate);

                // Get playlist name
                let playlistName = playlist.name || `Unnamed Playlist ${unnamedCounter}`;
                if (!playlist.name) {
                    unnamedCounter++;
                }
                const safeName = this.safeFilename(playlistName);
                const folderName = `${datePrefix} - ${safeName}`;

                // Get tracks
                const trackItems = await this.api.getPlaylistTracks(playlist.id);

                // Get cover image
                let coverBlob = null;
                if (playlist.images && playlist.images.length > 0) {
                    coverBlob = await this.api.downloadImage(playlist.images[0].url);
                }

                // Create export data
                const playlistData = {
                    folderName: folderName,
                    name: playlistName,
                    description: this.createDescription(playlist.description),
                    coverBlob: coverBlob,
                    csv: this.createCSV(trackItems),
                    m3u: this.createM3U(trackItems, playlistName),
                    trackCount: trackItems.length
                };

                // Add to appropriate category
                if (isMyPlaylist) {
                    exportData.myPlaylists.push(playlistData);
                } else {
                    exportData.otherPlaylists.push(playlistData);
                }

            } catch (error) {
                console.error(`Error exporting playlist ${playlist.name}:`, error);
                // Continue with other playlists
            }
        }

        onProgress('Creating ZIP file...', 100);
        return exportData;
    }

    /**
     * Create ZIP file from export data
     */
    async createZIP(exportData) {
        // We'll use JSZip library for this
        // For now, return the export data structure
        // The actual ZIP creation will be handled by app.js using JSZip
        return exportData;
    }
}
