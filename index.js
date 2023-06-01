require("dotenv").config();
const login = require("fb-chat-api");
const session = require("./session.json");
const { isExist } = require("./functions/helper");
const loginCred = {
  appState: [
    {
      domain: ".facebook.com",
      expirationDate: 1719506690.543207,
      hostOnly: false,
      httpOnly: true,
      key: "datr",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value: "Q63rYOmMl-J_iaA8U7xEzTV-",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1693367356.215403,
      hostOnly: false,
      httpOnly: true,
      key: "fr",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value:
        "0IxGGXNhkUVJmYyze.AWUR7n5uw85_Jv1SFVwPVZQKpvU.BkeBRs.Ch.AAA.0.0.BkeBU3.AWUDMRXQXwo",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1717127353.612014,
      hostOnly: false,
      httpOnly: true,
      key: "xs",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value: "26%3AfOdAo9kQ6ky9vQ%3A2%3A1685591348%3A-1%3A7513",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1717127353.612005,
      hostOnly: false,
      httpOnly: false,
      key: "c_user",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value: "100009493838168",
    },
    {
      domain: ".facebook.com",
      hostOnly: false,
      httpOnly: false,
      key: "presence",
      path: "/",
      sameSite: null,
      secure: true,
      session: true,
      storeId: null,
      value:
        "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1685591363507%2C%22v%22%3A1%7D",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1720151356.611955,
      hostOnly: false,
      httpOnly: true,
      key: "sb",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value: "Q63rYFfnbgixBtI562d7Eit7",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1686196159,
      hostOnly: false,
      httpOnly: false,
      key: "wd",
      path: "/",
      sameSite: "lax",
      secure: true,
      session: false,
      storeId: null,
      value: "1920x929",
    },
  ],
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
