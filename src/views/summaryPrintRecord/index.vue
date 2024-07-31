<template>
  <a-modal v-model:visible="visible" :width="1400" :footer="false">
    <template #title>受理记录</template>
    <div class="justify-between p-4 ma-content-block lg:flex">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
      </ma-crud>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/summaryPrintRecord'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const summaryOrderId = ref()
const visible = ref(false)

const open = (row) => {
  summaryOrderId.value = row.id
  visible.value = true
  crudRef.value.requestData()
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.summary_order_id = summaryOrderId
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: false },
  operationColumn: false,
  operationColumnWidth: 160,
  add: { show: true, api: api.save, auth: ['/summaryPrintRecord/save'] },
  edit: { show: true, api: api.update, auth: ['/summaryPrintRecord/update'] },
  delete: { show: true, api: api.delete, auth: ['/summaryPrintRecord/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/summaryPrintRecord/recovery'] },
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
    commonRules: [{ required: false, message: '主键必填' }],
  },
  {
    title: '汇总单ID',
    dataIndex: 'summary_order_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '汇总单ID必填' }],
  },
  {
    title: '人员',
    dataIndex: 'sys_id',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    dict: { url: '/core/user/index?type=all', props: { label: 'nickname', value: 'id' }, translation: true },
    commonRules: [{ required: false, message: '人员必填' }],
  },
  {
    title: '处理动作',
    dataIndex: 'action',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: true,
    dict: { name: 'bizSummaryRecordAction', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '处理动作必填' }],
  },
  {
    title: '当班印量',
    dataIndex: 'nums',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '打印数量必填' }],
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

defineExpose({ open })
</script>
