<template>
  <div id="container"></div>
  <ul class="tip-item" v-if="heatDataSave.origin.length">
    <li v-for="(item, index) in heatDataSave.colorList">
      <span
        v-if="index !== heatDataSave.colorList.length - 1"
        :style="{ background: `rgba(${item},0.3)` }"
      >
        ＜ {{ heatDataSave.rule[index] }}</span
      >
      <span
        v-if="index == heatDataSave.colorList.length - 1"
        :style="{ background: `rgba(${item},0.3)` }"
        >{{ heatDataSave.rule[index - 1] }}以上</span
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Circle } from 'ol/geom.js'
import Feature from 'ol/Feature.js'
import Map from 'ol/Map.js'
import Point from 'ol/geom/Point.js'
import VectorSource from 'ol/source/Vector.js'
import { Heatmap as HeatmapLayer } from 'ol/layer'
import View from 'ol/View.js'
import { Icon, Style, Text, Fill, Stroke } from 'ol/style.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { XYZ } from 'ol/source'
import Polygon from 'ol/geom/Polygon'
import TileLayer from 'ol/layer/Tile'

import iconBus from '../assets/busdot.png'
import iconMetro from '../assets/metrodot.png'
import iconBicycle from '../assets/bicycle.png'
import iconParking from '../assets/parking.png'

const emit = defineEmits(['positionDotEvt', 'clickBus','clickPark'])

let map: any = null // 地图对象
let vectorLayer: any = null
let AmapLayer: any = null

const changeLayerVisible = (layer) => {
  // 显示图层
  switch (layer) {
    case 'metrodot':
      MetroData.visible = !MetroData.visible
      MetroData.mapGroup.setVisible(MetroData.visible)
  }
}

const MetroData: any = {
  //地铁站数据
  origin: [],
  mapGroup: null,
  mapData: [],
  visible: true // 图层显示
}
const BusData: any = {
  //公交站数据
  origin: [],
  mapGroup: null,
  mapData: [],
  visible: true
}
const ParkingData: any = {
  //停车场站数据
  origin: [],
  mapGroup: null,
  mapData: [],
  visible: true
}
const BicycleData: any = {
  //停车场站数据
  origin: [],
  mapGroup: null,
  mapData: [],
  visible: true
}

// 圆
const circleData: any = {
  origin: [],
  x: null,
  y: null,
  mapGroup: null,
  mapData: [],
  visible: true
}

const heatData: any = {
  mapData: [],
  origin: [],
  mapGroup: null,
  rule: [],
  colorList: []
}

const heatDataSave = ref({
  rule: [],
  colorList: [],
  origin: []
})

// 绘制气象热力图
const drawHeatMap = (list, arr, colorList) => {
  console.log('arr!!!!!!!', arr)
  heatData.origin = list
  heatData.rule = arr
  heatData.colorList = colorList
  heatDataSave.value.rule = arr
  heatDataSave.value.colorList = colorList
  heatDataSave.value.origin = list
  if (heatData.mapGroup) {
    map.removeLayer(heatData.mapGroup)
    heatData.mapGroup = null
  }
  let metros = []
  // 绘制一个矩形
  heatData.mapData = heatData.origin.forEach((item) => {
    let lg = parseFloat(item.lg)
    let ln = parseFloat(item.ln)
    var polygon = new Polygon([
      [
        [lg, ln],
        [lg + 0.00582, ln],
        [lg + 0.00582, ln + 0.00495],
        [lg, ln + 0.00495],
        [lg, ln]
      ]
    ])
    const featureStyle = new Style({
      fill: new Fill({
        color: calcColor(parseFloat(item.v))
      })
    })
    const feature = new Feature(polygon)
    feature.setStyle(featureStyle)
    metros.push(feature)
  })

  // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857'))

  const vectorSource = new VectorSource({
    features: [...metros]
  })
  heatData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 1
  })

  map.addLayer(heatData.mapGroup)

  // map.addLayer(heatData.mapGroup)
}

const calcColor = (val) => {
  let arr = heatData.rule
  var str = ``
  let saveIndex = 0
  arr.forEach((item, index) => {
    if (val > item) {
      saveIndex++
    }
  })
  str = `rgba(${heatData.colorList[saveIndex]},0.3)`

  console.log(val, saveIndex, arr)
  return str
}

const drawcircleDot = (x, y) => {
  if (circleData.mapGroup) {
    map.removeLayer(circleData.mapGroup)
    circleData.mapGroup = null
  }
  let metros = []
  const cricleStyle = new Style({
    fill: new Fill({
      color: 'rgba(32,157,230,0.4)'
    })
  })
  const circleFeature = new Feature({
    geometry: new Circle([x, y], getRadius(800)),
    iconType: 'circle'
  })
  circleFeature.setStyle(cricleStyle)
  metros.push(circleFeature)
  const vectorSource = new VectorSource({
    features: [...metros]
  })
  circleData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 10
  })
  map.addLayer(circleData.mapGroup)
}

