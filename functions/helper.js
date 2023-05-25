const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "1024x1024",
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
  }
};

const getChat = async (historyMessages = [], text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Your name is Wuju, created by Hát.ò.a",
        },
        ...historyMessages,
        { role: "user", content: text },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};

const isExist = (str, arr) => arr.some((element) => str.includes(element));

module.exports = { openai, getImage, getChat, isExist };
