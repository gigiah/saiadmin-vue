<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/orderErrRecord'
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
    add: { show: true, api: api.save, auth: ['/orderErrRecord/save'] },
    edit: { show: true, api: api.update, auth: ['/orderErrRecord/update'] },
    delete: { show: true, api: api.delete, auth: ['/orderErrRecord/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/orderErrRecord/recovery']},
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
      title: '订单号',
      dataIndex: 'order_code',
      width: 100,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: true, message: '订单号必填' }],
    },
    {
      title: '原订单金额',
      dataIndex: 'origin_total',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '原订单金额必填' }],
    },
    {
      title: '新订单金额',
      dataIndex: 'new_total',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '新订单金额必填' }],
    },
    {
      title: '退款金额',
      dataIndex: 'refund_total',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '退款金额必填' }],
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
      commonRules: [{ required: true, message: '备注必填' }],
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
