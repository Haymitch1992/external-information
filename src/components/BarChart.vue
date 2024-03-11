<template>
  <div class="colortable">
    <div class="row" v-for="(item, index) in props.list">
      <div :style="{ color: COLORS[index] ? COLORS[index] : '#FFF',width:'35px'}">No.{{ index + 1 }}</div>
      <div style="flex: 1; display: flex; flex-direction: column; margin-left: 10px">
        <div>
          <span style="float: left; margin-left: 10px">{{ item.value1 }}</span>
          <span style="float: right; margin-right: 5px">{{ item.value2 }}</span>
        </div>
        <div style="width: 100%; background-color: #1d3137; height: 5px">
          <div :style="{ width: item.rate, height: '5px' }" class="color"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['name1', 'name2', 'list'])
const COLORS: any = {
  0: '#faf081',
  1: '#60d7ff',
  2: '#ffb66d'
}
</script>

<style scoped>
.colortable {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.colortable .row {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.colortable .row div {
  line-height: auto;
}

.color {
  background: linear-gradient(to right, #1ee7e7, #178ffe);
}
</style>
