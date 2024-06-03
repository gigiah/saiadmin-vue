<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini">
          <a-link @click="viewItems(record)"><icon-menu />反馈明细</a-link>
        </a-space>
      </template>
    </ma-crud>
    <feebackItem ref="itemRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/orderFeedback'
import feebackItem from '@/views/orderFeedbackItem/index.vue'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const itemRef = ref()

const viewItems = (record) => {
  itemRef.value.open(record)
}


const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: false, api: api.save, auth: ['/orderFeedback/save'] },
  edit: { show: true, text:'查看内容', api: api.update, auth: ['/orderFeedback/update'] },
  delete: { show: false, api: api.delete, auth: ['/orderFeedback/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/orderFeedback/recovery'] },
  formOption: { width: 800 },
})

const columns = reactive([
  {
    title: '主键',
    dataIndex: 'id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: true, message: '主键必填' }],
  },
  {
    title: '订单ID',
    dataIndex: 'order_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
  },
  {
    title: '订单号',
    dataIndex: 'order_code',
    width: 200,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '订单号必填' }],
  },
  {
    title: '反馈内容',
    dataIndex: 'summary',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '反馈内容必填' }],
  },
  // {
  //   title: '人员ID',
  //   dataIndex: 'sys_user_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: true, 
  //   editDisplay: true,
  //   hide: false,

  //   formType: 'select',
  //   commonRules: [{ required: false, message: '人员ID必填' }],
  // },
  {
    title: '门店',
    dataIndex: 'store_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    disabled: true,
    dict: {
      url: '/store/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    commonRules: [{ required: false, message: '门店ID必填' }],
  },
  {
    title: '订单产品',
    dataIndex: 'order_goods_ids',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    multiple: true,
    disabled: true,
    dict: {
      url: '/orderGoods/index?type=all',
      // params: { order_id: order_id },
      props: { label: 'product_name', value: 'id' },
      translation: true,
    },
    editDefaultValue: async (record) => {
      const response = await api.read(record.id)
      return response.data.order_goods_list.map((item) => item.id)
    },
    commonRules: [{ required: false, message: '订单产品必填' }],
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { name: 'bizFeedBackOrderStatus', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '状态必填' }],
  },
  {
    title: '创建者',
    dataIndex: 'created_by',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '创建者必填' }],
  },
  {
    title: '更新者',
    dataIndex: 'updated_by',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '更新者必填' }],
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 180,
    search: true,
    addDisplay: false,
    editDisplay: false,
    hide: false,
    searchFormType: 'range',
    showTime: true,
    formType: 'date',
    commonRules: [{ required: false, message: '创建时间必填' }],
  },
  {
    title: '修改时间',
    dataIndex: 'update_time',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    searchFormType: 'range',
    showTime: true,
    formType: 'date',
    commonRules: [{ required: false, message: '修改时间必填' }],
  },
])
</script>
