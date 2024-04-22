<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/bill'
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
    add: { show: true, api: api.save, auth: ['/bill/save'] },
    edit: { show: true, api: api.update, auth: ['/bill/update'] },
    delete: { show: true, api: api.delete, auth: ['/bill/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/bill/recovery']},
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
      title: '对账单名',
      dataIndex: 'name',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '对账单名必填' }],
    },
    {
      title: '汇总金额',
      dataIndex: 'total',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '汇总金额必填' }],
    },
    {
      title: '对账单金额',
      dataIndex: 'bill_total',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 0.00,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '对账单金额必填' }],
    },
    {
      title: '提交对账单',
      dataIndex: 'manual_excel',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '提交对账单必填' }],
    },
    {
      title: '对账单类型:1=现结 2=月结',
      dataIndex: 'type',
      width: 100,
      search: true,
      addDisplay: true, addDefaultValue: 1,
      editDisplay: true,
      hide: false,
      dict: { name: 'bizBillType', props: { label: 'label', value: 'value' }, translation: true },
      formType: 'select',
      commonRules: [{ required: true, message: '对账单类型:1=现结 2=月结必填' }],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      dict: { name: 'bizBillStatus', props: { label: 'label', value: 'value' }, translation: true },
      formType: 'select',
      commonRules: [{ required: false, message: '状态必填' }],
    },
    {
      title: '客服人员',
      dataIndex: 'service_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '客服人员必填' }],
    },
    {
      title: '财务人员',
      dataIndex: 'finance_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '财务人员必填' }],
    },
    {
      title: '客方人员',
      dataIndex: 'client_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '客方人员必填' }],
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
