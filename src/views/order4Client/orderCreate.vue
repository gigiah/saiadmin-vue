<template>
  <div>
    <div class="p-4 ma-content-block lg:flex gap-4">
      <a-button type="primary" size="mini" @click="onAddStore">选择门店</a-button>
      <a-button type="primary" size="mini" @click="onSelectAll">选择全部</a-button>
      <a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">发起审订</a-button>
      <a-button type="primary" size="mini" @click="onDeleteBatch" :disabled="submitDisabled">批量删除</a-button>
    </div>
    <a-checkbox-group style="display: block" v-model="checkedValues">
      <order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged"></order-card>
    </a-checkbox-group>
    <add-store-modal :visible="addStoreModalVisible" @add-success="handleAddStoreSuccess" @add-cancel="addStoreModalVisible = false" />
  </div>
</template>

<script setup>
import orderApi from '@/api/order';
import storeApi from '@/api/store';
import {onMounted, ref, computed} from "vue";
import OrderCard from "@/views/order4Client/components/orderCard.vue";
import {useBizDictStore} from "@/store";
import AddStoreModal from "@/views/order4Client/components/addStoreModal.vue";
import {Message, Modal} from "@arco-design/web-vue";

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

function getOrders() {
  orderApi.orderTree({
    status: 0, // 0: 录入中
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
    title: '确认发起审订',
    content: '是否确认发起审订？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: checkedValues.value,
        value: '审订中',
      }).then(value => {
        if (value.code === 200) {
          Message.success('提交成功');
          checkedValues.value = [];
          getOrders();
        }
      })
    }
  });
}

function onOrderChanged() {
  console.log('订单变更');
  getOrders();
}

function handleAddStoreSuccess() {
  console.log('添加门店成功');
  addStoreModalVisible.value = false;
  getOrders();
}

function onDeleteBatch() {
  Modal.confirm({
    title: '确认删除',
    content: '是否确认删除选中的订单？',
    onOk: () => {
      orderApi.handleDelete(checkedValues.value.map((id) => {
        return {
          type: "order",
          id: id,
        }
      })).then(value => {
        if (value.code === 200) {
          Message.success('删除成功');
          checkedValues.value = [];
          getOrders();
        }
      })
    }
  });
}

function onSelectAll() {
  checkedValues.value = orders.value.map((item) => item.id);
}
</script>

<style scoped>
</style>