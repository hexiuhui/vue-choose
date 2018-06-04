import Vue from 'vue'
import App from './App.vue'
import vueChoosePlug from './lib/index.js'
// import Axios from 'axios'

// Vue.prototype.$http = Axios
Vue.use(vueChoosePlug)
new Vue({
  el: '#app',
  render: h => h(App)
})
