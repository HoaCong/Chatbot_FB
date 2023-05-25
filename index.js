require("dotenv").config();
const fs = require("fs");
const login = require("fb-chat-api");
const { isExist } = require("./functions/helper");
const path = require("path");

const loginCred = {
  appState: JSON.parse(
    fs.readFileSync(path.join(__dirname, "session.json"), "utf-8")
  ),
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
