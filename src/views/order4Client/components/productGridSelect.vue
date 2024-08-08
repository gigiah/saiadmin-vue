<script setup>
import {useBizDictStore} from "@/store";
import {ref, watch} from "vue";
const props = defineProps();
const bizDict = useBizDictStore();
const myKey = ref(1);
watch(() => bizDict.$state['productGrade'], (newVal) => {
  myKey.value += 1;
});
</script>

<template>
  <a-select :key="myKey" v-bind="props" :options="bizDict.$state['productGrade']" placeholder="请选择"></a-select>
</template>

<style scoped>

</style>