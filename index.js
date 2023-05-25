require("dotenv").config();
const fs = require("fs");
const login = require("fb-chat-api");
const { isExist } = require("./functions/helper");
const path = require("path");

// const loginCred = {
//   appState: JSON.parse(
//     fs.readFileSync(path.join(__dirname, "session.json"), "utf-8")
//   ),
// };

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
      expirationDate: 1692761062.350747,
      hostOnly: false,
      httpOnly: true,
      key: "fr",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value:
        "0yh5ExeEcDYpDsprs.AWWVX5JhYzo-tR7BImIBPkl8dog.BkbtTj.Ch.AAA.0.0.BkbtTj.AWWXC49amyY",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1716521063.350719,
      hostOnly: false,
      httpOnly: true,
      key: "xs",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value:
        "9%3ARZPcJllrU8vXNQ%3A2%3A1684946693%3A-1%3A7513%3A%3AAcWtQDtjLVUIbmJEzRhdpyXhRJLUcuOqzF-18pq0sw",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1716521063.350673,
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
        "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1684985066403%2C%22v%22%3A1%7D",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1685157894,
      hostOnly: false,
      httpOnly: false,
      key: "dpr",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: null,
      value: "1",
    },
    {
      domain: ".facebook.com",
      expirationDate: 1719506700.311024,
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
      expirationDate: 1685589863,
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

// let running = false;
// let stopListener = null;

// function startListener(api, event) {
//   try {
//     if (running) {
//       api.sendMessage(`Đang chạy!`, event.threadID);
//       return;
//     }

//     running = true;

//     api.setMessageReaction(":like:", event.messageID, (err) =>
//       console.error(err)
//     );

//     stopListener = api.listenMqtt((err, event) => {
//       if (!running) {
//         return;
//       }

//       if (err) {
//         console.log("listenMqtt error", err);
//         start();
//         return;
//       }

//       api.markAsRead(event.threadID, (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       });

//       if (event.type === "message") {
//         try {
//           if (event.body === "/help") {
//             api.sendMessage(
//               "'COMMANDS'  ``` \n /img '...'- Tạo ảnh tự động \n /ai 'Câu hỏi ...'- Hỏi AI \n /stop - Dừng \n /continue - Tiếp tục```",
//               event.threadID
//             );
//           }
//           if (event.body.includes("/img")) {
//             event.body = event.body.replace("img", "");
//             require("./functions/imghandler")(api, event);
//           } else if (event.body.includes("/ai")) {
//             event.body = event.body.replace("/ai", "");
//             if (event.body.includes("haha")) {
//               api.setMessageReaction(":laughing:", event.messageID, (err) => {
//                 if (err) {
//                   console.error(err);
//                   return;
//                 }
//               });
//             } else if (event.body.includes("love")) {
//               api.setMessageReaction(":love:", event.messageID, (err) => {
//                 if (err) {
//                   console.error(err);
//                   return;
//                 }
//               });
//             }
//             require("./functions/handler.js")(api, event, (err, data) => {
//               console.log(err);
//               console.log(data);
//               if (err) {
//                 api.sendMessage(`Error: ${err}`, event.threadID);
//                 return;
//               }
//             });
//           }
//         } catch (error) {
//           console.log(error);
//           api.sendMessage("Ặc...Xảy ra lỗi rồi", event.threadID);
//         }
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     api.sendMessage("Error: " + error.message, event.threadID);
//   }
// }

// function stopListenerFunc(api, event) {
//   if (!running) {
//     api.sendMessage(`Not running!`, event ? event.threadID : null);
//     return;
//   }
//   running = false;
//   api.sendMessage(`Okay 😢`, event.threadID);
//   let count = 3;
//   const countdown = setInterval(() => {
//     api.sendMessage(`Stopping in ${count} seconds...`, event.threadID);
//     count--;
//     if (count === 0) {
//       clearInterval(countdown);
//       stopListener();
//     }
//   }, 1000);
// }

function handleGroup(api, event) {
  console.log(event);
}
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
        if (event.type === "message") {
          if (!event.isGroup) handleOther(api, event);
          else handleGroup(api, event);
        }
      } catch (err) {
        console.err(err);
      }
    });
  });
}
start();

module.exports = start;
