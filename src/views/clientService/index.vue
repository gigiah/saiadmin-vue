<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/clientService'
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
    add: { show: true, api: api.save, auth: ['/clientService/save'] },
    edit: { show: true, api: api.update, auth: ['/clientService/update'] },
    delete: { show: true, api: api.delete, auth: ['/clientService/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/clientService/recovery']},
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
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '人员ID必填' }],
    },
    {
      title: '客户ID',
      dataIndex: 'client',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '客户ID必填' }],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: true,
      addDisplay: true, addDefaultValue: 1,
      editDisplay: true,
      hide: false,
      dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
      formType: 'radio',
      commonRules: [{ required: false, message: '状态必填' }],
    },
    {
      title: '财务专员',
      dataIndex: 'finance_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '财务专员必填' }],
    },
    {
      title: '客服专员',
      dataIndex: 'service_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '客服专员必填' }],
    },
    {
      title: '印前专员',
      dataIndex: 'preprint_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '印前专员必填' }],
    },
    {
      title: '营销专员',
      dataIndex: 'market_sys_id',
      width: 100,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      
      formType: 'select',
      commonRules: [{ required: false, message: '营销专员必填' }],
    },
    {
      title: '创建者',
      dataIndex: 'created_by',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: false,
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
