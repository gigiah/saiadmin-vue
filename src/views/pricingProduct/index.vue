<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/pricingProduct'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()


  const crud = reactive({
    api: api.getPageList,
    recycleApi: api.getRecyclePageList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 160,
    add: { show: true, api: api.save, auth: ['/pricingProduct/save'] },
    edit: { show: true, api: api.update, auth: ['/pricingProduct/update'] },
    delete: { show: true, api: api.delete, auth: ['/pricingProduct/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/pricingProduct/recovery']},
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
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '人员ID必填' }],
    },
    {
      title: '客方',
      dataIndex: 'client_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '客方必填' }],
    },
    {
      title: '产品',
      dataIndex: 'product_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      dict: { url: '/product/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
      formType: 'select',
      commonRules: [{ required: false, message: '产品必填' }],
    },
    {
      title: '标准单价',
      dataIndex: 'price',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '标准单价必填' }],
    },
    {
      title: '最低限价',
      dataIndex: 'price_min',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '最低限价必填' }],
    },
    {
      title: '最高限价',
      dataIndex: 'price_max',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '最高限价必填' }],
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
      addDisplay: true, 
      editDisplay: true,
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
