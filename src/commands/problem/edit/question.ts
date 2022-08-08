
// Edit the question of a problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";
import puppeteer from "puppeteer";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getUnfinished(problemId);
    if (!problemObj) {
        let content: string;
        if (getProblem(problemId)) { // already finalized
            content = "This problem is already finalized. Use `/problem unfinish` to unfinalize it.";
        } else {
            content = "No problems exist with this id.";
        }
        await inter.channel?.send({ content });
        return;
    }

    const tex = inter.options.getString("question");
    const html = `
    <html>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
            />
            <style>
            body {
                height: max-content;
                font-size: 40px;
                width: 900px;
                max-width: 900px;
                border: 2px solid white;
                padding: 10px;
                color: white;
            }
            h1 {
                font-family: "Ubuntu";
                margin: 0;
                padding: 0;
            }
            </style>
        </head>
        <body>
            <script type="text/x-mathjax-config">
            MathJax.Hub.Config({
                CommonHTML: { linebreaks: { automatic: true } },
                "HTML-CSS": { linebreaks: { automatic: true } },
                SVG: { linebreaks: { automatic: true } }
            });
            MathJax.Hub.Queue(["Rerender",MathJax.Hub])
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_SVG-full"></script>
            <h1>Problem of the Day</h1>
            <p id="example">
            $$${tex}$$
            </p>
        </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`data:text/html,${html}`);
    const content = await page.$("body");
    await page.waitForTimeout(1000);

    if (content != null) {
        const imageBuffer = await content.screenshot({ omitBackground: true });

        await page.close();
        await browser.close();

        inter.reply({ content: "Mustang Math: Problem of the Day" });

        await inter.channel?.send({
            files: [{
                attachment: imageBuffer,
                name: "problem.png"
            }]
        });
    }
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("question")
    .setDescription("Add or edit the question of a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("question")
        .setDescription("The new text of the question. If not included, the question is erased."));

export const commandQuestion = new Subcommand({
    name: "question",
    exec: exec,
    slash: slash
});
