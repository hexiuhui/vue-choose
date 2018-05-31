import Vue from 'vue'
import App from './App.vue'
import Choose from './lib/choose'
import Axios from 'axios'

Vue.prototype.$http = Axios
Vue.use(Choose)

new Vue({
  el: '#app',
  render: h => h(App)
})
