<script setup>
import {useBizDictStore} from "@/store";

const bizDict = useBizDictStore();

const props = defineProps();
</script>

<template>
  <a-select v-bind="props" :options="bizDict.$state['store']" placeholder="请选择" :allow-search="true"></a-select>
</template>

<style scoped>

</style>