<template>
  <div id="mainscreen" class="view-container">
    <!-- map -->
    <div class="item-map">
      <MapMain
        ref="mapMain"
        @positionDotEvt="evtUpdatePosition"
        @clickBus="clickBusFn"
        @clickPark="clickParkFn"
      />
    </div>
    <!-- title -->
    <div class="item-title">
      外部信息综合监视
      <!-- 城市轨道交通线网综合信息监视 -->
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
        <el-tooltip content="公交车">
          <i
            class="iconfont"
            :style="{
              background: showMetroDot ? '#2aba9a' : 'transparent',
              color: showMetroDot ? '#fff' : '#2aba9a'
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

        <el-tooltip content="还原">
          <i
            class="iconfont"
            :style="{
              background: showParking ? '#2aba9a' : 'transparent',
              color: showParking ? '#fff' : '#2aba9a'
            }"
            @click="zoomBack()"
            >&#xeb4e;</i
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
          @change="positionDot"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.nameCn"
            :value="item"
          />
        </el-select>
      </div>
    </div>

    <!-- 指标方格背景 -->
    <div class="box-background" style="left: 0"></div>
    <div class="box-background" style="right: 0"></div>

    <!-- 指标方格 -->
    <div style="color: #fff">
      <Container2 title="综合交通数据" style="position: fixed; left: 10px; top: 80px">
        <!--  -->
        <div class="sumItem">
          <h2>交通拥堵指数</h2>
          <h1>
            <count-up
              :end-val="sumData.latestTrafficIndex"
              :duration="2.5"
              :decimal-places="2"
            ></count-up>
          </h1>
          <h2>道路公交车总数(辆)</h2>
          <h1>
            <count-up :end-val="sumData.busCount" :duration="2.5" :decimal-places="0"></count-up>
          </h1>
          <h2>车站周边共享单车停放总数(辆)</h2>
          <h1>
            <count-up :end-val="sumData.stopCount" :duration="2.5" :decimal-places="0">辆</count-up>
          </h1>
          <h2>七站两场停车场可用停车位总数(个)</h2>
          <h1>
            <count-up :end-val="sumData.berthTotal" :duration="2.5" :decimal-places="0"
              >辆</count-up
            >
          </h1>
        </div>

        <!-- <ColorTable name1="车站" name2="雨量（mm）" :list="listJiangYu" /> -->
      </Container2>
      <Container2 title="地铁舆情监视" style="position: fixed; left: 10px; top: 580px">
        <ul class="event-ul" @click="handleClickWarningList('second')">
          <li v-for="item in highwayListWarning.slice(0, 10)">
            【{{ timeFliter(item.createTm) }}】{{ item.content }}
          </li>
        </ul>
      </Container2>
      <Container2 title="实时天气" style="position: fixed; right: 10px; top: 80px">
        <div class="layerBtn">
          <h3>气象数据</h3>
          <div class="bj-item">
            <span
              >温度<i>{{ Math.ceil(focusDotInfoBj.valueWenDu) }} ℃</i></span
            >
            <span
              >降水<i>{{ focusDotInfoBj.valueJiangShui }} mm</i></span
            >
            <span
              >风速<i>{{ (Number(focusDotInfoBj.valueFengSu) * 0.01).toFixed(2) }} m/s</i></span
            >
            <span
              >风向<i>{{ focusDotInfoBj.valueFengXiang }} 度</i></span
            >
            <span
              >气压 <i>{{ focusDotInfoBj.valueQiYa }} pa</i></span
            >

            <span
              >湿度<i>{{ focusDotInfoBj.valueShiDu }} %</i></span
            >
          </div>
        </div>

        <!-- <ColorTable name1="车站" name2="温度（℃）" :list="listWenDu" /> -->
      </Container2>
      <Container2 title="预测天气" style="position: fixed; right: 10px; top: 580px">
        <ColorTable2 name0="日期" name1="天气" name2="温度" :list="listWeather" />
      </Container2>
    </div>

    <div class="warning-wrap">
      <!-- 天气告警 -->
      <div
        class="warning-box"
        @click="handleClickWarningList('first')"
        v-if="listWarning.length > 0"
      >
        {{ listWarning[0].content }}
      </div>
    </div>

    <!-- 显示列表 -->
    <el-dialog v-model="dialogVisible" title="事件列表" width="1200" :before-close="handleClose">
      <div>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="天气告警" name="first">
            <el-table border :data="listWarning" style="width: 100%">
              <!-- <el-table-column prop="date" label="事件时间" /> -->
              <el-table-column prop="content" label="事件名称" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="地铁舆情" name="second">
            <el-table border :data="highwayListWarning" height="500" style="width: 100%">
              <el-table-column prop="createTm" label="事件时间">
                <template #default="scope">
                  {{ timeFliter(scope.row.createTm) }}
                </template>
              </el-table-column>
              <el-table-column prop="content" label="事件名称" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
          <el-button type="primary" @click="dialogVisible = false"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible2"
      :title="`${curStation.nameCn}地铁车站周边`"
      width="1000"
      :before-close="handleClose2"
    >
      <div class="dataDetail">
        <h3>车站天气</h3>
        <span>温度{{ Math.ceil(focusDotInfo.valueWenDu) }} ℃</span>
        <span>降水{{ focusDotInfo.valueJiangShui }} mm</span>
        <span>风速{{ (Number(focusDotInfo.valueFengSu) * 0.01).toFixed(2) }} m/s</span>
        <span>湿度{{ focusDotInfo.valueShiDu }} %</span>
        <span>气压{{ focusDotInfo.valueQiYa }} pa</span>
        <span>风向{{ focusDotInfo.valueFengXiang }} 度</span>
        <h3>共享单车</h3>
        <span>开锁数量：{{ bicycleInfo.rentCount || 0 }} 辆</span>
        <span>归还数量：{{ bicycleInfo.returnCount || 0 }} 辆</span>
        <span>停放数量：{{ bicycleInfo.stopCount || 0 }} 辆</span>
        <h3>公交车站</h3>
        <!-- {{ allBusDot2 }} -->
        <el-table border :data="allBusDot2" size="small" height="250" style="width: 100%">
          <!-- <el-table-column prop="date" label="事件时间" /> -->
          <el-table-column prop="label" width="150" label="车站名称" />
          <el-table-column prop="busLineName" label="线路名称">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                style="margin: 8px 10px"
                @click="handleClick(item)"
                v-for="item in scope.row.list"
              >
                {{ item.busLineName }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <h3>停车场</h3>

          <el-table border :data="allParking" size="small" style="width: 100%">
            <!-- <el-table-column prop="date" label="事件时间" /> -->
            <el-table-column prop="parkName" label="停车场名称" />
            <el-table-column prop="parkAddress" label="地址" />
            <el-table-column prop="berthTotal" label="车位总数" />
            <el-table-column prop="berthStatus" label="车位可用数">
              <!-- <template #default="scope">
                <span>{{ scope.row.berthTotal - 53 }}</span>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="dialogVisible5"
      title="公交车站信息"
      width="1000"
      :before-close="handleClose5"
    >
      <!-- <p class="bus-info">当前公交站：{{ saveBusInfo.busName }}</p> -->
      <!-- <p class="bus-info">当前线路名称：{{ saveBusInfo.busLineName }}</p> -->
      <!-- {{ lineData }} -->
      <el-table border :data="lineData" size="small" height="250" style="width: 100%">
        <el-table-column prop="label" width="150" label="车站名称" />
        <el-table-column prop="busLineName" label="线路名称">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              style="margin: 8px 10px"
              @click="handleClick(item)"
              v-for="item in scope.row.list"
            >
              {{ item.busLineName }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="dialogVisible3" title="公交信息" width="1000" :before-close="handleClose3">
      <p class="bus-info">当前公交站：{{ saveBusInfo.busName }}</p>
      <!-- <p class="bus-info">当前线路名称：{{ saveBusInfo.busLineName }}</p> -->

      <el-table border :data="saveBusInfo.list" size="small" height="600" style="width: 100%">
        <!-- <el-table-column prop="date" label="事件时间" /> -->
        <el-table-column prop="lineName" label="线路">
          <template #default="scope">
            {{ calclineName(scope.row.lineName) }}
            <!-- {{ scope.row.direction == 0 ? '上行' : '下行' }} -->
          </template>
        </el-table-column>
        <el-table-column prop="direction" label="开往">
          <template #default="scope">
            {{ calcDirection(scope.row.lineName, scope.row.direction) }}
            <!-- {{ scope.row.direction == 0 ? '上行' : '下行' }} -->
          </template>
        </el-table-column>
        <el-table-column prop="fullLoad" label="车辆满载率(%)">
          <template #default="scope">
            {{ scope.row.fullLoad ? (scope.row.fullLoad * 100).toFixed(2) : '' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="carNum" label="车牌号"> </el-table-column> -->
        <!-- <el-table-column prop="gpsTime" label="gps更新时间"> </el-table-column> -->
        <el-table-column prop="stationName" label="下一站">
          <template #default="scope">
            <span :class="{ 'active-text': scope.row.stationName === saveBusInfo.busName }">{{
              scope.row.stationName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distance" label="到站距离(米)">
          <template #default="scope">
            {{ scope.row.distance === '-1' ? '已到站' : scope.row.distance }}
          </template>
        </el-table-column>
        <el-table-column prop="travelTime" label="到站时间(秒)">
          <template #default="scope">
            {{ scope.row.travelTime === '-1' ? '已到站' : scope.row.travelTime }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 停车场站 -->
    <el-dialog
      v-model="dialogVisible4"
      title="停车场信息"
      width="1000"
      :before-close="handleClose4"
    >
      <el-table border :data="allParking" size="small" style="width: 100%">
        <!-- <el-table-column prop="date" label="事件时间" /> -->
        <el-table-column prop="parkName" label="停车场名称" />
        <el-table-column prop="parkAddress" label="地址" />
        <el-table-column prop="berthTotal" label="车位总数" />
        <el-table-column prop="berthStatus" label="车位可用数">
          <!-- <template #default="scope">
            <span>{{ scope.row.berthTotal - 53 }}</span>
          </template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 气象图层 -->
    <div class="weather-btn">
      <span :class="{ active: currentLayer === '温度' }" @click="apiWeatherLayerData('温度')"
        >温度
      </span>
      <span :class="{ active: currentLayer === '降水' }" @click="apiWeatherLayerData('降水')"
        >降水
      </span>
      <span :class="{ active: currentLayer === '风速' }" @click="apiWeatherLayerData('风速')"
        >风速</span
      >
      <span :class="{ active: currentLayer === '风向' }" @click="apiWeatherLayerData('风向')"
        >风向</span
      >
      <span :class="{ active: currentLayer === '湿度' }" @click="apiWeatherLayerData('湿度')"
        >湿度</span
      >
      <span :class="{ active: currentLayer === '气压' }" @click="apiWeatherLayerData('气压')"
        >气压</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
import MapMain from './components/MapMainOl.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as _ from 'lodash'
import api from '@/utils/request.js'

import Container2 from './components/Container2.vue'
import ColorTable from './components/ColorTable.vue'
import ColorTable2 from './components/ColorTable2.vue'
import dayjs from 'dayjs'
import CountUp from 'vue-countup-v3'
import type { ICountUp, CountUpOptions } from 'vue-countup-v3'
// import VueCountUp from 'vue-countupjs'

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false) // 公交站
const dialogVisible4 = ref(false) // 停车场站
const dialogVisible5 = ref(false) // 停车场站
const activeName = ref('first')

const instance: any = getCurrentInstance()

const lineList = ref<any>([])
let originStationList: any = []
const weatherLayerList: any = []
const stationList = ref<any>([])
const curLine = ref<any>()
const curStation = ref<any>({
  nameCn: ''
})
let allStationLoc: any = []
let lineAllBusDot: any = [] //全线网公交车
const allBusDot: any = ref([]) //地铁站周边800米全部公交车
const allBusDot2: any = ref([{ label: '' }]) //地铁站周边800米全部公交车
let lineAllParking: any = [] //全线网停车站
const allParking: any = ref([]) // 周边停车场
const saveBusInfo = ref({
  busName: '',
  busLineName: '',
  list: []
})
// 判断上先行
const calcDirection = (str, direction) => {
  direction = parseInt(direction)
  if (str.indexOf(')') === -1) {
    str = str + ')'
  }
  let returnStr = str.match(/\((.*?)\)/)
  let arrStr = returnStr[1]
  let arr = arrStr.split('-')
  console.log(arr, direction)

  return arr[direction]
}
const calclineName = (str) => {
  let arr = str.split('(')
  return arr[0]
}
const showMetroDot = ref<boolean>(true)
const showBusDot = ref<boolean>(true)
const showParking = ref<boolean>(true)

const listFengSu = ref<any>([])
const listJiangYu = ref<any>([])
const listWenDu = ref<any>([])
const listWeather = ref<any>([])
const listWarning = ref<any>([])
const highwayListWarning = ref<any>([]) // 道路事件
const handleClickWarningList = (type) => {
  dialogVisible.value = true
  activeName.value = type
}

const busSumData: any = ref([])

const sumData = ref({
  stopCount: 0,
  busCount: 0,
  berthTotal: 0,
  latestTrafficIndex: 0
})
const handleClose = (done: () => void) => {
  dialogVisible.value = false
}
const handleClose2 = (done: () => void) => {
  dialogVisible2.value = false
}
const handleClose3 = (done: () => void) => {
  dialogVisible3.value = false
}
const handleClose4 = (done: () => void) => {
  dialogVisible4.value = false
}
const handleClose5 = (done: () => void) => {
  dialogVisible5.value = false
}
const lineData = ref([
  {
    label: '',
    list: []
  }
])

// 查询公交车站周边数据
const clickBusFn = (busName, busLineName) => {
  console.log(busName, busLineName)
  busSumData.value.forEach((item) => {
    if (busName === item.label) {
      console.log(item)
      lineData.value = [item]
      dialogVisible5.value = true
    }
  })

  // apiBusStopForcast(busName, busLineName)
}

const clickParkFn = (parkId) => {
  dialogVisible4.value = true
  lineAllParking.value.forEach((item) => {
    if (parkId === item.parkId) {
      // allParking.value = [item]
      console.log('查询当前车站', item.parkName)
      apiParkDetail(item.parkName)
    }
  })
}
const focusDot = ref<boolean>(false)
const focusDotInfo = ref<any>({})
const focusDotInfoBj = ref<any>({})
const bicycleInfo = ref<any>({})

const currentTime = ref<string>(window.formatDateTime())
let timer = setInterval(() => {
  currentTime.value = window.formatDateTime()
}, 1000)

const rule = [
  {
    label: '气压',
    arr: [5000, 6000, 7000, 8000],
    colorList: ['166, 242, 142', '61, 185, 61', '97, 184, 255', '0, 0, 254', '250, 0, 250']
  },
  {
    label: '温度',
    arr: [-16, -8, 0, 8, 16, 24, 32],
    colorList: [
      '3, 45, 137',
      '125, 206, 244',
      '197, 248, 252',
      '199, 255, 181',
      '171, 211, 129',
      '230, 221, 183',
      '249, 174, 128',
      '254, 84, 15'
    ]
  },
  {
    label: '湿度',
    arr: [10, 20, 30, 35],
    colorList: ['166, 242, 142', '61, 185, 61', '97, 184, 255', '0, 0, 254', '250, 0, 250']
  },
  {
    label: '降水',
    arr: [10, 25, 50, 100],
    colorList: ['166, 242, 142', '61, 185, 61', '97, 184, 255', '0, 0, 254', '250, 0, 250']
  },
  {
    label: '风向',
    arr: [10, 25, 50, 100],
    colorList: ['166, 242, 142', '61, 185, 61', '97, 184, 255', '0, 0, 254', '250, 0, 250']
  },
  {
    label: '风速',
    arr: [1000, 5000, 6000, 7000],
    colorList: ['166, 242, 142', '61, 185, 61', '97, 184, 255', '0, 0, 254', '250, 0, 250']
  }
]

onMounted(async () => {
  renderWindowSize()
  await apiWarningData()
  await apiHighwayWarningData()
  await apiWeatherData()
  await apiTop10Data()
  await apiLineData()
  await apiStationData()
  await apiStationLocData()
  await apiBeijingWeather()
  apiBicycleSum()
  apiBusSum()
  apiParkSum()
  apilatestTrafficIndex()
  var timerapiBicycleSum = setInterval(() => {
    apiBicycleSum()
    apiBusSum()
    apiParkSum()
    apilatestTrafficIndex()
  }, 1000 * 30)

  _combineBaseData()
  apiBusDotInfoInAll()
  apiParkingDotInfoInAll()

  if (instance && instance.refs.mapMain) {
    // 延时3s绘制
    setTimeout(() => {
      instance.refs.mapMain.drawLayerTrainDot(originStationList, showMetroDot.value)
    }, 3500)
  }
})

const handleClick = (obj) => {
  dialogVisible3.value = true
  saveBusInfo.value.busName = obj.busName
  saveBusInfo.value.busLineName = obj.busLineName
  // apiBusStopForcast(obj.busName, obj.busLineName)
  saveBusInfo.value.list = []
  apiBusAllData(obj.busLineName, 0)
  apiBusAllData(obj.busLineName, 1)
}

function apiBusStopForcast(busName, busLineName) {
  saveBusInfo.value.busName = busName
  saveBusInfo.value.busLineName = busLineName
  return api
    .post(`/tctapi/gis/BusStopForcast`, {
      busStopName: busName,
      lineNames: [busLineName]
    })
    .then((res: any) => {
      let data = res.data
      saveBusInfo.value.list = data.data
      // instance.refs.mapMain.updateLayerBusDot(allBusDot.value, showBusDot.value)
    })
}

// 获取全线网公交车站数据
function apiBusDotInfoInAll() {
  return api.get(`/tctapi/gis/BusStationsAll`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      // 线路去重逻辑
      let save = []
      let arr = []

      data.data.forEach((item) => {
        if (save.indexOf(item.busName) === -1) {
          save.push(item.busName)
          arr.push(item)
        }
      })
      let calcArr = []
      save.forEach((item) => {
        calcArr.push({
          label: item,
          list: []
        })
      })
      data.data.forEach((item) => {
        calcArr.forEach((item2) => {
          if (item2.label === item.busName) {
            item2.list.push(item)
          }
        })
      })
      busSumData.value = calcArr
      lineAllBusDot.value = arr
      // lineAllBusDot.value = data.data
      // instance.refs.mapMain.updateLayerBusDot(allBusDot.value, showBusDot.value)
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

function apiParkingDotInfoInAll() {
  return api.get(`/tctapi/gis/ParkLoc`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      lineAllParking.value = data.data
      // instance.refs.mapMain.updateLayerBusDot(allBusDot.value, showBusDot.value)
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

// 获取交通拥堵指数
async function apilatestTrafficIndex() {
  return api.get(`/tctapi/gis/latestTrafficIndex`).then((res: any) => {
    let data = res.data
    console.log('123', data.data.index)
    sumData.value.latestTrafficIndex = data.data.index
    if (data.code == 200) {
      // focusDotInfoBj.value = data.data
    }
  })
}

// 获取北京市天气
async function apiBeijingWeather() {
  return api.get(`/tctapi/gis/Weather/avg`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      focusDotInfoBj.value = data.data
    }
  })
}

// 获取线路车站
async function apiBusAllData(str, direction) {
  return api.get(`/tctapi/gis/BusLineForcast/${str}/${direction}`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      data.data.forEach((item) => {
        saveBusInfo.value.list.push(item)
      })
      // 根据当前车站 进行排序
      saveBusInfo.value.list = sortStations(saveBusInfo.value.list)
    }
  })
}
const sortStations = (stations) => {
  return stations.sort((a, b) => {
    // 如果a的name是'北京站'，则它应该排在b前面
    if (a.stationName === saveBusInfo.value.busName) {
      return -1
    }
    // 如果b的name是'北京站'，则它应该排在a前面
    if (b.stationName === saveBusInfo.value.busName) {
      return 1
    }
    // 如果都不是'北京站'，则按字母顺序排序
    return a.stationName.localeCompare(b.stationName)
  })
}

const currentLayer = ref('')
// 获取气象图层
async function apiWeatherLayerData(layerName) {
  if (currentLayer.value === layerName) {
    weatherLayerList.value = []
    currentLayer.value = ''
    rule.forEach((item) => {
      if (item.label === layerName) {
        instance.refs.mapMain.drawHeatMap(weatherLayerList.value, item.arr, item.colorList)
      }
    })
  } else {
    currentLayer.value = layerName
    return api.get(`/tctapi/gis/WeatherLayer/${layerName}`).then((res: any) => {
      let data = res.data
      if (data.code == 200) {
        // focusDotInfo.value = data.data
        weatherLayerList.value = data.data
        console.log(weatherLayerList)
        rule.forEach((item) => {
          if (item.label === layerName) {
            instance.refs.mapMain.drawHeatMap(weatherLayerList.value, item.arr, item.colorList)
          }
        })
      }
    })
  }
}

/**
 * 整合车站数据
 */
function _combineBaseData() {
  originStationList.forEach((s: any) => {
    let findDot = allStationLoc.find((a: any) => a.nameCn == s.nameCn)
    if (findDot) {
      s.longitude = findDot.longitude
      s.latitude = findDot.latitude
    }
  })
}
/**
 * 切换线路（更新车站选项）
 */
function _changeLine() {
  stationList.value = []
  curStation.value = null
  if (curLine.value) {
    stationList.value = originStationList.filter((a: any) => a.lineId == curLine.value.id)
  }
}
/**
 * 定位车站
 */
function positionDot() {
  if (curStation.value) {
    if (instance && instance.refs.mapMain) {
      apiDotWeather()
      instance.refs.mapMain.positionDot(curStation.value)
      apiBusDotInfoIn800m(curStation.value.id)
      apiParkingInfoIn800m(
        curStation.value.latitude,
        curStation.value.longitude,
        curStation.value.nameCn
      )
      apiBicycleInfoIn300m(curStation.value.nameCn)
      focusDot.value = true
      // dialogVisible2.value = true
    }
  } else {
    ElMessage.info('请先选择车站后再定位')
  }
}

/**
 * 更新车站周边信息
 */
function evtUpdatePosition(dot: any) {
  // instance.refs.mapMain.drawHeatMap()
  if (dot) {
    curStation.value = dot
    apiDotWeather() // 查询天气
    apiBusDotInfoIn800m(dot.id) // 查询周边公交站
    apiParkingInfoIn800m(dot.latitude, dot.longitude, dot.nameCn) // 查询周边停车场
    apiBicycleInfoIn300m(dot.nameCn)
    focusDot.value = true
    dialogVisible2.value = true
  } else {
    instance.refs.mapMain.updateLayerBusDot([], showBusDot.value)
    instance.refs.mapMain.updateLayerParking([], showMetroDot.value)
    focusDot.value = false
  }
}

// 北京市 气象数据 显示右上角
// async funciton

/**
 * 2.1.2.1 全网气象Top10车站（风速、降水、温度、湿度）
 */
async function apiTop10Data() {
  return api.get(`/tctapi/gis/WeatherTop10`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      listWenDu.value = data.data.wenDu
        ? data.data.wenDu.map((a: any) => {
            return {
              value1: a.nameCn,
              value2: a.valueWenDu
            }
          })
        : []
      listJiangYu.value = data.data.jiangShui
        ? data.data.jiangShui.map((a: any) => {
            return {
              value1: a.nameCn,
              value2: a.valueJiangShui
            }
          })
        : []
      listFengSu.value = data.data.fengSu
        ? data.data.fengSu.map((a: any) => {
            return {
              value1: a.nameCn,
              value2: (Number(a.valueFengSu) * 0.01).toFixed(2)
            }
          })
        : []
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}
/**
 * 2.1.2.2 指定车站的气象数据(气压、风速、风向、温度、湿度、降水)
 */
async function apiDotWeather() {
  return api.get(`/tctapi/gis/Weather/${curStation.value.nameCn}`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      focusDotInfo.value = data.data
    }
  })
}
/**
 * 2.1.2.3 全网地铁站点坐标
 */
async function apiStationLocData() {
  return api.get(`/tctapi/gis/AllStationLocation`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      allStationLoc = data.data
    }
  })
}

/**
 * 2.1.2.5 天气预报
 */
async function apiWeatherData() {
  return api.get(`/tctapi/gis/WeatherForecast`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      if (data.data) {
        listWeather.value = data.data.weatherForecast10Days
          ? data.data.weatherForecast10Days
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
          : [
              // { value0: '3月21日', value1: '5~17℃', value2: '多云转晴' },
              // { value0: '3月22日', value1: '7~22℃', value2: '晴' },
              // { value0: '3月23日', value1: '7~18℃', value2: '晴' },
              // { value0: '3月24日', value1: '2~14℃', value2: '多云转晴' },
              // { value0: '3月25日', value1: '4~15℃', value2: '晴' },
              // { value0: '3月26日', value1: '3~17℃', value2: '晴' },
              // { value0: '3月27日', value1: '3~17℃', value2: '晴' },
              // { value0: '3月28日', value1: '6~19℃', value2: '晴' }
            ]
      } else {
        listWeather.value = [
          // { value0: '3月21日', value1: '5~17℃', value2: '多云转晴' },
          // { value0: '3月22日', value1: '7~22℃', value2: '晴' },
          // { value0: '3月23日', value1: '7~18℃', value2: '晴' },
          // { value0: '3月24日', value1: '2~14℃', value2: '多云转晴' },
          // { value0: '3月25日', value1: '4~15℃', value2: '晴' },
          // { value0: '3月26日', value1: '3~17℃', value2: '晴' },
          // { value0: '3月27日', value1: '3~17℃', value2: '晴' },
          // { value0: '3月28日', value1: '6~19℃', value2: '晴' }
        ]
      }
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}
/**
 * 2.1.2.6 地铁线路基础数据
 */
async function apiLineData() {
  return api.get(`/tctapi/gis/AllLine`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      lineList.value = data.data
    }
  })
}
/**
 * 2.1.2.7 地铁车站基础数据
 */
async function apiStationData() {
  return api.get(`/tctapi/gis/AllStation`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      originStationList = data.data
    }
  })
}
/**
 * @param layer 切换图层
 */
