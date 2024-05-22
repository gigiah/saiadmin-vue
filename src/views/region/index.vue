<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/region'
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
    add: { show: true, api: api.save, auth: ['/region/save'] },
    edit: { show: true, api: api.update, auth: ['/region/update'] },
    delete: { show: true, api: api.delete, auth: ['/region/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/region/recovery']},
    formOption: { width: 800 }
  })

  const columns = reactive([
    {
      title: '区划信息ID',
      dataIndex: 'id',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: true, message: '区划信息ID必填' }],
    },
    {
      title: '区划名称',
      dataIndex: 'name',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '区划名称必填' }],
    },
    {
      title: '父级ID',
      dataIndex: 'parent_id',
      width: 100,
      search: false,
      addDisplay: true,
      editDisplay: true,
      hide: false,
      formType: 'treeSelect',
      addDefaultValue: 0,
      dict: { url: '/region/index?tree=true' },
      commonRules: [{ required: true, message: '父级ID必填' }],
    },
    {
      title: '区划编码',
      dataIndex: 'code',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '区划编码必填' }],
    },
    {
      title: '层级',
      dataIndex: 'level',
      width: 180,
      search: false,
      addDisplay: true, 
      addDefaultValue: 1,
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '层级必填' }],
    },
  ])
</script>
