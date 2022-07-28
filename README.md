# community-server-bot

The Mustang Math's Community Server Bot. Make sure to **check out a new branch** in the GitHub and commit all code to
that branch, create pull requests when you're ready for a quality check.

Make a new version in `changelog.md`, adding 0.1 to the prior version for patches, modifications, or minor updates. 
Add 1 to the prior version for brand new features, overhauls, or other large updates. 
Keep notes of all your contributions there.

Be diligent with comments in your code: the more helpful/descriptive comments you write, the better.

## Setup

1. Clone the repo into a folder on your computer.
2. Run `npm install` to install the packages.
3. Create a new file called `config.json`. In it, put an object (`{}`) with:
    * `"token": "PUT YOUR TOKEN HERE"`, replacing the value with the bot token you want to use.
    * `"clientId": "PUT CLIENT ID HERE"`, replacing the value with the bot client ID you want to use.
    * (optional) `"publishGuild": "PUT GUILD HERE"`: allows for simpler publishing of commands to guild.
4. Run `npm run publish` to publish slash commands. (Read the output and then run again with proper arguments.)
5. Run `npm run start` to start up your bot.

*Note:* Set up your own test bot and testing server, use that token + client ID when you locally run / debug code.
