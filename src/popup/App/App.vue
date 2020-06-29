<template>
  <div id="app">
    <div class="loading" v-if="loadingTask">正在拉取任务...</div>
    <ul class="tast_list" v-if="!loadingTask">
      <li class="li_title">
        <div class="t1">文章</div>
        <div class="t2">状态</div>
      </li>
      <li v-for="(item, index) in taskList" :key="index">
        <div class="t1">{{ item.title }}</div>
        <div :class="['t2', item.statusClass]">{{ item.statusTxt }}</div>
      </li>
    </ul>

    <div class="btn_start_job" v-if="isConvertable" @click="saveJumpDouYin">
      <span>将当前文章转视频发抖音</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import {
  sleep, //延时，setTimeout的异步写法
  setStorage, //存值
  getStorage, //取值
  debounce, //防抖
  sendMsg2ActiveTab, //和content通讯
} from "@/lib";
import Fingerprint2 from "fingerprintjs2";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      loading: null, //全局loading
      loadingTask:true, //默认就在拉用户任务列表
      isConnectedToContent: false, //默认未关联到content
      isConvertable: false, //默认是不可转换的文章
      convertTitle: "", //转换文章的标题
      convertUrl: "", //转换文章的链接
      uid: "", //从pop传过来的uid
      taskList: [], //用户的任务列表
    };
  },

  methods: {
    getFingerprint(callback) {
      requestIdleCallback(function () {
        var options = { userDefinedFonts: ["Nimbus Mono", "Junicode", "Presto"] };
        Fingerprint2.get(options, function (components) {
          var values = components.map(function (component) {
            return component.value;
          });
          var murmur = Fingerprint2.x64hash128(values.join(""), 31);
          callback(murmur);
        });
      });
    },
    checkIsConvertable() {
      sendMsg2ActiveTab(
        {
          action: "isConvertable",
        },
        (response) => {
          if (response) {
            this.isConnectedToContent = true;
            const obj = JSON.parse(response);
            this.isConvertable = obj.isConvertable;
            this.convertTitle = obj.convertTitle;
            this.convertUrl = obj.convertUrl;
          }
        }
      );
    },
    async getUserTaskList(uid) {
      try {
        const { data } = await axios.get("http://47.97.90.169:58999/api/tasks/?uid=" + uid);
        this.loadingTask=false;
        this.taskList = data.data;
        console.log("this.taskList", this.taskList);
        this.taskList.map((item) => {
          item.statusTxt = this.getStatusTxt(item.task_status);
          item.statusClass = this.getStatusClass(item.task_status);
        });
      } catch (err) {
        this.$message.error("获取用户任务列表失败");
      }
    },
    getStatusTxt(status) {
      const statusObj = {
        0: "正在生成视频...",
        1: "正在发布抖音...",
        2: "发布成功...",
      };
      return statusObj[status];
    },
    getStatusClass(status) {
      const statusObj = {
        0: "progress1",
        1: "progress2",
        2: "progress3",
      };
      return statusObj[status];
    },
    async saveJumpDouYin() {
      setStorage({
        convertTitle: this.convertTitle,
        convertUrl: this.convertUrl,
      });
      this.loading = this.$loading({
        fullscreen: true,
        text: "即将跳转抖音，登录后即可自动发布",
      });
      await sleep(2000);
      this.loading.close();
      window.open("https://creator.douyin.com/");
    },
  },

  mounted() {
    //设置axios超时时间
    axios.defaults.timeout = 10000;

    //获取当前用户唯一指纹id
    this.getFingerprint((uid) => {
      //拉取用户任务列表
      this.getUserTaskList(uid);

      chrome.runtime.sendMessage({ order: "sendUid", content: uid }, function (response) {
        console.log(response);
      });
    });

    //检查当前页面是否可转成视频
    this.checkIsConvertable();

    //确认可以与content保持通讯
    setTimeout(() => {
      if (!this.isConnectedToContent) {
        this.$message.error("无法和页面通讯，请刷新页面后重试");
      }
    }, 2000);
  },
};
</script>

<style lang="css">
@import "../../assets/css/global.css"; /*引入公共样式*/
@import "../../assets/css/App.css"; /*App*/
</style>
