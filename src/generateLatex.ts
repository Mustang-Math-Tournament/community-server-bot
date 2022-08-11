import puppeteer from "puppeteer";

export async function generateLatex(question: string, answer: string, attachment: any) {
    let html = `
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
            <p><strong>Question:</strong></p>
            <p id="example">
            $$${question}$$
            </p>
    `;

    if (answer != "") {
        html += `
            <p><strong>Answer:</strong></p>
            <p id="example">
            $$${answer}$$
            </p>
        `;
    }

    if (attachment != null) {
        html += `
            <img src=${attachment} />
        `;
    }

    html += "</body></html>";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`data:text/html,${html}`);
    const content = await page.$("body");
    await page.waitForTimeout(1000);

    if (content != null) {
        const imageBuffer = await content.screenshot({ omitBackground: true });

        await page.close();
        await browser.close();

        return imageBuffer;
    }

    return "";
}
