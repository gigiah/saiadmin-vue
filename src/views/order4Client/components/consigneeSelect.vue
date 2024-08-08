<template>
  <a-select v-bind="props" :options="bizDict.$state['warehouseAddress']" placeholder="请选择"></a-select>
</template>

<script setup>
import {useBizDictStore} from "@/store";
const bizDict = useBizDictStore();
const props = defineProps();
</script>

<style scoped>

</style>