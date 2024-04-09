<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/notice'
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
    add: { show: true, api: api.save, auth: ['/notice/save'] },
    edit: { show: true, api: api.update, auth: ['/notice/update'] },
    delete: { show: true, api: api.delete, auth: ['/notice/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/notice/recovery']},
    formOption: { width: 800 },
  })

  const columns = reactive([
    {
      title: '编号',
      dataIndex: 'id',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: true, message: '编号必填' }],
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '公告标题必填' }],
    },
    {
      title: '公告内容',
      dataIndex: 'content',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '公告内容必填' }],
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 180,
      search: false,
      addDisplay: true, addDefaultValue: 100,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: false, message: '排序必填' }],
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
