import axios from "axios";

console.log("============this is background b7");

let uid = "";

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.order == "createTask") {
    const sendContent = JSON.parse(request.content);
    createTask(sendContent);
    sendResponse("done");
  } else if (request.order == "sendUid") {
    uid = request.content;
    sendResponse("get uid");
  }
});

async function createTask(sendContent) {
  try {
    const { data } = await axios.post("http://47.97.90.169:58999/api/tasks/", {
      title: sendContent.convertTitle,
      url: sendContent.convertUrl,
      cookies: sendContent.cookies,
      uid: uid,
    });
    console.log("createTask", data);

    let message = data.code == 200 ? "任务创建成功" : "任务创建失败";
    chrome.notifications.create(null, {
      type: "basic",
      iconUrl: "assets/icons/icon_144.png",
      title: "文章一键转抖音",
      message: message,
    });
  } catch (err) {
    chrome.notifications.create(null, {
      type: "basic",
      iconUrl: "assets/icons/icon_144.png",
      title: "文章一键转抖音",
      message: "接口错误",
    });
  }
}
