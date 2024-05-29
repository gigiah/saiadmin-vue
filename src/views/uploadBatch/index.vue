<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <a-modal :width="800" v-model:visible="visible" title="上传文件" @ok="handleOk" @cancel="handleCancel">
      <a-form ref="uploadForm" :model="formData">
        <a-form-item label="源文件">
          <ma-upload v-model="uploadData.sourceFiles" :show-list="true" :multiple="false" type="file"
            @getUploadName="updateUploadNname" />
        </a-form-item>
        <a-form-item label="预览图">
          <ma-upload v-model="uploadData.previewImages" :show-list="true" :multiple="false" type="image" />
        </a-form-item>
        <a-form-item label="链接文件">
          <ma-upload :limit="20" v-model="uploadData.linkFiles" :show-list="true" :multiple="true" type="file" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 表格按钮后置扩展 -->
      <template #tableBeforeButtons>
        <a-button @click="showModal" @submit="sssumit" type="primary" status="normal"
          class="w-full mt-2 lg:w-auto lg:mt-0"><template #icon><icon-plus /></template>上传资源包
        </a-button>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/uploadBatch'
import { Message, Notification } from '@arco-design/web-vue'

const crudRef = ref()

const uploadData = ref({
  title: null,
  sourceFiles: null,
  previewImages: null,
  linkFiles: [],
})

const visible = ref(false)

const showModal = () => {
  visible.value = true
}
const handleOk = () => {
  console.log('保存文件', uploadData.value)
  api.handleCreateBatch(uploadData.value)
  visible.value = false
  Notification.success('保存成功')
  //清空当前
  uploadData.value = {
    sourceFiles: null,
    previewImages: null,
    linkFiles: [],
  }

}
const handleCancel = () => {
  visible.value = false;
}

const updateUploadNname = (val) => {
  console.log('updateUploadNname', val)
  uploadData.value.title = val
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
  add: { show: false, api: api.save, auth: ['/uploadBatch/save'] },
  edit: { show: true, text: '查看', api: api.update, auth: ['/uploadBatch/update'] },
  delete: { show: true, api: api.delete, auth: ['/uploadBatch/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/uploadBatch/recovery'] },
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
    commonRules: [{ required: false, message: '编号必填' }],
  },
  {
    title: '标题',
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
    title: '源文件',
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
            title: '',
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
