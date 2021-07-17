const axios = require("axios").default;

const summarizerApi = axios.create({
  baseURL: process.env.SUMMARIZER_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

async function summarizeText(text, ratio = "40") {
  const response = await summarizerApi.post("process_text/", {
    params: [
      {
        text: text,
        ratio: ratio,
      },
    ],
  });
  return response.data[0];
}

module.exports = summarizeText;
