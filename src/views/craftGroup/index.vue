<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/craftGroup'
import craft from '@/views/craft/index.vue'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const itemRef = ref()

const viewItems = (record) => {
  itemRef.value.open(record)
}


const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: true, api: api.save, auth: ['/craftGroup/save'] },
  edit: { show: true, api: api.update, auth: ['/craftGroup/update'] },
  delete: { show: true, api: api.delete, auth: ['/craftGroup/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/craftGroup/recovery'] },
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
    title: '编组名称',
    dataIndex: 'name',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '编组名称必填' }],
  },
  {
    title: '编组编号',
    dataIndex: 'code',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '编组编号必填' }],
  },
  {
    title: '工艺',
    dataIndex: 'craft_ids',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    multiple: true,
    dict: { url: '/craft/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    // commonRules: [{ required: false, message: '必填' }],
    editDefaultValue: async (record) => {
      const response = await api.read(record.id)
      return response.data.craft_list.map((item) => item.id)
    },
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
