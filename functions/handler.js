const { getChat } = require("./helper");

async function loadNextThreadHistory(api, event, chatHistory, timestamp) {
  const messagesPerPage = 50;
  const maxMessages = 10;

  let messagesLeftToCollect = maxMessages - chatHistory.length;

  while (messagesLeftToCollect > 0) {
    const pageSize = Math.min(messagesPerPage, messagesLeftToCollect);

    const history = await api.getThreadHistory(
      event.threadID,
      pageSize,
      timestamp
    );

    if (history.length === 0) {
      console.log("No messages found in history");
      break;
    }

    const filteredHistory = history.filter(
      (message) => message.type === "message"
    );

    chatHistory.push(...filteredHistory);

    timestamp = filteredHistory[filteredHistory.length - 1].timestamp;

    messagesLeftToCollect -= filteredHistory.length;
  }

  return chatHistory; // return the chatHistory array after it has been modified
}
// export function
module.exports = async (api, event) => {
  try {
    // Initialize an empty chatHistory array
    const chatHistory = [];

    // Call loadNextThreadHistory function to retrieve chat history messages and get the modified chatHistory array
    const modifiedChatHistory = await loadNextThreadHistory(
      api,
      event,
      chatHistory
    );

    // Create an array of message objects to feed into the API as historyMessages
    const historyMessages = modifiedChatHistory.map((message) => ({
      role: message.senderID === "100009493838168" ? "assistant" : "user",
      content: message.body.replace("/ai", ""),
    }));

    // get response from OpenAI API
    const response = await getChat(historyMessages, event.body);

    // get thread info from Facebook Messenger API
    api.getThreadInfo(event.threadID, (err, info) => {
      if (err) {
        console.error(err);
        return;
      }

      // get sender info
      const sender = info.userInfo.find((p) => p.id === event.senderID);
      const senderName = sender.firstName;
      const senderBday = sender.isBirthday;

      // send message based on sender info and OpenAI response
      if (senderBday) {
        api.sendMessage(
          {
            body: `Happy Birthday @${senderName}!`,
            mentions: [{ tag: `@${senderName}`, id: event.senderID }],
          },
          event.threadID
        );
      } else {
        api.sendMessage(
          {
            body: `${response}`,
            mentions: [{ tag: `@${senderName}`, id: event.senderID }],
          },
          event.threadID
        );
      }
    });
  } catch (error) {
    console.error(error.message);
    api.sendMessage("Ặc...Tự nhiên không biết nói gì :v", event.threadID);
  }
};
