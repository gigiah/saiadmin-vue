<template>
  <a-select :key="myKey" v-bind="props" :options="bizDict.$state[dictKey]" placeholder="请选择"></a-select>
</template>

<script setup>
import {useBizDictStore} from "@/store";
import {onMounted, ref, watch} from "vue";
const bizDict = useBizDictStore();
const props = defineProps({
  productId: {
    type: Number,
    required: false
  }
});
const myKey = ref(0);

let dictKey = 'pricingCraft4Search';

watch(() => bizDict.$state[dictKey], (newVal) => {
  console.log('pricingCraft4Search', bizDict.$state[dictKey]);
  myKey.value += 1;
});

onMounted(() => {
  console.log('productId', props.productId);
  if (props.productId) {
    dictKey = `${props.productId}_pricingCraft4Search`;
    if (!bizDict.$state[dictKey] || bizDict.$state[dictKey].length === 0) {
    bizDict.fetchPricingCraft4Search(props.productId);
    }
  }
  // if (!bizDict.$state['pricingCraft4Search'] || bizDict.$state['pricingCraft4Search'].length === 0) {
  //   bizDict.fetchPricingCraft4Search();
  // } else {
  //   console.log('pricingCraft4Search', bizDict.$state['pricingCraft4Search']);
  //   myKey.value += 1;
  // }
})

</script>

<style scoped>
</style>