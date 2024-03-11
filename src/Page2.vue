<template>
  <div id="mainscreen" class="view-container">
    <!-- map -->
    <div class="item-map">
      <MapMain ref="mapMain" />
    </div>
    <!-- title -->
    <div class="item-title">
      城市轨道交通线网综合信息监视
      <span class="time">{{ currentTime }}</span>
      <div class="svg-btn">
        <el-tooltip content="地铁站">
          <i
            class="iconfont"
            :style="{
              background: showMetroDot ? '#2aba9a' : 'transparent',
              color: showMetroDot ? '#fff' : '#2aba9a'
            }"
            @click="changeLayer('metrodot')"
            >&#xe60b;</i
          >
        </el-tooltip>
        <el-tooltip content="公交站">
          <i
            class="iconfont"
            :style="{
              background: showBusDot ? '#2aba9a' : 'transparent',
              color: showBusDot ? '#fff' : '#2aba9a'
            }"
            @click="changeLayer('busdot')"
            >&#xe603;</i
          >
        </el-tooltip>
        <el-tooltip content="停车场">
          <i
            class="iconfont"
            :style="{
              background: showParking ? '#2aba9a' : 'transparent',
              color: showParking ? '#fff' : '#2aba9a'
            }"
            @click="changeLayer('parking')"
            >&#xe6fc;</i
          >
        </el-tooltip>
      </div>
      <div class="location">
        <el-select
          v-model="curLine"
          placeholder="选择线路"
          style="margin-top: -5px"
          @change="_changeLine"
          size="large"
          value-key="id"
        >
          <el-option v-for="item in lineList" :key="item.id" :label="item.nameCn" :value="item" />
        </el-select>
        <el-select
          v-model="curStation"
          placeholder="选择车站"
          style="margin-left: 10px; margin-top: -5px"
          size="large"
          value-key="id"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.nameCn"
            :value="item"
          />
        </el-select>
        <el-tooltip content="定位车站">
          <i
            class="iconfont location-icon"
            :style="{
              background: curStation ? '#2aba9a' : 'transparent',
              color: curStation ? '#fff' : '#2aba9a'
            }"
            @click="positionDot()"
            >&#xe60c;</i
          >
        </el-tooltip>
      </div>
    </div>

    <!-- 指标方格背景 -->
    <div class="box-background" style="left: 0"></div>
    <div class="box-background" style="right: 0"></div>

    <!-- 指标方格 -->
    <div style="color: #fff">
      <Container2 title="降雨（mm）" style="position: fixed; left: 10px; top: 100px">
        <ColorTable name1="车站" name2="雨量（mm）" :list="listJiangYu" />
      </Container2>
      <Container2 title="风速（m/s）" style="position: fixed; left: 10px; top: 590px">
        <ColorTable name1="车站" name2="风速 (m/s)" :list="listFengSu" />
      </Container2>
      <Container2 title="温度（℃）" style="position: fixed; right: 10px; top: 100px">
        <ColorTable name1="车站" name2="温度（℃）" :list="listWenDu" />
      </Container2>
      <Container2 title="天气预测" style="position: fixed; right: 10px; top: 590px">
        <ColorTable2 name0="日期" name1="天气" name2="温度" :list="listWeather" />
      </Container2>
    </div>

    <div class="warning-wrap">
      <div class="warning" v-for="(item, index) in listWarning" v-show="item.visible">
        <span v-on:click="item.visible = false">×</span>
        <p>
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
import MapMain from './components/MapMainLight.vue'
import { ElMessage } from 'element-plus'
import * as _ from 'lodash'
import api from '@/utils/request.js'

import Container2 from './components/Container2.vue'
import ColorTable from './components/ColorTable.vue'
import ColorTable2 from './components/ColorTable2.vue'

const instance: any = getCurrentInstance()

const lineList = ref<any>([])
let originStationList: any = []
const stationList = ref<any>([])
const curLine = ref<any>()
const curStation = ref<any>()
let allStationLoc: any = []
let allBusDot: any = []
let allParking: any = []

const showMetroDot = ref<boolean>(true)
const showBusDot = ref<boolean>(true)
const showParking = ref<boolean>(true)

const listFengSu = ref<any>([])
const listJiangYu = ref<any>([])
const listWenDu = ref<any>([])
const listWeather = ref<any>([])
const listWarning = ref<any>([])

const currentTime = ref<string>(window.formatDateTime())
let timer = setInterval(() => {
  currentTime.value = window.formatDateTime()
}, 1000)

onMounted(async () => {
  renderWindowSize()

  await apiWarningData()
  await apiWeatherData()
  await apiTop10Data()

  await apiLineData()
  await apiStationData()
  await apiStationLocData()
  _combineBaseData()

  if (instance && instance.refs.mapMain) {
    // 延时3s绘制
    setTimeout(() => {
      instance.refs.mapMain.drawLayerTrainDot(allStationLoc, showMetroDot.value)
      instance.refs.mapMain.drawLayerBusDot(allBusDot, showBusDot.value)
      instance.refs.mapMain.drawLayerParking(allParking, showParking.value)
    }, 1500)
  }
})

async function apiLineData() {
  return api.get(`/tctapi/gis/AllLine`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      lineList.value = data.data
    }
  })
}
async function apiStationData() {
  return api.get(`/tctapi/gis/AllStation`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      originStationList = data.data
    }
  })
}
async function apiStationLocData() {
  return api.get(`/tctapi/gis/AllStationLocation`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      allStationLoc = data.data
    }
  })
}

