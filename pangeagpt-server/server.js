const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config.js");
const axios = require("axios");

const PORT = process.env.PORT || 3000;

// Initial messages value
var _messages = [
  {
    role: "system",
    content:
      "As a security updates chatbot. You will be provided with some event data related to security events for the user. The user will ask for an update or a summary. Summarize the event data in 100 words or less and return to the user. Also, provide a recommendation to the user on how to secure their account and device based on what you know from the events",
  },
  {
    role: "assistant",
    content:
      "Hi, you can ask me questions about the security of your confidential data!",
  },
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/botresponse", async (req, res) => {
  const message = req.body;
  var guardianData = await pangea_audit_search("message:denied");
  // Extract all message data
  var extracted = extractedEnvelope(guardianData);
  console.log(JSON.stringify(extracted));
  _messages.push({
    role: "system",
    content: `This is the user's event data to analyze: ${JSON.stringify(
      extracted
    )} `,
  });
  _messages.push({ role: "user", content: message.data });
  var botResponse = await getCompletion(_messages);
  var botMessage = botResponse.data.choices[0].message.content;
  _messages.push({ role: "system", content: botMessage });
  res.status(200).json(botMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function getCompletion(messages) {
  try {
    const resp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.4,
    });
    return resp;
  } catch (err) {
    const failedResponse = {
      data: {
        choices: [
          {
            message: {
              content: "An error occurred. Please try again.",
            },
          },
        ],
      },
    };
    return failedResponse;
  }
}

async function pangea_audit_search(messageFilter) {
  const url = "https://audit.aws.us.pangea.cloud/v1/search";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.audit_api_key}`,
  };

  const body = {
    query: messageFilter,
    limit: 3,
  };

  try {
    const response = await axios.post(url, JSON.stringify(body), { headers });
    //console.log(JSON.stringify(response.data, null, 2));
    return response.data.result.events;
  } catch (error) {
    console.error(error);
    return error;
  }
}

function extractedEnvelope(array) {
  return array.map((obj) => obj.envelope);
}
