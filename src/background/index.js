import axios from "axios";

console.log("============this is background b5");

let uid=''

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.order == "createTask") {
    const sendContent = JSON.parse(request.content);
    createTask(sendContent);
    sendResponse("done");
  }else if (request.order == "sendUid") {
    uid=request.content
    console.log('uid',uid);
    sendResponse("get uid");
  }
});

async function createTask(sendContent) {
    const _sendContent=sendContent;
    _sendContent.uid=uid;
  try {
    const { data } = await axios.post("http://47.97.90.169:58999/api/tasks/", _sendContent);
    console.log("createTask", data);
  } catch (err) {
    console.log("获取用户任务列表失败");
  }
}
