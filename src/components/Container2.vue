<template>
  <div class="container2">
    <div class="title">
      <p style="font-size: 1.1rem; font-weight: bold">{{ title }}</p>
    </div>
    <div class="data">
      <slot>暂无数据</slot>
    </div>
    <!-- 装饰 -->
    <div class="decoration d-top-left"></div>
    <div class="decoration d-top-right"></div>
    <div class="decoration d-bottom-left"></div>
    <div class="decoration d-bottom-right"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['title'])
</script>

<style scoped>
.container2 {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  background: #041a21;
  width: 345px;
  height: 480px;
  border: 1px solid #127798;
  box-sizing: border-box;
}

.title {
  height: 52px;
  background: linear-gradient(to right, #12779855, #12779811);
  border: solid;
  border-width: 0 0 1px 0;
  border-image: linear-gradient(to right, #1fc6ff00, 40%, #1fc6ff66, 60%, #1fc6ff00) 1;
}
.title > p {
  line-height: 52px;
  padding: 0;
  margin: 0 0 0 20px;
}
.data {
  flex: 1;
  text-align: center;
  padding: 10px;
  overflow: hidden;
}

.decoration {
  position: absolute;
}
.d-top-left {
  left: -1px;
  top: -1px;
  width: 40px;
  height: 1px;
  background: #1fc6ff;
}
.d1 {
  display: inline-block;
  width: 50px;
  border-bottom: 10px solid #1fc6ff;
  border-right: 10px solid transparent;
}
.d2 {
  display: inline-block;
  margin-left: 5px;
  width: 10px;
  height: 10px;
  background: #1fc6ff;
  transform: skewX(45deg);
}
.d-top-right {
  right: -1px;
  top: -1px;
  width: 40px;
  height: 1px;
  background: #1fc6ff;
}
.d-bottom-left {
  left: -1px;
  top: 51px;
  width: 40px;
  height: 1px;
  background: #1fc6ff;
}
.d-bottom-right {
  right: 1px;
  top: 50px;
  width: 20px;
  height: 4px;
  background: #1fc6ff;
  transform: skewX(-45deg);
}
</style>
