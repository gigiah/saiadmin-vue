<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/pricingNonStandrd'
import { Message } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'

const crudRef = ref()
const sysInfoStore = useSysInfoStore()


const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: sysInfoStore.info.is_admin,
  operationColumnWidth: 160,
  add: { show: sysInfoStore.info.is_admin, api: api.save, auth: ['/pricingNonStandrd/save'] },
  edit: { show: sysInfoStore.info.is_admin, api: api.update, auth: ['/pricingNonStandrd/update'] },
  delete: { show: sysInfoStore.info.is_admin, api: api.delete, auth: ['/pricingNonStandrd/destroy'] },
  recovery: { show: sysInfoStore.info.is_admin, api: api.recovery, auth: ['/pricingNonStandrd/recovery'] },
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
    title: '非标编号',
    dataIndex: 'name',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '非标编号必填' }],
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '备注必填' }],
  },
  {
    title: 'K值',
    dataIndex: 'kvalue',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: 'K值必填' }],
  },
  {
    title: '基准值',
    dataIndex: 'base_value',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '基准值必填' }],
  },
  {
    title: '基准价',
    dataIndex: 'base_price',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '基准价必填' }],
  },
  {
    title: '挂靠产品',
    dataIndex: 'product_id',
    width: 100,
    search: sysInfoStore.info.is_admin,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/product/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    title: '挂靠工艺',
    dataIndex: 'craft_id',
    width: 100,
    search: sysInfoStore.info.is_admin,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/craft/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    title: '授权团队',
    dataIndex: 'dept_ids',
    width: 200,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: sysInfoStore.info.is_admin ? false : true,
    formType: 'select',
    multiple: true,
    dict: { url: '/core/dept/index?role_code=marketing', props: { label: 'name', value: 'id' }, translation: true },
    // commonRules: [{ required: false, message: '必填' }],
    editDefaultValue: async (record) => {
      const response = await api.read(record.id)
      return response.data.dept_list.map((item) => item.id)
    },
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
</script>
