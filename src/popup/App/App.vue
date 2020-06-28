<template>
  <div id="app">
    hello everyone
  </div>
</template>

<script>
import axios from "axios";

import {
  sleep, //延时，setTimeout的异步写法
  setStorage, //存值
  getStorage, //取值
  debounce, //防抖
} from "@/lib";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      historySearchArr: [], //历史搜索数据
    };
  },

  methods: {
    getClientId() {
      var client = new ClientJS();
      var fingerprint = client.getFingerprint();
      console.log("fingerprint", fingerprint);
    },

    // addToHistory(data) {
    //   this.historySearchArr = this.historySearchArr.filter((item) => {
    //     return item != data.name;
    //   });
    //   if (this.historySearchArr.length > 10) {
    //     this.historySearchArr.pop();
    //   }
    //   this.historySearchArr.unshift(data.name);
    //   setStorage({ historySearchArr: this.historySearchArr });
    // },
    // getHistorySearch() {
    //   getStorage({ historySearchArr: [] }, (data) => {
    //     this.historySearchArr = data.historySearchArr;
    //     // console.log('this.historySearchArr',this.historySearchArr);
    //     if (this.historySearchArr.length > 0) {
    //       this.item.name = this.historySearchArr[0];
    //       this.goResultByKeyword(this.historySearchArr[0]);
    //     }
    //   });
    // },
  },

  mounted() {
    //设置axios超时时间
    // axios.defaults.timeout = 10000;

    //获取搜索历史
    // this.getTaskList();

    this.getClientId();
  },
};
</script>

<style lang="css">
@import "../../assets/css/global.css"; /*引入公共样式*/
@import "../../assets/css/App.css"; /*App*/
</style>
