import Vue from 'vue'
import App from './vue/archive.vue'

let element = document.querySelector('#archive-app')

if (element) {
  new Vue({
    render: (h) => h(App)
  }).$mount(element)
}
