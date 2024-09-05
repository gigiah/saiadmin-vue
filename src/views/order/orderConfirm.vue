<template>
  <div>
    <order-confirm-search @search="getOrders" />
    <div class="gap-4 p-4 ma-content-block lg:flex">
      <a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
      <a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">通过</a-button>
      <a-button type="primary" size="mini" status="danger" @click="onDeleteBatch" :disabled="submitDisabled">打回</a-button>
    </div>
    <a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
      <order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged" scene="confirm"></order-card>
    </a-checkbox-group>
  </div>
</template>

<script setup>
import orderApi from '@/api/order';
import storeApi from '@/api/store';
import {onMounted, ref, computed} from "vue";
import OrderCard from "@/views/order/components/orderCard.vue";
import {useBizDictStore} from "@/store";
import {Message, Modal} from "@arco-design/web-vue";
import OrderConfirmSearch from "@/views/order/components/orderConfirmSearch.vue";

const stores = ref([]);
const orders = ref([]);
const bizDict = useBizDictStore();
const addStoreModalVisible = ref(false);
const checkedValues = ref([]);
const submitDisabled = computed(() => checkedValues.value.length === 0);

const onCheckUpdate = (result) => {
  checkedValues.value = result;
}

onMounted(() => {
  getOrders();
  bizDict.flushDict('store', 'warehouseAddress', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit');
  bizDict.fetchPricingProduct4Search();
})

function getOrders(params = {}) {
  orderApi.orderTree({
    status: 40, // 0: 录入中
    ...params
  }).then(res => {
    orders.value = res.data;
  })
}

function getAllStore() {
  storeApi.getPageList({
    type: 'all'
  }).then(res => {
    console.log(res);
    stores.value = res.data;
  })
}

function onAddStore() {
  console.log('添加门店');
  addStoreModalVisible.value = true;
}


function onSubmitOrder() {
  Modal.confirm({
    title: '确认',
    content: '是否确认？',
    onOk: () => {
      orderApi.handleOrderChange({
        // ids: [props.order.id],
        ids: checkedValues.value,
        value: '生产中',
      }).then(value => {
        if (value.code === 200) {
          Message.success('提交成功');
          // emit('changed');
          getOrders()
        }
      })
    }
  });
}

function onDeleteBatch() {
  Modal.confirm({
    title: '确认',
    content: '是否确认？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: [props.order.id],
        value: '审订中',
      }).then(value => {
        if (value.code === 200) {
          Message.success('提交成功');
          emit('changed');
        }
      })
    }
  });
}

function onOrderChanged() {
  console.log('订单变更');
  checkedValues.value = [];
  getOrders();
}

function handleAddStoreSuccess() {
  console.log('添加门店成功');
  addStoreModalVisible.value = false;
  getOrders();
}

let isSelectAll = computed(() => {
  return checkedValues.value.length === orders.value.length;
})

function onSelectAll() {
  if (!isSelectAll.value) {
    checkedValues.value = orders.value.map((item) => item.id);
  } else {
    checkedValues.value = [];
  }
}
</script>

<style scoped>
</style>