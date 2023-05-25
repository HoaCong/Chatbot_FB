const fs = require("fs");
const axios = require("axios");
const { getImage } = require("./helper");

const handleError = (err) => {
  if (err) {
    console.error(err);
    return;
  }
};

module.exports = async (api, event) => {
  try {
    const imageDataUrl = await getImage(event.body);

    api.sendTypingIndicator(event.threadID, handleError);
    api.setMessageReaction(":like:", event.messageID, handleError);

    const { data: imageData } = await axios.get(imageDataUrl, {
      responseType: "stream",
    });

    const uuid = require("uuid").v4();
    const path = `image/${uuid}.png`;

    const fileStream = fs.createWriteStream(path);
    imageData.pipe(fileStream);

    await new Promise((resolve) => {
      const checkExist = setInterval(() => {
        if (fs.existsSync(path)) {
          clearInterval(checkExist);
          resolve();
        }
      }, 1000); // check every 1 second
    });

    api.getThreadInfo(event.threadID, async (err, info) => {
      handleError(err);

      const sender = info.userInfo.find((p) => p.id === event.senderID);
      const senderName = sender.firstName;

      const image = fs.createReadStream(path);

      const img = {
        body: `Ảnh của bạn đây, ${senderName}`,
        attachment: image,
      };

      await new Promise((resolve) => {
        setTimeout(() => {
          api.sendMessage(img, event.threadID, (err) => {
            if (err) {
              console.error(err);
              api.sendMessage("Ấy...Lỗi ảnh mất rồi", event.threadID);

              fs.unlink(path, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
              });
            }
            resolve();
          });
        }, 6000); // add a 6 seconds delay
      });

      fs.unlink(path, handleError);
    });
  } catch (error) {
    console.error(error);
    if (error == "Error: Request failed with status code 400") {
      api.sendMessage("Gửi 1 yêu cầu khác", event.threadID);
    }
  }
};
