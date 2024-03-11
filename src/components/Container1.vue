<template>
  <div class="container1">
    <div>
      <p style="margin-bottom: 10px;font-size: 1.1rem;font-weight: bold;">{{ title }}</p>
      <p>
        <span class="value">{{ value }}</span
        >{{ unit }}
      </p>
    </div>
    <slot>默认LOGO</slot>

    <!-- 装饰 -->
    <div class="decoration d-top-left">
      <div class="d1"></div>
      <div class="d2" style="margin-left: 2px"></div>
      <div class="d2"></div>
      <div class="d2"></div>
    </div>
    <div class="decoration d-top-right"></div>
    <div class="decoration d-bottom-left"></div>
    <div class="decoration d-bottom-right"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['title', 'unit', 'value'])
</script>

<style scoped>
.container1 {
  height: 105px;
  width: 280px;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #127798;
  background: linear-gradient(#072c39, #0f5f7a);
  padding: 20px 20px 20px 20px;
}

.value {
  color: #f5e74f;
  font-size: 2.5rem;
  margin-right: 15px;
  font-family:DS-Digital;
}

.decoration {
  position: absolute;
}
.d-top-left {
  left: -1px;
  top: -6px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.d1 {
  display: inline-block;
  width: 50px;
  border-bottom: 6px solid #1fc6ff;
  border-right: 6px solid transparent;
}
.d2 {
  display: inline-block;
  margin-left: 5px;
  width: 6px;
  height: 6px;
  background: #1fc6ff;
  transform: skewX(45deg);
}
.d-top-right {
  right: 0;
  top: -1px;
  width: 40px;
  height: 1px;
  background: #1fc6ff;
}
.d-bottom-left {
  left: 0;
  bottom: -1px;
  width: 40px;
  height: 1px;
  background: #1fc6ff;
}
.d-bottom-right {
  right: 0;
  bottom: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid #1fc6ff;
}
</style>
