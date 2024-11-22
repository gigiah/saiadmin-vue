<template>
  <a-select :key="myKey" v-bind="props" allow-search="true" :options="bizDict.$state['pricingProduct4Search']" placeholder="请选择"></a-select>
</template>

<script setup>
import {useBizDictStore} from "@/store";
import {ref, watch} from "vue";
const bizDict = useBizDictStore();
const props = defineProps();
const myKey = ref(0);
watch(() => bizDict.$state['pricingProduct4Search'], (newVal) => {
  myKey.value += 1;
});

</script>

<style scoped>
</style>