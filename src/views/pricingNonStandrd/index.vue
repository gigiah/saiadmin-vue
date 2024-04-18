<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/pricingNonStandrd'
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
    add: { show: true, api: api.save, auth: ['/pricingNonStandrd/save'] },
    edit: { show: true, api: api.update, auth: ['/pricingNonStandrd/update'] },
    delete: { show: true, api: api.delete, auth: ['/pricingNonStandrd/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/pricingNonStandrd/recovery']},
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
      title: '非标编号',
      dataIndex: 'name',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '非标编号必填' }],
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
      commonRules: [{ required: false, message: '备注必填' }],
    },
    {
      title: '面积参数1',
      dataIndex: 'area1',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '面积参数1必填' }],
    },
    {
      title: '面积参数2',
      dataIndex: 'area2',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '面积参数2必填' }],
    },
    {
      title: '价格参数1',
      dataIndex: 'pricing_params1',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '价格参数1必填' }],
    },
    {
      title: '价格参数2',
      dataIndex: 'pricing_params2',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '价格参数2必填' }],
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
