
// Edit the question of a problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";
import katex from "katex";
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
        await inter.reply({ content, ephemeral: true });
        return;
    }

    const tex = inter.options.getString("question");
    const htmlLatex = katex.renderToString(tex ?? "", {
        throwOnError: false,
        output: "html"
    });

    const html = `
    <html>
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">

            <!-- The loading of KaTeX is deferred to speed up page rendering -->
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js" integrity="sha384-X/XCfMm41VSsqRNQgDerQczD69XqmjOOOwYQvr/uuC+j4OPoNhVgjdGFwhvN02Ja" crossorigin="anonymous"></script>

            <!-- To automatically render math in text elements, include the auto-render extension: -->
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
                onload="renderMathInElement(document.body);"></script>

            <style>
                body {
                    height: max-content;
                    color: white;
                    font-size: 30px;
                }
                
                .katex-display > .katex { white-space: pre; }
                .katex-display > .base { margin: 0.25em 0; }
                .katex-display { margin: 0.5em 0; }

                .katex-display .katex !important {
                    white-space: inherit;
                }
            </style>
        </head>

        <body>
        ${htmlLatex}
        </body>
    </html>
    `;

    console.log(htmlLatex);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const content = await page.$("body");
    if (content != null) {
        const imageBuffer = await content.screenshot({ omitBackground: true });

        await page.close();
        await browser.close();

        await inter.reply({
            files: [{
                attachment: imageBuffer,
                name: "problem.png"
            }]
        });
    }

     /* await typeset(tex).then(async (image: any) => {
        await inter.reply({
            files: [{
                attachment: image,
                name: "problem.png"
            }]
        });
    }).catch(async (err: any) => {
        await inter.reply(err);
    });

   const newQuestion = inter.options.getString("question");
    if (!newQuestion) {
        const oldQuestion = problemObj.question;
        problemObj.question = "";
        const readQuestion = oldQuestion ? `:\n${oldQuestion}` : " blank.";
        await inter.reply(`Problem ${problemId}'s question was erased. It previously was${readQuestion}`);
    } else {
        problemObj.question = newQuestion;
        await inter.reply(`Problem ${problemId}'s question was updated to:\n${newQuestion}`);
    }*/
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
