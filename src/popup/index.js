import Vue from "vue";
import AppComponent from "./App/App.vue";

import {
  Message,
  Loading
} from 'element-ui';

Vue.component("app-component", AppComponent);

Vue.use(Loading.directive)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service


new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});