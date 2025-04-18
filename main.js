import Vue from 'vue'
import App from './App'
import axios from 'axios'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
