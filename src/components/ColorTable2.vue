<template>
  <div class="colortable">
    <!-- <div class="row" style="background-color: #093c4d">
      <div style="flex: 1">{{ name0 }}</div>
      <div style="flex: 2">{{ name1 }}</div>
      <div style="flex: 2">{{ name2 }}</div>
    </div> -->
    <el-tooltip
      effect="dark"
      :content="`${item.value0}\n${item.value1}\n${item.value2}`"
      placement="left-start"
      v-for="(item, index) in props.list"
    >
      <div class="row">
        <div :style="{ color: COLORS[index] ? COLORS[index] : '#FFF', flex: 1 }">
          {{ item.value0 }}
        </div>
        <div style="flex: 2">{{ item.value1 }}</div>
        <div style="flex: 2">{{ item.value2 }}</div>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps(['name0', 'name1', 'name2', 'list'])
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
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>
