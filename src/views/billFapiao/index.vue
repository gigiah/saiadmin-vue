<template>
  <a-modal v-model:visible="visible" :width="1400" :footer="false">
    <template #title>发票内容</template>
    <div class="justify-between p-4 ma-content-block lg:flex">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
      </ma-crud>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/billFapiao'
import billApi from '@/api/bill'
import { Message } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'


const crudRef = ref()
const visible = ref(false)
const billId = ref()
const showAdd = ref(true)
const sysInfoStore = useSysInfoStore()

const open = (row) => {
  billId.value = row.id
  if (row.fapiao_method == 2) {
    showAdd.value = false
  } else {
    showAdd.value = true
  }
  visible.value = true
  crudRef.value.requestData()
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.bill_id = billId
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: showAdd, api: api.save },
  edit: { show: !sysInfoStore.info.is_client, api: api.update },
  delete: { show: true, api: api.delete },
  recovery: { show: true, api: api.recovery },
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
    title: '对账单ID',
    dataIndex: 'bill_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    addDefaultValue: billId,
    commonRules: [{ required: false, message: '对账单ID必填' }],
    addDefaultValue: billId
  },
  {
    title: '对账单号',
    dataIndex: 'bill_code',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '对账单号必填' }],
    addDefaultValue: async () => {
      const bill = await billApi.read(billId.value)
      return bill.name
    }
  },
  {
    title: '发票抬头',
    dataIndex: 'fapiao_title',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '发票抬头必填' }],
  },
  {
    title: '发票税号',
    dataIndex: 'company_code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
  },
  {
    title: '发票金额',
    dataIndex: 'fapiao_total',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '发票金额必填' }],
  },
  // {
  //   title: '支付凭证',
  //   dataIndex: 'payment_credit_url',
  //   width: 180,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'input',
  //   commonRules: [{ required: false, message: '支付凭证必填' }],
  // },
  {
    title: '发票下载',
    dataIndex: 'fapiao_url',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'file',
    disabled: sysInfoStore.info.is_client,
    commonRules: [{ required: false, message: '发票下载必填' }],
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
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
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

defineExpose({ open })
</script>
