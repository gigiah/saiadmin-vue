<template>
  <a-modal v-model:visible="visible" :width="1400" :footer="false">
    <template #title>服务人员</template>
    <div class="justify-between p-4 ma-content-block lg:flex">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
      </ma-crud>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/clientService'
import { useSysInfoStore } from '@/store'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const visible = ref(false)
const clientGroupId = ref()

const open = (row) => {
  clientGroupId.value = row.id
  visible.value = true
  crudRef.value.requestData()
}

const sysInfoStore = useSysInfoStore()
let role_code = ''
let dept_id = 0
if (!sysInfoStore.info.is_admin) {
  role_code = sysInfoStore.info.role_codes[0]
  dept_id = sysInfoStore.info.dept_id
}

let showOperation = true
if (sysInfoStore.info.is_client || !sysInfoStore.info.is_team_leader) {
  showOperation = false
}
if (sysInfoStore.info.is_admin === true) {
  showOperation = true
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.client_group_id = clientGroupId
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: showOperation,
  operationColumnWidth: 160,
  add: { show: showOperation, api: api.save, auth: ['/clientService/save'] },
  edit: { show: showOperation, api: api.update, auth: ['/clientService/update'] },
  delete: { show: showOperation, api: api.delete, auth: ['/clientService/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/clientService/recovery'] },
  formOption: { width: 800 },
  beforeOpenAdd: () => {
    columns[1].addDefaultValue = Number.parseInt(clientGroupId.value)
    return true
  },
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
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: sysInfoStore.info.is_client ? true : false,
    formType: 'select',
    readonly: true,
    disabled: true,
    dict: { url: '/clientGroup/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    commonRules: [{ required: false, message: '客户必填' }],
  },
  {
    title: '跟进类型',
    dataIndex: 'type',
    formType: 'radio',
    addDefaultValue: 'team',
    // disabled: sysInfoStore.info.is_admin,
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
    addDefaultValue: role_code,
    editDefaultValue: role_code,
    disabled: sysInfoStore.info.is_admin ? false : true,
    // disabled: sysInfoStore.info.is_admin ? false : true,
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
    dict: { url: '/core/dept/index?type=all&role_code=' + role_code + '&id=' + dept_id, props: { label: 'name', value: 'id' }, translation: true },
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
    dict: { url: '/core/user/index?type=all&dept_id=' + dept_id, props: { label: 'nickname', value: 'id' }, translation: true },
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

defineExpose({ open })
</script>
