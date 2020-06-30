console.log("============d4");

import $ from "jquery";
import axios from "axios";

import {
  setStorage, //存值
  getStorage, //取值
} from "@/lib";

var page = {
  domInserted: false, //dom是否已插入
  convertTitle:'',    //待转换的文章标题
  convertUrl:'',      //待转换的文章url

  init: function () {
    this.monitorPopup();
    this.initMonitor();
  },

  //监听popup发来的消息：图片地址，询问搜狐id
  monitorPopup: function () {
    var that=this;
    window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("request", request);
      if (request.action == "isConvertable") {
        const convertObj = this.getConvertObj();
        console.log("convertObj", convertObj);
        sendResponse(JSON.stringify(convertObj));
      }
    });
  },
  getConvertObj() {
    return {
      isConvertable: location.host == "mp.weixin.qq.com",
      convertTitle: location.host == "mp.weixin.qq.com"?$("#activity-name").html().trim():'',
      convertUrl: location.href,
    };
  },

  //发现来到抖音就弹全屏确认
  initMonitor() {
    if (location.host == "creator.douyin.com") {
      getStorage({ convertTitle:'',convertUrl:'' }, (data) => {
        console.log('data',data);
        this.convertTitle=data.convertTitle
        this.convertUrl=data.convertUrl

        if(this.convertTitle==''){
          return
        }
        const monitorHandle=window.setInterval(() => {
          this.monitLogin(() => {
            if (!this.domInserted) {
              this.domInserted = true;
              this.insertHintDom();
              this.hintDomBindEvent();
              clearInterval(monitorHandle)
            }
          });
        }, 1500);
      });
    }
  },
  //监听登录
  monitLogin(callback) {
    if ($(".semi-avatar").length > 0) {
      callback();
    }
  },
  insertHintDom: function () {
    const html =
      '<div id="dataMarketModal" class="data_market_modal">' +
      '      <div class="data_market_modal_title">检测到您已登录<br>是否将《'+this.convertTitle+'》转为视频发布？</div>' +
      '      <span id="dataMarketModalYes">Yes</span><span id="dataMarketModalNo">No</span>' +
      "    </div>";
    const css =
      '<style id="dataMarketCss">.data_market_modal{ position: fixed; left: 0; top: 0; width: 100%; bottom: 0; z-index: 99999; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,.3);} .data_market_modal .data_market_modal_title{ font-size: 28px; text-align:center; margin-bottom: 30px;} .data_market_modal span{ display: inline-block; padding: 10px 33px; font-size: 24px; background: #000; color: #fff; border-radius: 5px; margin-bottom: 15px; cursor: pointer;} .data_market_modal span:hover{ background: #333;} @supports (backdrop-filter: blur(6px)) or (-webkit-backdrop-filter: blur(6px)) { .data_market_modal{ background: rgba(238,240,247,0.3); backdrop-filter:blur(6px); } }</style>';
    $("body").append(html);
    $("body").append(css);
  },
  hintDomBindEvent: function () {
    $("#dataMarketModalYes").click(()=> {
      this.createTask()
      this.hideModal();
    });
    $("#dataMarketModalNo").click(() => {
      this.hideModal();
    });
  },
  hideModal: function () {
    $("#dataMarketModal").css({
      display: "none",
    });
  },
  createTask(){
    const sendContent={
      convertUrl:this.convertUrl,
      convertTitle:this.convertTitle,
      douYinUrl:location.href
    }
    chrome.runtime.sendMessage(
      { order: "createTask", content: JSON.stringify(sendContent) },
      function(response) {
        console.log(response);
        this.convertTitle=''
        setStorage({ 
          convertTitle:''
         });
      }
    );
  }
};

page.init();
