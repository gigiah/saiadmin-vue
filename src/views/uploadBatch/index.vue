<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <upload-modal :key="modalKey" :visible="visible" @ok="handleOk" @cancel="handleCancel" />
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 表格按钮后置扩展 -->
      <template #tableBeforeButtons>
        <a-button type="outline">
          <template #icon><icon-save /></template>云盘容量 {{ diskVol.remain }}/{{ diskVol.total }}G
        </a-button>
        <a-button @click="showModal" @submit="" type="primary" status="normal"
          class="w-full mt-2 lg:w-auto lg:mt-0"><template #icon><icon-plus /></template>上传文件
        </a-button>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, toRaw, watch} from 'vue'
import api from '@/api/uploadBatch'
import { Message, Notification } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'
import OssUpload from "@/views/uploadBatch/components/ossUpload.vue";
import useUploadStore from "@/store/modules/upload";
import UploadModal from "@/views/uploadBatch/components/upload-modal.vue";

const crudRef = ref()
const sysInfoStore = useSysInfoStore()
const diskVol = ref({})

const visible = ref(false)

const showModal = () => {
  visible.value = true
}

const modalKey = ref(0)

function handleOk() {
  modalKey.value++
  visible.value = false
}

function handleCancel() {
  visible.value = false
}

const getDiskVol = () => {
  api.diskVol().then(res => {
    diskVol.value = {
      total: res.data.total,
      remain: res.data.remain,
    }
  })
}

onMounted(() => {
  getDiskVol()
});

// const updateUploadNname = (val) => {
//   console.log('updateUploadNname', val)
//   let baseName = val.split('.').slice(0, -1).join('.');
//   uploadData.value.title = baseName
// }

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: false, api: api.save, auth: ['/uploadBatch/save'] },
  edit: { show: true, text: '查看', title: '查看', api: api.update, auth: ['/uploadBatch/update'] },
  delete: { show: true, api: api.delete, auth: ['/uploadBatch/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/uploadBatch/recovery'] },
  formOption: { width: 800 },
  isDbClickEdit: true,
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
    commonRules: [{ required: false, message: '编号必填' }],
  },
  {
    title: '源文件',
    dataIndex: 'title',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    editDisabled: true,
    commonRules: [{ required: true, message: '标题必填' }],
  },
  {
    title: '路径',
    dataIndex: 'source_file',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    editDisabled: true,
    commonRules: [{ required: true, message: '源文件必填' }],
  },
  {
    title: '预览图',
    dataIndex: 'preview_image',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'image',
    returnType: 'url',
    multiple: false,
    editDisabled: true,
    commonRules: [{ required: false, message: '预览图必填' }],
  },
  {
    formType: 'card',
    title: '链接文件',
    hide: true,
    formList: [
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'link_file_list',
        type: 'table',
        showBtn: false,
        disabled: true,
        formList: [
          {
            title: '文件名',
            hideLabel: true,
            dataIndex: 'label',
            disabled: true,
            formType: 'input',
            width: 150,
          },
          {
            title: '地址',
            hideLabel: true,
            dataIndex: 'value',
            disabled: true,
            formType: 'input',
          },
        ],
      },
    ],
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 180,
    search: false,
    addDisplay: false, addDefaultValue: 100,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '排序必填' }],
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 180,
    search: false,
    addDisplay: false, addDefaultValue: 1,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '状态必填' }],
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
    search: true,
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
