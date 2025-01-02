<template>
  <!-- <a-select v-bind="props" allow-search="true" :options="bizDict.$state['warehouseAddress']" placeholder="请选择"></a-select> -->
  <a-select :disabled="isDisabled" :key="myKey" v-bind="props" :allow-search="true" :options="bizDict.$state[dictKey]"
    placeholder="请选择"></a-select>
</template>

<script setup>
import { useBizDictStore } from "@/store";
import { onMounted, ref, watch } from "vue";

const bizDict = useBizDictStore();
const props = defineProps({
  storeId: { type: Number, default: 0 },
  isDisabled: { type: Boolean, default: false },
  allowDiffStore: { type: Number, default: 0 }
});

let dictKey = 'warehouseAddress';
const myKey = ref(0);

watch(() => bizDict.$state[dictKey], (newVal) => {
  console.log('warehouseAddress', bizDict.$state[dictKey]);
  myKey.value += 1;
});

watch(() => props.storeId, (newVal) => {
  console.log('watch consignee select storeId', newVal);
  if (newVal) {
    dictKey = `${newVal}_warehouseAddress`;
    if (!bizDict.$state[dictKey] || bizDict.$state[dictKey].length === 0) {
      bizDict.fetchOrderWarehouse(newVal, props.allowDiffStore);
    }
  }
});

onMounted(() => {
  console.log('consignee select storeId', props.storeId);
  if (props.storeId) {
    dictKey = `${props.storeId}_warehouseAddress`;
    if (!bizDict.$state[dictKey] || bizDict.$state[dictKey].length === 0) {
      bizDict.fetchOrderWarehouse(props.storeId, props.allowDiffStore);
    }
  }
})
</script>

<style scoped></style>