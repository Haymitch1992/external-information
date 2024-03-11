<template>
  <div class="colortable">
    <div class="row" style="background-color: #093c4d">
      <div>序号</div>
      <div>{{ name1 }}</div>
      <div>{{ name2 }}</div>
    </div>
    <div class="row" v-for="(item, index) in props.list">
      <div :style="{ color: COLORS[index] ? COLORS[index] : '#FFF' }">No.{{ index + 1 }}</div>
      <div>{{ item.value1 }}</div>
      <div>{{ item.value2 }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
  flex: 1;
  line-height: 35px;
}
</style>
