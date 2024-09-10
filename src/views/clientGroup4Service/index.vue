<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini">
          <a-link @click="viewItems(record)"><icon-menu />查看服务人员</a-link>
        </a-space>
      </template>
    </ma-crud>
    <client-service ref="itemRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/api/clientGroup'
import { Message } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'
import clientService from '@/views/clientService/index.vue'

const crudRef = ref()
const itemRef = ref()

const sysInfoStore = useSysInfoStore()

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
  add: {
    show: false,
    api: api.save,
    // auth: ['/clientGroup/save']
  },
  edit: {
    show: false,
    api: api.update,
    // auth: ['/clientGroup/update']
  },
  delete: {
    show: false,
    api: api.delete,
    // auth: ['/clientGroup/destroy']
  },
  recovery: {
    show: false,
    api: api.recovery,
    // auth: ['/clientGroup/recovery']
  },
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
    title: '人员ID',
    dataIndex: 'sys_user_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '人员ID必填' }],
  },
  {
    title: '公司名称',
    dataIndex: 'company_name',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    rules: [{ required: true, message: '公司名称必填' }],
  },
  {
    title: '品牌名称',
    dataIndex: 'brand_name',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    // commonRules: [{ required: true, message: '品牌名称必填' }],
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    rules: [{ required: true, message: '联系人必填' }],
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    rules: [{ required: true, message: '手机号必填' }],
  },
  {
    title: '微信号',
    dataIndex: 'wechat',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    // commonRules: [{ required: true, message: '微信号必填' }],
  },
  {
    title: '客户级别',
    dataIndex: 'level_type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/clientLevelType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    // commonRules: [{ required: false, message: '客户级别必填' }],
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
