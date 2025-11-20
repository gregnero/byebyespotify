#!/usr/bin/env python3
"""
Spotify Playlist Exporter (Final Robust Version)
Exports all playlists into directories with tracks.csv, cover.jpg, description.txt.
Folders separated into "My Playlists" and "Other Playlists".
Folder names start with date (first track's added_at) and preserve spaces & common special characters.
All folders are zipped at the end.
Default export location: current working directory.
"""

import os
import sys
import time
import zipfile
import shutil
import subprocess
import importlib.util
import re
from datetime import datetime

# ------------------------------
# AUTO-INSTALL DEPENDENCIES
# ------------------------------
REQUIRED_PACKAGES = ["spotipy", "requests", "pandas"]

def install_package(pkg):
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

def ensure_dependencies():
    for pkg in REQUIRED_PACKAGES:
        if importlib.util.find_spec(pkg) is None:
            print(f"Installing missing package: {pkg} ...")
            install_package(pkg)

ensure_dependencies()

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import requests
import pandas as pd

# ------------------------------
# PROGRESS BAR
# ------------------------------
def progress_bar(current, total, bar_length=30, prefix=""):
    fraction = current / max(total,1)
    filled = int(bar_length * fraction)
    bar = "#" * filled + "-" * (bar_length - filled)
    print(f"\r{prefix}[{bar}] {int(fraction*100)}%", end="", flush=True)

# ------------------------------
# SAFE FILENAME
# ------------------------------
def safe_filename(name):
    """
    Allow spaces and common special characters, but replace filesystem-invalid ones
    """
    if not name:
        name = "untitled"
    return re.sub(r'[<>:"/\\|?*]', '_', name.strip())

# ------------------------------
# ZIP FUNCTION
# ------------------------------
def zip_directory(folder_path, output_zip):
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, folder_path)
                zipf.write(full_path, arcname)

# ------------------------------
# MAIN EXPORT LOGIC
# ------------------------------
def export_playlists(client_id, client_secret, redirect_uri, output_root):

    scope = "playlist-read-private playlist-read-collaborative"

    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        open_browser=True
    ))

    print("\nAuthenticated with Spotify. Retrieving playlists...")

    playlists = []
    results = sp.current_user_playlists(limit=50)
    while results:
        playlists += results['items']
        if results.get("next"):
            results = sp.next(results)
        else:
            break

    print(f"Found {len(playlists)} playlists.\n")
    start_time = time.time()
    total_playlists = len(playlists)

    me = sp.current_user()['id']

    export_folder = os.path.join(output_root, "spotify_export_temp")
    os.makedirs(export_folder, exist_ok=True)

    my_folder = os.path.join(export_folder, "My Playlists")
    other_folder = os.path.join(export_folder, "Other Playlists")
    os.makedirs(my_folder, exist_ok=True)
    os.makedirs(other_folder, exist_ok=True)

    unnamed_counter = 1

    for idx, p in enumerate(playlists, start=1):
        owner_id = p.get("owner", {}).get("id", "")
        base = my_folder if owner_id == me else other_folder

        # --- Determine playlist folder date prefix ---
        date_prefix = datetime.today().strftime("%Y-%m-%d")  # default
        results = sp.playlist_items(p.get("id"), limit=1)
        if results.get("items"):
            first_added = results["items"][0].get("added_at")
            if first_added:
                try:
                    date_prefix = datetime.fromisoformat(first_added.replace("Z", "+00:00")).strftime("%Y-%m-%d")
                except:
                    pass

        # Playlist folder name
        name = p.get("name") or f"Unnamed Playlist {unnamed_counter}"
        if not p.get("name"):
            unnamed_counter += 1
        name = safe_filename(name)
        playlist_folder = os.path.join(base, f"{date_prefix} - {name}")
        os.makedirs(playlist_folder, exist_ok=True)

        # Save description
        desc = p.get("description") or ""
        with open(os.path.join(playlist_folder, "description.txt"), "w", encoding="utf-8") as f:
            f.write(desc)

        # Save playlist cover image
        images = p.get("images") or []
        if images:
            try:
                img_url = images[0].get("url")
                if img_url:
                    img = requests.get(img_url, timeout=10)
                    with open(os.path.join(playlist_folder, "cover.jpg"), "wb") as f:
                        f.write(img.content)
            except:
                pass

        # Export tracks
        tracks = []
        results = sp.playlist_tracks(p.get("id"), limit=100)
        while True:
            for item in results.get("items", []):
                t = item.get("track")
                if not t:
                    continue
                artists_list = t.get("artists") or []
                artists = ", ".join([str(a.get("name") or "") for a in artists_list if a])
                tracks.append({
                    "Track Name": t.get("name") or "",
                    "Artists": artists,
                    "Album": t.get("album", {}).get("name") or "",
                    "Release Date": t.get("album", {}).get("release_date") or "",
                    "Duration (ms)": t.get("duration_ms") or 0,
                    "Popularity": t.get("popularity") or 0,
                    "Added At": item.get("added_at") or "",
                    "Track URL": t.get("external_urls", {}).get("spotify") or ""
                })
            if results.get("next"):
                results = sp.next(results)
            else:
                break

        df = pd.DataFrame(tracks)
        df.to_csv(os.path.join(playlist_folder, "tracks.csv"), index=False, encoding="utf-8")

        progress_bar(idx, total_playlists, prefix="Exporting playlists: ")

    # ZIP all exported folders
    zip_date = time.strftime("%Y-%m-%d")
    zip_name = os.path.join(output_root, f"spotify_export_{zip_date}.zip")


    zip_directory(export_folder, zip_name)

    # Cleanup temp folder
    shutil.rmtree(export_folder)

    # Final stats
    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)

    print("\n\n======================================")
    print("🎉 EXPORT COMPLETE!")
    print("======================================")
    print(f"Total playlists exported: {total_playlists}")
    print(f"Total time elapsed: {minutes}m {seconds}s")
    print(f"ZIP file created: {zip_name}")
    print("======================================\n")

# ------------------------------
# SCRIPT ENTRY
# ------------------------------
if __name__ == "__main__":
    print("\n=== Spotify Playlist Export Tool ===")
    client_id = input("Enter your Spotify Client ID: ").strip()
    client_secret = input("Enter your Spotify Client Secret: ").strip()
    redirect_uri = input("Enter your Redirect URI: ").strip()

    # Export to current working directory
    output_root = os.getcwd()
    print(f"\nExporting playlists to current directory: {output_root}\n")
    export_playlists(client_id, client_secret, redirect_uri, output_root)

