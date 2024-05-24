<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/warehouseAddress'
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
    add: { show: true, api: api.save, auth: ['/warehouseAddress/save'] },
    edit: { show: true, api: api.update, auth: ['/warehouseAddress/update'] },
    delete: { show: true, api: api.delete, auth: ['/warehouseAddress/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/warehouseAddress/recovery']},
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
      title: '名称',
      dataIndex: 'name',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '名称必填' }],
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '联系人必填' }],
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '手机号必填' }],
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '地址必填' }],
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
