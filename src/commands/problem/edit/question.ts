
// Edit the question of a problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";
import puppeteer from "puppeteer";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    inter.reply({ content: "Processing..." });

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

    // const tex = inter.options.getString("question");
    const html = `
    <html>
        <head>
            <style>
                body {
                    height: max-content;
                    color: white;
                    font-size: 40px;
                    width: 900px;
                    max-width: 900px; border: solid;
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
            window.addEventListener('resize', MJrerender);
            function MJrerender(){
            MathJax.Hub.Queue(["Rerender",MathJax.Hub])
            };
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_SVG-full"></script>

        <h1>Problem Of The Day</h1>
        <p id="example">$$a_1 + a_2 + a_3 + a_4 + a_5 + a_6 + a_7 + a_8 + a_9 + a_{10} + a_{11} + a_{12} + a_{13} + a_{14} + a_{15} + a_{16} + a_{17} + a_{18} + a_{19} + a_{20}$$</p>
        </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.waitForTimeout(1000);

    await page.goto(`data:text/html,${html}`);
    const content = await page.$("body");
    await page.waitForTimeout(1000);

    if (content != null) {
        const imageBuffer = await content.screenshot({ omitBackground: true });

        await page.close();
        await browser.close();

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
