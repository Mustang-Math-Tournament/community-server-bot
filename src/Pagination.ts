
// pagination stolen from another one of my projects

import Discord from "discord.js";
import nodeCleanup from "node-cleanup";

const emojis = ["⏪","◀️","▶️","⏩"];

interface PaginationOptions {
    displayFunc: (rangeStart: number, rangeEnd: number) => string;
    rangeMin: number;
    rangeMax: number;
    displayAmount?: number;
    startMin?: number;
    startMax?: number;
}

// List of messages with active buttons.
let messageList: Discord.Message[] = [];

class Pagination {
    startMsg: Discord.Message;
    rangeMin: number;
    rangeMax: number;
    displayAmount: number;
    curMin: number;
    curMax: number;
    displayMsg?: Discord.Message;
    emojiRow?: Discord.MessageActionRow;

    constructor(originalMsg: Discord.Message, opts: PaginationOptions) {
        this.startMsg = originalMsg;
        this.display = opts.displayFunc;
        this.rangeMin = opts.rangeMin;
        this.rangeMax = opts.rangeMax;
        this.displayAmount = opts.displayAmount ?? 5;
        this.curMin = opts.startMin ?? this.rangeMin;
        this.curMax = opts.startMax ?? Math.min(this.rangeMin+this.displayAmount-1, this.rangeMax);
        originalMsg.channel.send("Loading...").then(res => {
            this.displayMsg = res;
            this.setupButtons();
            this.updateButtons();
            res.edit({ content: this.display(this.curMin, this.curMax), components: [this.emojiRow!] });
        });
    }

    // this should return the string to update the message with (CHANGE FROM BEFORE)
    display(rangeStart: number, rangeEnd: number) {
        console.log("Display not configured for this pagination!");
        return "Failed to load!";
    }

    // type: 0 = far left, 1 = one left, 2 = one right, 3 = far right
    adjust(type: number) {
        let newMin: number, newMax: number;
        switch (type) {
            case 0:
                newMin = this.rangeMin;
                newMax = Math.min(this.rangeMin+this.displayAmount-1, this.rangeMax);
                break;
            case 1:
                newMin = Math.max(this.rangeMin, this.curMin-this.displayAmount);
                newMax = Math.max(this.rangeMin, this.curMin-1);
                break;
            case 2:
                newMin = Math.min(this.curMax+1, this.rangeMax);
                newMax = Math.min(this.curMax+this.displayAmount, this.rangeMax);
                break;
            case 3:
                let flr = Math.floor((this.rangeMax-this.rangeMin)/this.displayAmount)*this.displayAmount+this.rangeMin; // whew
                newMin = Math.min(flr, this.rangeMax);
                newMax = this.rangeMax;
                break;
            default:
                newMin = this.rangeMin;
                newMax = Math.min(this.rangeMin+this.displayAmount-1, this.rangeMax);
                break;
        }

        this.curMin = newMin;
        this.curMax = newMax;
    }

    setupButtons() {
        const row = new Discord.MessageActionRow();
        emojis.forEach((em, ind) => {
            row.addComponents(
                new Discord.MessageButton()
                    .setCustomId("page"+ind)
                    .setLabel(em)
                    .setStyle("PRIMARY")
            );
        });
        this.emojiRow = row;

        const collector = this.displayMsg!.createMessageComponentCollector({ time: 120000 });
        collector.on("collect", async i => {
            if (!i.isButton()) {
                console.log("Wrong type of interaction");
                return;
            }
            const id = i.customId;
            if (!id.startsWith("page")) {
                console.log("Incorrect button id somehow...");
                return;
            }
            const num = parseInt(id.substring(id.length-1));
            // TODO: check if NaN
            this.adjust(num);
            this.updateButtons();
            i.update({ content: this.display(this.curMin, this.curMax), components: [this.emojiRow!] });
        })

        collector.on("end", coll => {
            this.displayMsg?.edit({ components: [] });
            messageList = messageList.filter(x => x.id !== this.displayMsg?.id);
        })
    }

    updateButtons() {
        if (!this.emojiRow) {
            console.log("Need to create buttons first");
            return;
        }

        const r = this.emojiRow;
        r.components.forEach(c => c.setDisabled(false));
        if (this.curMin <= this.rangeMin) {
            r.components[0].setDisabled(true);
            r.components[1].setDisabled(true);
        }
        if (this.curMax >= this.rangeMax) {
            r.components[2].setDisabled(true);
            r.components[3].setDisabled(true);
        }
    }
}

// Cleanup function to remove on closing.
function removeInteractions() {
    messageList.forEach(msg => msg.edit({ components: [] }));
    console.log("Maybe edited messages");
}

nodeCleanup(removeInteractions);

export default Pagination;