function changeLayer(layer: string) {
  if (layer === 'metrodot') {
    instance.refs.mapMain.changeLayerVisible(layer)
  } else if (layer === 'busdot') {
    //
    showBusDot.value = !showBusDot.value
    if (showBusDot.value) {
      instance.refs.mapMain.updateLayerBusDot([], showBusDot.value)
    } else {
      instance.refs.mapMain.updateLayerBusDot(lineAllBusDot.value, showBusDot.value)
    }
  } else if (layer === 'parking') {
    showParking.value = !showParking.value
    if (showParking.value) {
      instance.refs.mapMain.updateLayerParking([], showParking.value)
    } else {
      instance.refs.mapMain.updateLayerParking(lineAllParking.value, showParking.value)
    }
  }

  // return
}

/**
 * 2.1.2.10 获取地铁站点800米内公交站点
 */
function apiBusDotInfoIn800m(dotid: Number) {
  return api.get(`/tctapi/gis/BusStationsAround/${dotid}`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      allBusDot.value = data.data
      allBusDot.value.sort(compareByGender)

      let save = []
      let arr = []

      data.data.forEach((item) => {
        if (save.indexOf(item.busName) === -1) {
          save.push(item.busName)
          arr.push(item)
        }
      })

      let calcArr = []
      save.forEach((item) => {
        calcArr.push({
          label: item,
          list: []
        })
      })
      data.data.forEach((item) => {
        calcArr.forEach((item2) => {
          if (item2.label === item.busName) {
            item2.list.push(item)
          }
        })
      })
      allBusDot2.value = calcArr
      // lineAllBusDot.value = arr

      instance.refs.mapMain.updateLayerBusDot(arr, showBusDot.value)
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

function compareByGender(a, b) {
  // 如果a和b的gender相同，则返回0，表示它们相等

  if (a.busName === b.gender) {
    return 0
  }

  if (a.busName < b.busName) {
    return -1
  }

  // 否则，返回1

  return 1
}
/**
 * 2.1.2.11 获取地铁站点800米内停车场信息
 */
function apiParkingInfoIn800m(lat: Number, lon: Number, sname: string) {
  return api.get(`/tctapi/gis/ParksAroundRealTime/${sname}/${lon}/${lat}  `).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      allParking.value = data.data
      instance.refs.mapMain.updateLayerParking(allParking.value, showMetroDot.value)
    } else {
      allParking.value = []
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

// 2024/3/4 新增共享单车查询接口 tctapi/gis/sharedBikeNearStation/{车站}
function apiBicycleInfoIn300m(sname: string) {
  return api.get(`/tctapi/gis/sharedBikeNearStation/${sname}`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      bicycleInfo.value = data.data[0]
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

function apiBicycleSum() {
  return api.get(`/tctapi/gis/sharedBikeNearStation/sum`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      sumData.value.stopCount = data.data[0].stopCount
      // bicycleInfo.value = data.data[0]
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

function apiBusSum() {
  return api.get(`/tctapi/gis/BusLineForcastTotal`).then((res: any) => {
    let data = res.data
    sumData.value.busCount = data.data.count
  })
}

function apiParkSum() {
  //gis/Parksberth/sum
  return api.get(`/tctapi/gis/Parksberth/sum`).then((res: any) => {
    let data = res.data
    sumData.value.berthTotal = data.data[0].berthStatus
  })
}

function apiParkDetail(str) {
  //gis/Parksberth/sum
  return api.get(`/tctapi/gis/Parksberth/${str}`).then((res: any) => {
    let data = res.data
    // sumData.value.berthTotal = data.data[0].berthStatus
    allParking.value = data.data
    // console.log('!!!!!!!!', data.data[0])
  })
}
/**
 * 2.1.2.4 天气预警
 */
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
// 道路事件查询接口 翻页
async function apiHighwayWarningData() {
  // 获取时间
  let startDate = dayjs().format('YYYYMMDD')
  // let postdata = {
  //   startDate: '20240307',
  //   endDate: startDate,
  //   sortColumn: '1',
  //   sortAsc: true,
  //   pageNum: 1,
  //   pagesize: 5
  // }
  // highwayinfoindate postdata
  return api.get(`/tctapi/gis/subwayENews`).then((res: any) => {
    let data = res.data
    if (data.code == 200) {
      highwayListWarning.value = data.data.map((a: any) => {
        return {
          content: a.discribe,
          createTm: a.createTime,
          visible: true
        }
      })
    } else {
      ElMessage.error(`获取数据时发生异常：${data.msg}`)
    }
  })
}

/**
 * 还原地图
 */
function zoomBack() {
  if (instance && instance.refs.mapMain) {
    instance.refs.mapMain.zoomBack()
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

const timeFliter = (str) => {
  if (!str) {
    return ''
  }
  let returnStr =
    str.slice(0, 4) +
    '-' +
    str.slice(5, 7) +
    '-' +
    str.slice(8, 10) +
    ' ' +
    str.slice(11, 13) +
    ':' +
    str.slice(14, 16) +
    ':' +
    str.slice(17, 19)
  return returnStr
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
  font-size: 30px;
  font-weight: bold;
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
  border: solid 1px #fff8ad;
  background-color: #4e6d41;
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
  right: 360px;
  top: 14px;
  color: #2aba9a;
}
.svg-btn i {
  cursor: pointer;
  font-size: 20px;
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
.warning-box {
  height: 60px;
  /* background-color: #33bee0; */
  width: 1130px;
  margin: 10px auto;
  line-height: 60px;
  padding: 0 15px;
  border: solid 1px #fff8ad;
  background-color: #4e6d41;
  border-radius: 4px;
  color: #fff;
}
.event-ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
  text-align: left;
  height: 500px;
  overflow: auto;
  li {
    font-size: 14px;
    margin-bottom: 20px;
  }
}
.sumItem {
  padding-top: 6px;
  h1 {
    color: #2aba9a;
    background-color: #06252e;
    font-size: 40px;
    margin: 0;
    padding: 0;
    line-height: 56px;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 18px;
    background-color: #06252e;
    margin: 0;
    padding: 10px 0 0px;
  }
}
.layerBtn {
  text-align: left;
  span {
    color: #2aba9a;
    background-color: #06252e;
    display: inline-block;
    margin: 0 4px 10px;
    padding: 14px 20px;
    cursor: pointer;
    border-radius: 4px;
  }
  .bj-item {
    span {
      display: block;
    }
    i {
      float: right;
    }
  }
  .active {
    background-color: #0d3946;
  }
  h3 {
    font-size: 16px;
    color: #2aba9a;
    padding: 0;
    margin: 0;
    line-height: 40px;
  }
}
.bus-info {
  color: #2aba9a;
  margin: 4px 0 8px;
  background-color: #06252e;
  line-height: 40px;
  padding: 4px;
}
.dataDetail {
  color: #2aba9a;
  /* background-color: #041a21; */
  padding: 12px;
  border-radius: 4px;
  h3 {
    font-size: 16px;
  }
  span {
    color: #2aba9a;
    display: inline-block;
    background-color: #06252e;
    margin: 0 4px 4px;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
}
.weather-btn {
  background-color: #fff;
  position: fixed;
  bottom: 62px;
  left: 380px;
  padding: 6px 2px;
  border-radius: 2px;
  /* height: 200px; */
  h3 {
    padding: 0;
    margin: 0;
    font-size: 16px;
    margin-bottom: 10px;
  }
  span {
    background: #0d3946;
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    margin: 0 4px;
    cursor: pointer;
  }
  .active {
    background: #2aba9a;
  }
  span:hover {
    background: #165264;
  }
}
.active-text {
  color: #2aba9a;
  background-color: #e4f500;
}
</style>
