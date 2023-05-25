require("dotenv").config();
const login = require("fb-chat-api");
const session = require("./session.json");
const { isExist } = require("./functions/helper");
const loginCred = {
  appState: session,
};

function handleOther(api, event) {
  try {
    if (event.body === "/help") {
      api.sendMessage(
        "'COMMANDS'  ``` \n /img '...'- Tạo ảnh tự động \n /ai 'Câu hỏi ...'- Hỏi AI \n /stop - Dừng \n /continue - Tiếp tục```",
        event.threadID
      );
    }
    if (event.body.includes("/img")) {
      event.body = event.body.replace("img", "");
      require("./functions/imghandler")(api, event);
    } else {
      if (isExist(event.body, ["haha", "vui", "hài", "hài ds"])) {
        api.setMessageReaction(":laughing:", event.messageID, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
      if (isExist(event.body, ["cảm ơn", "yêu", "ngủ ngon", "g9"])) {
        api.setMessageReaction(":love:", event.messageID, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
      require("./functions/handler.js")(api, event, (err, data) => {
        console.log(err);
        console.log(data);
        if (err) {
          api.sendMessage(`Error: ${err}`, event.threadID);
          return;
        }
      });
    }
  } catch (error) {
    console.log(error);
    api.sendMessage("Ặc...Xảy ra lỗi rồi", event.threadID);
  }
}

function start() {
  login(loginCred, (err, api) => {
    if (err) {
      console.error("login cred error", err);
      return;
    }
    api.listen((err, event) => {
      try {
        if (err) {
          console.error("listen error:", err);
          start();
          return;
        }
        if (event.type === "message" && !event.isGroup) {
          handleOther(api, event);
        }
      } catch (err) {
        console.err(err);
      }
    });
  });
}
start();
