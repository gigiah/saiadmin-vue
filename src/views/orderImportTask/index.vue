<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/orderImportTask'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()


  const crud = reactive({
    api: api.getPageList,
    recycleApi: api.getRecyclePageList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: false },
    operationColumn: false,
    operationColumnWidth: 160,
    add: { show: false, api: api.save, auth: ['/orderImportTask/save'] },
    edit: { show: false, api: api.update, auth: ['/orderImportTask/update'] },
    delete: { show: false, api: api.delete, auth: ['/orderImportTask/destroy'] },
    recovery: { show: false, api: api.recovery, auth: ['/orderImportTask/recovery']},
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
      title: '客方团队',
      dataIndex: 'client_group_id',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '客方团队必填' }],
    },
    {
      title: '客方',
      dataIndex: 'client_id',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '客方必填' }],
    },
    {
      title: '人员ID',
      dataIndex: 'sys_user_id',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '人员ID必填' }],
    },
    {
      title: '导入文件',
      dataIndex: 'file_title',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '状态描述必填' }],
    },
    {
      title: '状态描述',
      dataIndex: 'reason',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '状态描述必填' }],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: true,
      addDisplay: true, addDefaultValue: 1,
      editDisplay: true,
      hide: false,
      dict: { data: [{"label":"导入中","value":1},{"label":"成功","value":3},{"label":"失败","value":4}], translation: true },
      formType: 'select',
      commonRules: [{ required: false, message: '状态必填' }],
    },
    {
      title: '完成时间',
      dataIndex: 'finish_time',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: true,
      searchFormType: 'range',
      showTime: true,
      formType: 'date',
      commonRules: [{ required: false, message: '完成时间必填' }],
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
      title: '导入时间',
      dataIndex: 'create_time',
      width: 180,
      search: false,
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
