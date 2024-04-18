<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/billOrder'
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
    add: { show: true, api: api.save, auth: ['/billOrder/save'] },
    edit: { show: true, api: api.update, auth: ['/billOrder/update'] },
    delete: { show: true, api: api.delete, auth: ['/billOrder/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/billOrder/recovery']},
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
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '对账单ID必填' }],
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '订单ID必填' }],
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
