<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/clientService'
import { useSysInfoStore } from '@/store'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const sysInfoStore = useSysInfoStore()

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: !sysInfoStore.info.is_client,
  operationColumnWidth: 160,
  add: { show: sysInfoStore.info.is_admin, api: api.save, auth: ['/clientService/save'] },
  edit: { show: !sysInfoStore.info.is_client, api: api.update, auth: [] },
  delete: { show: !sysInfoStore.info.is_client, api: api.delete, auth: [] },
  recovery: { show: !sysInfoStore.info.is_client, api: api.recovery, auth: [] },
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
    title: '客户',
    dataIndex: 'client_group_id',
    width: 180,
    search: sysInfoStore.info.is_client ? false : true,
    addDisplay: true,
    editDisplay: true,
    hide: sysInfoStore.info.is_client ? true : false,
    formType: 'select',
    dict: { url: '/clientGroup/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    commonRules: [{ required: false, message: '客户必填' }],
  },
  {
    title: '跟进类型',
    dataIndex: 'type',
    formType: 'radio',
    addDefaultValue: 'team',
    width: 100,
    dict: {
      name: 'bizClientServiceType',
      props: { label: 'label', value: 'value' },
      translation: true,
    },
    control: (value) => {
      if (value == 'user') {
        return {
          dept_id: { display: false },
          follower_id: { display: true },
        }
      } else {
        return {
          dept_id: { display: true },
          follower_id: { display: false },
        }
      }
    },
  },
  {
    title: '跟进角色',
    dataIndex: 'role_code',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { name: 'bizClientServiceRole', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '跟进角色必填' }],
  },
  {
    title: '跟进团队',
    dataIndex: 'dept_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/core/dept/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '跟进团队必填' }],
  },
  {
    title: '跟进人员',
    dataIndex: 'follower_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/core/user/index?type=all', props: { label: 'nickname', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '跟进人员必填' }],
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: 100,
  //   search: true,
  //   addDisplay: true, addDefaultValue: 1,
  //   editDisplay: true,
  //   hide: false,
  //   dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
  //   formType: 'radio',
  //   commonRules: [{ required: false, message: '状态必填' }],
  // },
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
