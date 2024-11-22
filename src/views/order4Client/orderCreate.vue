<template>
  <div>
    <order-create-search @search="getOrders" />
    <div class="gap-4 p-4 ma-content-block lg:flex">
      <a-button type="primary" size="mini" @click="onAddStore">选择门店</a-button>
      <a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
      <a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">发起审订</a-button>
      <a-button type="primary" size="mini" @click="onDeleteBatch" :disabled="submitDisabled">批量删除</a-button>
      <!-- <div class="gap-4 lg:flex" style="margin-left: 40%;">
        <a-button type="primary" size="mini" @click="onExportBatch">导出表格</a-button>
        <a-upload :show-file-list="false" :custom-request="onImport">
          <template #upload-button>
            <a-button type="primary" size="mini">导入表格</a-button>
          </template>
        </a-upload>
      </div> -->
    </div>
    <a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
      <order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged"
        scene="create"></order-card>
    </a-checkbox-group>
    <add-store-modal :visible="addStoreModalVisible" @add-success="handleAddStoreSuccess"
      @add-cancel="addStoreModalVisible = false" />
  </div>
</template>

<script setup>
import orderApi from '@/api/order';
import storeApi from '@/api/store';
import { onMounted, ref, computed } from "vue";
import OrderCard from "@/views/order4Client/components/orderCard.vue";
import { useBizDictStore } from "@/store";
import AddStoreModal from "@/views/order4Client/components/addStoreModal.vue";
import { Message, Modal } from "@arco-design/web-vue";
import OrderCreateSearch from "@/views/order4Client/components/orderCreateSearch.vue";

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
  bizDict.flushDict('store', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit');
  bizDict.fetchPricingProduct4Search('', '', 'client');
})

function getOrders(params = {}) {
  orderApi.orderTree({
    status: [0], // 0: 录入中
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
  checkedValues.value = [];
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

// const exportBill = async (record) => {
//   let res = await api.exportBillExcel({ id: record.id })
//   window.location.href = res.data.filePath
// }

function onExportBatch() {
  Modal.confirm({
    title: '确认导出',
    content: '是否确认导出选中的订单？',
    onOk: () => {
      orderApi.orderExport({
        ids: checkedValues.value,
        // value: '审订中',
      }).then(res => {
        if (res.code === 200) {
          window.location.href = res.data.filePath
        }
      })
    }
  });
}

function onImport(fileOption) {
  Message.info('文件上传导入中...')
  const dataForm = new FormData()
  dataForm.append('file', fileOption.fileItem.file)
  console.log(fileOption);
  console.log(dataForm);
  orderApi.orderImport(dataForm).then(res => {
    res.code === 200 && Message.info('导入成功，请等待系统解析')
  })
}

// function onExportBatch() {
//   Modal.confirm({
//     title: '确认导出',
//     content: '是否确认导出选中的订单？',
//     onOk: () => {
//       orderApi.orderExport(checkedValues.value.map((id) => {
//         return {
//           id: id,
//         }
//       })).then(value => {
//         if (value.code === 200) {
//           Message.success('导出成功，请等待下载');
//           // checkedValues.value = [];
//           // getOrders();
//         }
//       })
//     }
//   });
// }

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

<style scoped></style>