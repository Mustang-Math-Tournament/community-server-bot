# potd-bot

The Mustang Math Tournament's Problem of the Day Bot.

## Setup

1. Clone the repo into a folder on your computer.
2. Run `npm install` to install the packages.
3. Create a new file called `config.json`. In it, put an object (`{}`) with:
    * `"token": "PUT YOUR TOKEN HERE"`, replacing the value with the bot token you want to use.
    * `"clientId": "PUT CLIENT ID HERE"`, replacing the value with the bot client ID you want to use.
    * (optional) `"publishGuild": "PUT GUILD HERE"`: allows for simpler publishing of commands to guild.
4. Run `npm run publish` to publish slash commands. (Read the output and then run again with proper arguments.)
5. Run `npm run start` to start up your bot.