function _combineBaseData() {
  originStationList.forEach((s: any) => {
    let findDot = allStationLoc.find((a: any) => a.nameCn == s.nameCn)
    if (findDot) {
      s.longitude = findDot.longitude
      s.latitude = findDot.latitude
    }
  })
}
function _changeLine() {
  stationList.value = []
  curStation.value = null
  if (curLine.value) {
    stationList.value = originStationList.filter((a: any) => a.lineId == curLine.value.id)
  }
}
function positionDot() {
  if (curStation.value) {
    console.log(curStation.value)
    if (instance && instance.refs.mapMain) {
      instance.refs.mapMain.positionDot(curStation.value)
    }
  } else {
    ElMessage.info('请先选择车站后再定位')
  }
}

async function apiTop10Data() {
  return api.get(`/tctapi/gis/WeatherTop10`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      listWenDu.value = data.data.wenDu.map((a: any) => {
        return {
          value1: a.nameCn,
          value2: a.valueWenDu
        }
      })
      listJiangYu.value = data.data.jiangShui.map((a: any) => {
        return {
          value1: a.nameCn,
          value2: a.valueJiangShui
        }
      })
      listFengSu.value = data.data.fengSu.map((a: any) => {
        return {
          value1: a.nameCn,
          value2: a.valueFengSu
        }
      })
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

async function apiWeatherData() {
  return api.get(`/tctapi/gis/WeatherForecast`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      listWeather.value = data.data.weatherForecast10Days
        .filter((a: any) => {
          return a.date.indexOf('白天') > -1
        })
        .map((a: any) => {
          return {
            value0: a.date.replace('白天', ''),
            value1: a.weather,
            value2: a.plainTemp
          }
        })
        .slice(0, 10)
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

async function apiWarningData() {
  return api.get(`/tctapi/gis/WeatherAdvisory`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      listWarning.value = data.data.map((a: any) => {
        return {
          content: a.warningInfo,
          visible: true
        }
      })
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

function changeLayer(layer: string) {
  if (layer === 'metrodot') {
    showMetroDot.value = !showMetroDot.value
    instance.refs.mapMain.showLayer(layer, showMetroDot.value)
  } else if (layer === 'busdot') {
    showBusDot.value = !showBusDot.value
    instance.refs.mapMain.showLayer(layer, showBusDot.value)
  } else if (layer === 'parking') {
    showParking.value = !showParking.value
    instance.refs.mapMain.showLayer(layer, showParking.value)
  }
}

// 自适应分辨率缩放
function renderWindowSize() {
  let designWidth = 1920 //设计稿的宽度，根据实际项目调整
  let designHeight = 1080 //设计稿的高度，根据实际项目调整
  let scalex = (document.documentElement.clientWidth - designWidth) / designWidth + 1
  let scaley = (document.documentElement.clientHeight - designHeight) / designHeight + 1

  let s: any = document.querySelector('#mainscreen')
  if (s) {
    s.style.transform = `scale(${scalex},${scaley})`
  }
}
window.onresize = function () {
  renderWindowSize()
}
</script>

<style scoped>
.view-container {
  width: 1920px;
  height: 1080px;
  background: #041a21;
  transform-origin: top left;
  position: relative;
}
.item-title {
  position: fixed;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 24px;
  text-align: center;
  line-height: 80px;
  width: 1920px;
  height: 80px;
  background: url('./assets/top-bg.png');
  /* 背景图垂直、水平均居中 */
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  /* background-attachment: fixed; */
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  /* 设置背景颜色，背景图加载过程中会显示背景色 */
  background-color: #041a21;
}

.item-map {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  box-sizing: border-box;
}

.warning-wrap {
  box-sizing: border-box;
  position: fixed;
  top: 100px;
  left: 380px;
  max-height: 300px;
  overflow-y: auto;
}

.warning {
  position: relative;
  border: solid 1px #F00;
  background-color: #bc2121;
  border-radius: 6px;
  color: #fff;
  width: 1130px;
  min-height: 40px;
  padding: 0px 15px;
  margin: 5px 0;
  overflow-x: auto;
  overflow-y: auto;
}
.warning span {
  position: absolute;
  right: 5px;
  top: 5px;
  color: #fff8ad;
  cursor: pointer;
  font-size: 1.2rem;
}

.box-background {
  position: fixed;
  top: 80px;
  width: 365px;
  height: 100%;
  background-color: #041a21;
}

.time {
  position: fixed;
  width: 310px;
  right: 20px;
  top: 8px;
  color: #d2cc71;
  font-size: 2rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: left;
}

.svg-btn {
  position: fixed;
  right: 380px;
  top: 10px;
  color: #2aba9a;
}
.svg-btn i {
  cursor: pointer;
  font-size: 1.6rem;
  margin: 5px;
  border: solid 1px #2aba9a;
  padding: 5px;
}
.svg-btn i:hover {
  background-color: #2aba9a !important;
  color: white !important;
}

.location {
  position: fixed;
  left: 10px;
  top: 10px;
}

.location-icon {
  cursor: pointer;
  font-size: 1.6rem;
  display: inline-block;
  margin: 5px;
  display: inline;
  border: solid 1px #2aba9a;
  padding: 5px;
}
.location-icon:hover {
  background-color: #2aba9a !important;
  color: white !important;
}

i::selection {
  background-color: transparent;
}
</style>
