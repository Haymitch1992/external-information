<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { onMounted, ref, shallowRef } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import iconBus from '../assets/busdot.png'
import iconMetro from '../assets/metrodot.png'
import iconParking from '../assets/parking.png'

window._AMapSecurityConfig = {
  securityJsCode: "7e5bc09f4481b57e427367314025db90",
//   securityJsCode: 'c3242bb3ff48fcc871e2e1d57c35dc00'
}
let map: any = null
let AMAP: any = null
const MetroData: any = {
  origin: [],
  mapGroup: null,
  mapData: []
}
const BusData: any = {
  origin: [],
  mapGroup: null,
  mapData: []
}

const ParkingData: any = {
  origin: [],
  mapGroup: null,
  mapData: []
}

onMounted(async () => {
  await initMap()
})

const initMap = async () => {
  return AMapLoader.load({
    key: "2b22402984a62e37a7cf1854ceec05f1", // 申请好的Web端开发者Key，首次调用 load 时必填
    // key: '44d8006d51e66d16119fdc06601c4b29',
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.HeatMap', 'AMap.Icon'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      AMAP = AMap
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 13.3, //初始化地图级别
        center: [116.403512, 39.934204], //初始化地图中心点位置
        // mapStyle: 'amap://styles/whitesmoke',
        mapStyle: "amap://styles/e50de4d7443ce2cc633112de2de760df",
        // mapStyle: 'amap://styles/3fc583b7d06ea880b93c9c3cede8c190'
      })
   })
    .catch((e) => {
      console.log(e)
    })
}

// 绘制地铁站图层
const drawLayerTrainDot = (list, showMetroDot) => {
  if (list && list.length > 0) {
    MetroData.origin = list
    MetroData.mapGroup = new AMAP.OverlayGroup()
    MetroData.mapData = MetroData.origin.map((a: any) => {
      let icon = new AMAP.Icon({
        // 图标尺寸
        size: new AMAP.Size(32, 32),
        // 图标的取图地址
        image: iconMetro,
        anchor: 'center',
        // 图标所用图片大小
        imageSize: new AMAP.Size(32, 32)
        // 图标取图偏移量
      })
      let transData = window.bMapTransQQMap(a.longitude, a.latitude)
      let marker = new AMAP.Marker({
        position: new AMAP.LngLat(transData.lng, transData.lat),
        icon: icon
      })
      marker.on('click', () => {
        positionDot(a)
      })
      MetroData.mapGroup.addOverlay(marker)
    })
    map.add(MetroData.mapGroup)
    if (showMetroDot) {
      MetroData.mapGroup.show()
    } else {
      MetroData.mapGroup.hide()
    }
  }
}

// 绘制公交站图层
const drawLayerBusDot = (list, showBusDot) => {
  if (list && list.length > 0) {
    BusData.origin = list
    BusData.mapGroup = new AMAP.OverlayGroup()
    BusData.mapData = BusData.origin.map((a: any) => {
      let icon = new AMAP.Icon({
        // 图标尺寸
        size: new AMAP.Size(32, 32),
        // 图标的取图地址
        image: iconBus,
        anchor: 'center',
        // 图标所用图片大小
        imageSize: new AMAP.Size(32, 32)
        // 图标取图偏移量
      })
      let transData = window.bMapTransQQMap(a.longitude, a.latitude)
      let marker = new AMAP.Marker({
        position: new AMAP.LngLat(transData.lng, transData.lat),
        icon: icon
        // content:'<div class="marker-route marker-marker-bus-from">FFF</div>'
      })
      BusData.mapGroup.addOverlay(marker)
    })
    map.add(BusData.mapGroup)
    if (showBusDot) {
      BusData.mapGroup.show()
    } else {
      BusData.mapGroup.hide()
    }
  }
}

// 绘制停车场图层
const drawLayerParking = async (list, showParkingDot) => {
  if (list && list.length > 0) {
    ParkingData.origin = list
    ParkingData.mapGroup = new AMAP.OverlayGroup()
    ParkingData.mapData = ParkingData.origin.map((a: any) => {
      let icon = new AMAP.Icon({
        // 图标尺寸
        size: new AMAP.Size(32, 32),
        // 图标的取图地址
        image: iconParking,
        anchor: 'center',
        // 图标所用图片大小
        imageSize: new AMAP.Size(32, 32)
        // 图标取图偏移量
      })
      let transData = window.bMapTransQQMap(a.longitude, a.latitude)
      let marker = new AMAP.Marker({
        position: new AMAP.LngLat(transData.lng, transData.lat),
        icon: icon
        // content:'<div class="marker-route marker-marker-bus-from">FFF</div>'
      })
      ParkingData.mapGroup.addOverlay(marker)
    })
    map.add(ParkingData.mapGroup)
    if (showParkingDot) {
      ParkingData.mapGroup.show()
    } else {
      ParkingData.mapGroup.hide()
    }
  }
}

// 定位车站
const positionDot = function (dot: any) {
  if (!(dot && dot.latitude && dot.longitude)) {
    ElMessage.warning('没有有效的位置信息')
  } else if (!map || !AMAP) {
    ElMessage.warning('地图初始化未完成...')
  } else {
    let transData = window.bMapTransQQMap(dot.longitude, dot.latitude)
    // 传入经纬度，设置地图中心点
    let position = [transData.lng, transData.lat] // 标准写法
    // 简写 var position = [116, 39];
    map.setCenter(position)
    // 获取地图中心点
    // var currentCenter = map.getCenter()
    map.setZoom(17)
  }
}

function showLayer(layer, visile) {
  if (layer === 'metrodot') {
    if (MetroData && MetroData.mapGroup) {
      if (visile) {
        MetroData.mapGroup.show()
      } else {
        MetroData.mapGroup.hide()
      }
    }
  } else if (layer === 'busdot') {
    if (BusData && BusData.mapGroup) {
      if (visile) {
        BusData.mapGroup.show()
      } else {
        BusData.mapGroup.hide()
      }
    }
  } else if (layer === 'parking') {
    if (ParkingData && ParkingData.mapGroup) {
      if (visile) {
        ParkingData.mapGroup.show()
      } else {
        ParkingData.mapGroup.hide()
      }
    }
  }
}

defineExpose({ positionDot, drawLayerTrainDot, drawLayerBusDot, drawLayerParking, showLayer })
</script>

<style scoped>
#container {
  width: 1920px;
  height: 1080px;
  position: relative;
}
.pos-container {
  position: fixed;
  top: 90px;
  left: 400px;
  z-index: 1000;
}
</style>
