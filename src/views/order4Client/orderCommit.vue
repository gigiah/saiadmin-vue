<template>
  <div>
    <div class="p-4 ma-content-block lg:flex gap-4">
      <a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
      <a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">提交生产</a-button>
<!--      <a-button type="primary" size="mini" @click="onDeleteBatch" :disabled="submitDisabled">批量删除</a-button>-->
    </div>
    <a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
      <order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged" scene="commit"></order-card>
    </a-checkbox-group>
    <add-store-modal :visible="addStoreModalVisible" @add-success="handleAddStoreSuccess" @add-cancel="addStoreModalVisible = false" />
    <modal :visible="addCouponModalVisible" title="选择卡券" @ok="onAddCouponOk" @cancel="onAddCouponCancel">
      <a-select :key="couponKey" v-model="couponSelected" placeholder="请选择" :options="couponList" />
    </modal>
  </div>
</template>

<script setup>
import orderApi from '@/api/order';
import storeApi from '@/api/store';
import couponItemApi from '@/api/couponItem';
import {onMounted, ref, computed} from "vue";
import OrderCard from "@/views/order4Client/components/orderCard.vue";
import {useBizDictStore} from "@/store";
import AddStoreModal from "@/views/order4Client/components/addStoreModal.vue";
import {Message, Modal} from "@arco-design/web-vue";
import {request} from "@/utils/request";

const stores = ref([]);
const orders = ref([]);
const bizDict = useBizDictStore();
const addStoreModalVisible = ref(false);
const checkedValues = ref([]);
const submitDisabled = computed(() => checkedValues.value.length === 0);

const onCheckUpdate = (result) => {
  checkedValues.value = result;
}

const addCouponModalVisible = ref(false);
const couponList = ref([]);
const couponSelected = ref();
const couponKey = ref(0);

const onAddCoupon = () => {
  addCouponModalVisible.value = true;
  couponSelected.value = undefined;
  request({
    url: '/couponItem/getUsableCoupon',
    method: 'get',
  }).then(value => {
    if (value.code === 200) {
      couponList.value = value.data;
      couponKey.value += 1;
    }
  });
}

const onAddCouponCancel = () => {
  addCouponModalVisible.value = false;
}

const onAddCouponOk = () => {
  addCouponModalVisible.value = false;
  couponItemApi.selectCoupon({
    id: couponSelected.value,
    option: 'select',
  }).then(res => {
    if (res.code === 200) {
      Message.success('卡券使用成功')
      getOrders();
    }
  })
}

onMounted(() => {
  getOrders();
  bizDict.flushDict('store', 'warehouseAddress', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit');
  bizDict.fetchPricingProduct4Search();
})

function getOrders() {
  orderApi.orderTree({
    status: 20, // 0: 录入中
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
    title: '确认提交生产',
    content: '是否确认提交生产？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: checkedValues.value,
        value: '审批中',
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