import mjAPI from "mathjax-node-svg2png";

mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  },
});
mjAPI.start();

const typesetColour = "white";

export const typeset = async (tex) => {
  return await new Promise(async (resolve, reject) => {
    const texSplit = tex.split(" ");
    const texSpace = texSplit.join("\n");

    const options = {
      math: `\\color{${typesetColour}}{${texSpace}}`,
      format: "TeX",
      png: true,
      processEscapes: false,
    };

    await mjAPI.typeset(options, async (result) => {
      if (!result.errors) {
        const pngString = await result.png.replace(
            /^data:image\/png;base64,/,
            ""
          ),
          image = Buffer.from(pngString, "base64");

        resolve(image);
      } else {
        reject(result.errors);
      }
    });
  });
};