const hideDrawcircleDot = () => {
  if (circleData.mapGroup) {
    map.removeLayer(circleData.mapGroup)
    circleData.mapGroup = null
  }
}

const initMap = async () => {
  AmapLayer = new TileLayer({
    source: new XYZ({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&scl=1&ltype=3',
      // url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
      maxZoom: 20
    })
  })

  map = new Map({
    target: 'container',
    view: new View({
      center: [116.403512, 39.934204], // 地图中心点
      zoom: 15, // 缩放
      maxZoom: 16, //最大缩放等级
      projection: 'EPSG:4326' // 坐标系
    })
  })
  map.addLayer(AmapLayer)
  // drawHeatMap()
  map.on('click', function (event) {
    // 事件绑定在地图上
    const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature
    }) // 获取被点击的要素
    if (feature) {
      // 如果点击到了要素上 位置居中
      console.log('打印当前节点的数据', feature.values_)
      // 选中车站展示范围
      if (feature.values_.stationId) {
        let dot = {
          id: feature.values_.stationId,
          lineId: feature.values_.lineId,
          nameCn: feature.values_.name,
          latitude: feature.values_.geometry.flatCoordinates[1],
          longitude: feature.values_.geometry.flatCoordinates[0]
        }
        console.log('打印当前节点dot', dot)
        emit('positionDotEvt', dot)
        drawcircleDot(dot.longitude, dot.latitude)
      } else if (feature.values_.iconType === 'circle') {
        hideDrawcircleDot()
        emit('positionDotEvt')
      } else if (feature.values_.busName) {
        emit('clickBus', feature.values_.busName, feature.values_.busLineName)
      } else if (feature.values_.parkId) {
        emit('clickPark', feature.values_.parkId)
      }
      // 选中关闭范围 没有staionId

      // 显示站点周边数据
      map.getView().animate({
        center: feature.values_.geometry.flatCoordinates, // 中心点
        zoom: 16, //放大
        rotation: undefined, // 缩放完成view视图旋转弧度
        duration: 1000 // 缩放持续时间，默认不需要设置
      })
    }
  })
}

// 地图缩放
const zoomBack = () => {
  map.getView().animate({
    // 只设置需要的属性即可
    center: [116.403512, 39.934204], // 中心点
    // zoom: 13, // 缩放级别
    rotation: undefined, // 缩放完成view视图旋转弧度
    duration: 1000 // 缩放持续时间，默认不需要设置
  })
}

