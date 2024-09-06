<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini" v-if="record.type == 'user'">
          <a-link @click="showBizWechat(record)"><icon-menu />查看企业微信</a-link>
        </a-space>
      </template>
    </ma-crud>
  </div>
  <a-modal @cancel="hideBizWechat" :width="350" :footer="false" :visible="visible">
    <a-image width="300" :src="wechatImg" />
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/clientService'
import sysUserApi from '@/api/system/user'
import { Message } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'

const crudRef = ref()
const visible = ref(false)
const wechatImg = ref()
const sysInfoStore = useSysInfoStore()

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.clientReq = 1
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: sysInfoStore.info.is_client ? false : true, api: api.save, auth: ['/clientService/save'] },
  edit: { show: false, api: api.update, auth: ['/clientService/update'] },
  delete: { show: sysInfoStore.info.is_client ? false : true, api: api.delete, auth: ['/clientService/destroy'] },
  recovery: { show: false, api: api.recovery, auth: ['/clientService/recovery'] },
  formOption: { width: 800 },
})

const showBizWechat = (record) => {
  sysUserApi.read(record.follower_id)
    .then(res => {
      wechatImg.value = res.data.wechat_business
      visible.value = true
    })
    .catch(error => {
      console.error('Error:', error.message)
    })
}

const hideBizWechat = () => {
  visible.value = false
}

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
    hide: false,
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
    disabled: true,
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
  //   title: '企业微信',
  //   dataIndex: 'wechat_business',
  //   width: 180,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'upload',
  //   type: 'image',
  //   returnType: 'url',
  //   multiple: false,
  // },
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
