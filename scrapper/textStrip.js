const textStrip = async (text) => {
  return await text
    .trim()
    .replaceAll(/[\s]{2,}|(\[\d+\])/gm, "")
    .replaceAll("\n", " ")
    .replaceAll(/[\.]{2,}/gm, ".");
};

module.exports = textStrip;
