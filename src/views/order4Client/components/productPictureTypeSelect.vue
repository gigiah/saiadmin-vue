<template>
  <a-select :key="myKey" v-bind="props" :options="bizDict.$state['productPictureType']" placeholder="请选择"></a-select>
</template>

<script setup>
import {useBizDictStore} from "@/store";
import {ref, watch} from "vue";
const bizDict = useBizDictStore();
const props = defineProps();
const myKey = ref(0);
watch(() => bizDict.$state['productPictureType'], (newVal) => {
  myKey.value += 1;
});

</script>

<style scoped>
</style>