// 绘制地铁站图层
const drawLayerTrainDot = (list, showMetroDot) => {
  MetroData.origin = list
  let metros = []

  MetroData.mapData = MetroData.origin.map((a: any) => {
    // 点要素的样式信息
    const iconStyle = new Style({
      text: new Text({
        text: a.nameCn,
        offsetX: 0,
        offsetY: 40,
        textAlign: 'center',
        backgroundFill: new Fill({
          color: 'rgba(0,0,0)'
        }),
        fill: new Fill({
          color: '#fff'
        }),
        font: '16px sans-self',
        textBaseline: 'bottom',
        padding: [4, 4, 4, 4]
      }),

      image: new Icon({
        src: iconMetro,
        width: 30,
        height: 30
      })
    })
    // 创建圆的样式

    const cricleStyle = new Style({
      fill: new Fill({
        color: 'rgba(32,157,230,0.4)'
      })
    })
    let transData = window.bMapTransQQMap(a.longitude, a.latitude)
    // 点要素的集合信息
    const iconFeature = new Feature({
      geometry: new Point([transData.lng, transData.lat]),
      name: a.nameCn,
      population: 4000,
      // 属性信息
      stationId: a.id,
      lineId: a.lineId,
      rainfall: 500
    })
    iconFeature.setStyle(iconStyle)

    // 创建一个圆形范围
    const circleFeature = new Feature({
      geometry: new Circle([transData.lng, transData.lat], getRadius(800))
    })
    circleFeature.setStyle(cricleStyle)

    // metros.push(circleFeature)
    metros.push(iconFeature)
  })
  const vectorSource = new VectorSource({
    features: [...metros]
  })

  // 数据图层
  MetroData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 100
  })

  map.addLayer(MetroData.mapGroup)
}
// 更新停车场图层
const updateLayerParking = (list, showMetroDot) => {
  // 清除之前的数据
  if (ParkingData.mapGroup) {
    map.removeLayer(ParkingData.mapGroup)
    ParkingData.mapGroup = null
  }
  ParkingData.origin = list
  let metros = []
  ParkingData.mapData = ParkingData.origin.map((a: any) => {
    // 点要素的样式信息
    const iconStyle = new Style({
      text: new Text({
        text: a.parkName,
        offsetX: 0,
        offsetY: 40,
        textAlign: 'center',
        backgroundFill: new Fill({
          color: 'rgba(122,0,0)'
        }),
        fill: new Fill({
          color: '#fff'
        }),
        font: '16px sans-self',
        textBaseline: 'bottom',
        padding: [4, 4, 4, 4]
      }),

      image: new Icon({
        src: iconParking,
        width: 60,
        height: 60
      })
    })

    // 点要素的集合信息
    const iconFeature = new Feature({
      geometry: new Point([a.longitude, a.latitude]),
      parkId: a.parkId,
      population: 4000,
      rainfall: 500
    })
    iconFeature.setStyle(iconStyle)

    metros.push(iconFeature)
  })

  const vectorSource = new VectorSource({
    features: [...metros]
  })

  // 数据图层
  ParkingData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 100
  })

  map.addLayer(ParkingData.mapGroup)
}
// 更新共享单车图层
const updateLayerBicycleDot = (list, showMetroDot) => {
  BicycleData.origin = list
  let metros = []
  BicycleData.mapData = BicycleData.origin.map((a: any) => {
    // 点要素的样式信息
    const iconStyle = new Style({
      text: new Text({
        text: a.nameCn,
        offsetX: 0,
        offsetY: 40,
        textAlign: 'center',
        backgroundFill: new Fill({
          color: 'rgba(122,0,0)'
        }),
        fill: new Fill({
          color: '#fff'
        }),
        textBaseline: 'bottom',
        font: '16px sans-self',
        padding: [4, 4, 4, 4]
      }),

      image: new Icon({
        src: iconBicycle,
        width: 60,
        height: 60
      })
    })

    // 点要素的集合信息
    const iconFeature = new Feature({
      geometry: new Point([a.longitude, a.latitude]),
      name: a.nameCn,
      population: 4000,
      rainfall: 500
    })
    iconFeature.setStyle(iconStyle)

    metros.push(iconFeature)
  })

  const vectorSource = new VectorSource({
    features: [...metros]
  })

  // 数据图层
  BicycleData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 100
  })

  map.addLayer(BicycleData.mapGroup)
}
// 更新公交车站图层
const updateLayerBusDot = (list, showMetroDot) => {
  // 清除之前的数据
  if (BusData.mapGroup) {
    map.removeLayer(BusData.mapGroup)
    BusData.mapGroup = null
  }
  BusData.origin = list
  let metros = []
  BusData.mapData = BusData.origin.map((a: any) => {
    // 点要素的样式信息
    const iconStyle = new Style({
      // text: new Text({
      //   text: a.busLineName,
      //   offsetX: 0,
      //   offsetY: 40,
      //   textAlign: 'center',
      //   backgroundFill: new Fill({
      //     color: 'rgba(122,0,0)'
      //   }),
      //   fill: new Fill({
      //     color: '#fff'
      //   }),
      //   textBaseline: 'bottom',
      //   font: '14px sans-self',
      //   padding: [4, 4, 4, 4]
      // }),

      image: new Icon({
        src: iconBus,
        width: 32,
        height: 32
      })
    })

    // 点要素的集合信息
    const iconFeature = new Feature({
      geometry: new Point([a.lng, a.lat]),
      name: a.nameCn,
      busName: a.busName,
      busLineName: a.busLineName,
      population: 4000,
      rainfall: 500
    })
    iconFeature.setStyle(iconStyle)

    metros.push(iconFeature)
  })

  const vectorSource = new VectorSource({
    features: [...metros]
  })

  // 数据图层
  BusData.mapGroup = new VectorLayer({
    source: vectorSource,
    zIndex: 100
  })

  map.addLayer(BusData.mapGroup)
}

const getRadius = (radius) => {
  let metersPerUnit = map.getView().getProjection().getMetersPerUnit()
  let circleRadius = radius / metersPerUnit
  return circleRadius
}

// 通过下拉菜单定位车站
const positionDot = (dot: any) => {
  if (!(dot && dot.latitude && dot.longitude)) {
    ElMessage.warning('没有有效的位置信息')
  } else if (!map) {
    ElMessage.warning('地图初始化未完成...')
  } else {
    let transData = window.bMapTransQQMap(dot.longitude, dot.latitude)
    // 传入经纬度，设置地图中心点
    let position = [transData.lng, transData.lat] // 标准写法
    map.getView().animate({
      center: position, // 中心点
      zoom: 16, //放大
      rotation: undefined, // 缩放完成view视图旋转弧度
      duration: 1000 // 缩放持续时间，默认不需要设置
    })
    // 通知父级组件点选
    emit('positionDotEvt', dot)
    drawcircleDot(transData.lng, transData.lat)
  }
}

onMounted(async () => {
  await initMap()
})

defineExpose({
  drawLayerTrainDot,
  changeLayerVisible,
  updateLayerBusDot,
  updateLayerBicycleDot,
  updateLayerParking,
  positionDot,
  zoomBack,
  drawHeatMap
})
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

.dot {
  color: red;
}
.btn {
  position: absolute;
  top: 0;
  z-index: 100;
}
.tip-item {
  position: absolute;
  bottom: 10px;
  left: 380px;
  z-index: 1000;
  list-style: none;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  margin: 0;
  li {
    display: inline-block;
    padding: 0;
    margin: 0;
    span {
      display: inline-block;
      width: 80px;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
