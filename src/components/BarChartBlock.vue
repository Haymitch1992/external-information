<template>
  <div class="chart" id="chartdiv"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const props = defineProps(['name1', 'name2', 'list'])
const option = {
  grid: {
    left: 30,
    top: 10,
    right: 10,
    bottom: 45
  },
  title: {
    left: 0,
    top: 3,
    textStyle: {
      color: '#f0c953',
      fontSize: '13',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }
  },
  legend: {
    data: [],
    right: 0,
    top: 3,
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff'
      },
      rotate: 45
    },
    axisLine: { onZero: true },
    splitLine: { show: false },
    splitArea: { show: false },
    data: props.list.map((a: any) => a.value1)
  },
  tooltip: {
    trigger: 'item'
  },
  yAxis: {
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    splitLine: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitArea: { show: false }
  }
}

onMounted(() => {
  initChart()
})

async function initChart() {
  const chartzdl = echarts.init(document.getElementById('chartdiv'))
  const useOption = JSON.parse(JSON.stringify(option))
  useOption.xAxis.data = props.list.map((a: any) => a.value1)
  useOption.series = [
    {
      data: props.list.map((a: any) => a.value2),
      type: 'custom',
      renderItem: function (params: any, api: any) {
        const topAxis = api.coord([api.value(0), api.value(1)])
        const bottomAxis = api.coord([api.value(0), 0])

        const totalHeight = bottomAxis[1] - topAxis[1]
        const gap = 3 // 每个格子间的间距
        const height = 8
        const width = 12
        const count = Math.round(totalHeight / (height + gap))
        const rects = Array.from({ length: count }, (_, index) => {
          const realHeight = bottomAxis[1] - (height + gap) * index
          return {
            type: 'rect', //使用自定义注册类型！！！！！
            transition: 'all',
            x: 0,
            scaleX: 1,
            scaleY: 1,
            originX: bottomAxis[0] - 10 + width / 2,
            originY: realHeight - 10 + height / 2,
            enterFrom: {
              scaleX: 0.1,
              scaleY: 0.1,
              style: { opacity: 0 }
            },
            enterAnimation: {
              delay: 10 * index
            },
            updateAnimation: {
              delay: 10 * index
            },
            shape: {
              x: bottomAxis[0] - height,
              y: realHeight - height,
              width,
              height
            },
            style: {
              fill: '#1fc6ff'
            }
          }
        })
        rects.splice(0, 0, {
          type: 'rect', //使用自定义注册类型！！！！！
          transition: 'all',
          x: 0,
          scaleX: 1,
          scaleY: 1,
          originX: bottomAxis[0] - 10 + width / 2,
          originY: totalHeight - 10 + height / 2,
          enterFrom: {
            scaleX: 0.1,
            scaleY: 0.1,
            style: { opacity: 0 }
          },
          enterAnimation: {
            delay: 0
          },
          updateAnimation: {
            delay: 0
          },
          shape: {
            x: bottomAxis[0] - height,
            y: 0,
            width,
            height: bottomAxis[1]
          },
          style: {
            fill: '#1d3137'
          }
        })

        rects.splice(0, 0, {
          type: 'rect', //使用自定义注册类型！！！！！
          transition: 'all',
          x: 0,
          scaleX: 1,
          scaleY: 1,
          originX: bottomAxis[0] - 10 + width / 2,
          originY: totalHeight - 10 + height / 2,
          enterFrom: {
            scaleX: 0.1,
            scaleY: 0.1,
            style: { opacity: 0 }
          },
          enterAnimation: {
            delay: 0
          },
          updateAnimation: {
            delay: 0
          },
          shape: {
            x: bottomAxis[0] - height - 3,
            y: 0,
            width: 2,
            height: bottomAxis[1]
          },
          style: {
            fill: '#1d3137'
          }
        })

        rects.splice(0, 0, {
          type: 'rect', //使用自定义注册类型！！！！！
          transition: 'all',
          x: 0,
          scaleX: 1,
          scaleY: 1,
          originX: bottomAxis[0] - 10 + width / 2,
          originY: totalHeight - 10 + height / 2,
          enterFrom: {
            scaleX: 0.1,
            scaleY: 0.1,
            style: { opacity: 0 }
          },
          enterAnimation: {
            delay: 0
          },
          updateAnimation: {
            delay: 0
          },
          shape: {
            x: bottomAxis[0] - height + 13,
            y: 0,
            width: 2,
            height: bottomAxis[1]
          },
          style: {
            fill: '#1d3137'
          }
        })

        return {
          type: 'group',
          x: 0,
          y: 0,
          children: rects,

          showBackground: true,
          backgroundStyle: {
            color: '#273a41'
          },
          color: '#273a41'
        }
      },
      showBackground: true,
      backgroundStyle: {
        color: '#273a41'
      }
    }
  ]
  useOption.yAxis.minInterval = 1
  chartzdl.hideLoading()
  chartzdl.clear()
  chartzdl.resize()
  chartzdl.setOption(useOption, true)
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}
</style>
