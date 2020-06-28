export function notification(id, options) {
  chrome.notifications.create(id, options);
}

/**
 * @description: 存储storage
 * @param {type}
 * @return:
 */
export function setStorage(obj, fn) {
  chrome.storage.sync.set(obj, fn);
}

/**
 * @description: 获取storage(obj可设置默认值)
 * @param {
 *  obj: {color: 'red', age: 18}
 * }
 * @return:
 */
export function getStorage(obj, fn) {
  chrome.storage.sync.get(obj, fn);
}

/**
 * @description: 发送信息给当前页面的conten.js
 * @param {type}
 * @return:
 */
export function sendMessageToContentScript(message, callback) {
  window.chrome.tabs.query(
    {
      active: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        window.chrome.tabs.sendMessage(tab.id, message, function(response) {
          if (callback) callback(response);
        });
      });
    }
  );
}

export function clipboardWrite(text) {
  const copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.focus();
  document.execCommand("SelectAll");
  document.execCommand("Copy");
  copyFrom.style.visibility = "hidden";
  copyFrom.style.position = "absolute";
  copyFrom.style.left = "-9999px";
}

export function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}



let timeout = null;
export function debounce(fn, wait) {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, wait);
}


//带格式复制到剪贴板，模拟人手选择复制
export function selectById(id) {
  const target = document.getElementById(id);
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("Copy", "false", null);
  selection.removeAllRanges();
}

export function sendMsg2ActiveTab(message, callback) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, callback);
    }
  );
}


String.prototype.isHave = function(distArr) {
  var isFound = false;
  for (var i = 0; i < distArr.length; i++) {
    if ((this + "").indexOf(distArr[i]) > -1) {
      isFound = true;
      break;
    }
  }
  return isFound;
};
String.prototype.replaceAll=function(f,e){//吧f替换成e
  var reg=new RegExp(f,"g"); //创建正则RegExp对象   
  return this.replace(reg,e); 
}

