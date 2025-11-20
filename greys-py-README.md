# Bye Bye Spotify ! <3
You've worked so hard on your playlists. Carefully choosing cover pictures, writing angsty and deep descriptions with the hope that ur crush will see them and fall in love with you and run away with you into the Italian countryside ... no? Just me? Awkward...

Whatever the case, the playlist in its entirety is an art form. The cover image and the description are critically important to the integrity and personality of the playlist. Here is a way that you can export all of these things.

This lets you archive and export all of your playlists with a single python script. This way, you can ditch Spotify and rest easy knowing that all of your hard work making playlists will be around in your personal files long after you're gone.

I've tried to make this process as simple as possible but I'm not an app developer so there's lots of room for improvement but this should work fine for now. It would be cool to have a website that does this or a nice app, but a single executable python script seems like a managable place to start. I also tried getting this to run in Google Collab but had some issues... Anyways, let's get started.

# Step 1: Create a Spotify App
The purpose of this step is to create a pipeline by which our code can talk to your Spotify library. This isn't as tricky as it sounds. Go here: https://developer.spotify.com/dashboard and then hit "Create app" . Fill in the following fields:
* App name: this can be whatever. I'd suggest "byespotify"
* App description: this can also be whatever.
* Redirect URI: put in: http://127.0.0.1:8888/callback. Make sure you hit "Add"
* Check "understand and agree" box.
* Hit "Save"

Congrats, you've made the app!

On the app page, there will be three crucial pieces of information you need, which you can copy and paste:

* The Client ID
* The Client secret
* The Redirect URI

Hold on to these for later.

# Step 2: Install Software to Run Python on Your Compooper
This entire process revolves around you being able to run a .py file on your computer. This also isn't as tricky as it sounds and there's tons of support online for this. If you already know how to do this feel free to just grab the .py file here and run that thang. But, if you aren't comfy with that, that's totally okay, and we'll work through it here. 

[ work through it here ]


# Step 3: Run export_playlists.py
Once you've gotten Python up and running, just head to a terminal and run "python export_playlists.py" and it should take it from there. The script will guide you through what to do.

# Step 4: Take a Look
To make sure everything looks okay. Then, unsubscribe from Spotify, uninstall it, and move on to some other music platforms.

# Step 5: Moving On
I've been exploring music in the digital world on:
* Bandcamp
* NTS Radio

And other places like:
* The radio
* Live shows
* Physical media (vinyls, casettes)

I encourage you to check out any platforms that aren't actively supporting the fascist regime and platforms that compensate their musicians fairly. <3


--------

I used ChatGPT to write this script. I typically try to avoid using LLMs right now but this seemed like a justifiable reason to use it. 
