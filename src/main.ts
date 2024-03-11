import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/fonticon/iconfont.css'
import router from './router'

if (!window.formatDateTime) {
  window.formatDateTime = (date) => {
    if (!date) {
      date = new Date()
    }
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  }
}

// 将百度地图经纬度转换为腾讯/高德地图经纬度        用于大屏
window.qqMapTransBMap= function (lng, lat) {
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0
  let x = lng - 0.0065
  let y = lat - 0.006
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  let lngs = z * Math.cos(theta)
  let lats = z * Math.sin(theta)

  return {
    lng: lngs,
    lat: lats
  }
}

//将腾讯/高德地图经纬度转换为百度地图经纬度
window.bMapTransQQMap = function (lng, lat) {
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0
  let x = lng
  let y = lat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  let lngs = z * Math.cos(theta) + 0.0065
  let lats = z * Math.sin(theta) + 0.0002

  return {
    lng: lngs,
    lat: lats
  }
}

const app = createApp(App)
app.use(router)
app.use(ElementPlus).mount('#app')
