<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link v-if="record.produce_status == 2" @click="accpetModal(record)" v-auth="[]">
          <icon-check />受理
        </a-link>
      </template>
    </ma-crud>
    <a-modal v-model:visible="visible" :width="1200" :footer="false" draggable>
      <template #title>资源选择器</template>
      <ma-resource v-model="emitFiles" :multiple="true" :onlyData="false"
        :extData="{ clientName: currentClientName, folder: currentFolder }" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import api from '@/api/summaryOrder'
import clientGrpApi from '@/api/clientGroup'
import { Message, Modal } from '@arco-design/web-vue'
import { isArray } from 'lodash'

const crudRef = ref()
const visible = ref(false)
const currentFileName = ref()
const emitFiles = ref([])
const currentClientName = ref(null)
const currentFolder = ref(null)

const emit = defineEmits(['update:modelValue'])

watch(
  () => emitFiles.value,
  vl => {
    emit('update:modelValue', emitFiles.value)
    console.log('emitFiles', emitFiles.value)
    // inputValue.value = isArray(emitFiles) ? emitFiles.value.join(',') : []
    visible.value = false
    const modalForm = crudRef.value.getFormData()
    console.log('modalForm', modalForm)
    if (currentFileName.value === 'print') {
      //更新打印文件子表单
      modalForm.print_file_list = []
      emitFiles.value.forEach(function (f) {
        modalForm.print_file_list.push({ label: f.origin_name, value: f.url })
      })
    }
    else if (currentFileName.value === 'later') {
      //更新打印文件子表单
      modalForm.later_file_list = []
      emitFiles.value.forEach(function (f) {
        modalForm.later_file_list.push({ label: f.origin_name, value: f.url })
      })
    }
    currentFileName.value = ''
  },
  { deep: true }
)

const accpetModal = (record) => {
  console.log(record)
  Modal.info({
    title: '提示',
    content: '确定受理吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await api.handleProduce({
        id: record.id,
        action: 'accept',
        nums: 0,
      })
      crudRef.value.refresh()
    },
  })
  return
}

const crud = reactive({
  api: api.getPageList,
  requestParams: { produce_status: 2 },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: false, api: api.save },
  edit: { show: true, api: api.update },
  delete: { show: false, api: api.delete },
  recovery: { show: true, api: api.recovery },
  formOption: {
    width: '850px',
  },
  beforeOpenEdit: (params) => {
    clientGrpApi.getClientGrpNameById({ id: params.client_group_id })
      .then(res => {
        console.log(res)
        currentClientName.value = res.data
      })
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
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: {
      url: '/clientGroup/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '客户必填' }],
  },
  {
    title: '汇总人',
    dataIndex: 'summary_sys_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: {
      url: '/core/user/index?type=all&range=all',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '汇总人必填' }],
  },
  {
    title: '审图人',
    dataIndex: 'confirm_sys_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: {
      url: '/core/user/index?type=all&isClient=1',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '审图人必填' }],
  },
  {
    title: '汇总批次号',
    dataIndex: 'summary_batch_code',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '汇总批次号必填' }],
  },
  // {
  //   title: '汇总时间',
  //   dataIndex: 'create_time',
  //   width: 180,
  //   search: true,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: false,
  //   searchFormType: 'range',
  //   showTime: true,
  //   disabled: true,
  //   formType: 'date',
  //   commonRules: [{ required: false, message: '创建时间必填' }],
  // },
  // {
  //   title: '受理人',
  //   dataIndex: 'assign_sys_id',
  //   width: 100,
  //   search: true,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: {
  //     url: '/core/user/index?type=all',
  //     props: { label: 'nickname', value: 'id' },
  //     translation: true,
  //   },
  //   formType: 'select',
  //   disabled: true,
  //   commonRules: [{ required: false, message: '受理人必填' }],
  // },
  // {
  //   title: '受理时间',
  //   dataIndex: 'assign_time',
  //   width: 180,
  //   search: true,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: false,
  //   searchFormType: 'range',
  //   showTime: true,
  //   formType: 'date',
  //   commonRules: [{ required: false, message: '受理时间必填' }],
  // },
  {
    title: '文件名',
    dataIndex: 'associated_file',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'select',
    dict: {
      url: '/uploadBatch/index?type=all&range=all',
      props: { label: 'title', value: 'id' },
      translation: true,
    },
    commonRules: [{ required: false, message: '文件名必填' }],
  },
  {
    title: '识别符',
    dataIndex: 'identify',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '识别符必填' }],
  },
  {
    title: '产品名称',
    dataIndex: 'product_name',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '产品名称必填' }],
  },
  {
    title: '产品类别',
    dataIndex: 'type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: {
      url: '/productType/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '产品类别必填' }],
  },
  {
    title: '产品级别',
    dataIndex: 'grade_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: {
      url: '/productGrade/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '产品级别必填' }],
  },
  {
    title: '画面类型',
    dataIndex: 'picture_type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: {
      url: '/productPictureType/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: false, message: '画面类型必填' }],
  },
  {
    title: '宽度CM',
    dataIndex: 'width',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '宽度必填' }],
  },
  {
    title: '高度CM',
    dataIndex: 'height',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
    commonRules: [{ required: false, message: '高度必填' }],
  },
  {
    title: '汇总数量',
    dataIndex: 'nums',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '汇总数量必填' }],
  },
  {
    title: '加急数量',
    dataIndex: 'urgent_nums',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '加急数量必填' }],
  },
  {
    title: '外发',
    dataIndex: 'out_source',
    search: true,
    addDisplay: true,
    addDefaultValue: 2,
    editDisplay: true,
    hide: false,
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'radio',
    commonRules: [{ required: false, message: '外发状态必填' }],
  },
  {
    title: '制作选项',
    dataIndex: 'crafts',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    formType: 'input',
  },
  {
    title: '客服备注',
    dataIndex: 'remark',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
  },
  {
    title: '完稿预览图',
    dataIndex: 'finish_preview',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'file',
    returnType: 'url',
    multiple: false,
    requestData: { clientName: currentClientName, folder: '完稿预览图' },
    commonRules: [{ required: false, message: '完稿预览图必填' }],
  },
  {
    title: '审图反馈信息',
    dataIndex: 'confirm_feedback',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '审图反馈信息必填' }],
  },
  // {
  //   title: '喷印状态',
  //   dataIndex: 'produce_status',
  //   width: 180,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'input',
  //   commonRules: [{ required: false, message: '喷印状态必填' }],
  // },
  {
    title: '完成印量',
    dataIndex: 'finish_nums',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '完成印量必填' }],
  },
  {
    formType: 'card',
    title: '打印文件',
    formList: [
      {
        formType: 'button',
        dataIndex: 'print_file_button',
        hide: true,
        type: 'primary',
        title: '上传打印文件',
        long: false,
        onClick: async () => {
          currentFileName.value = 'print'
          currentFolder.value = '打印文件'
          visible.value = true
        },
      },
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'print_file_list',
        type: 'table',
        showBtn: true,
        disabled: false,
        emptyRow: 0,
        customClass: ['mt-3'],
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
    formType: 'card',
    title: '后期文件',
    formList: [
      {
        formType: 'button',
        dataIndex: 'later_file_button',
        hide: true,
        type: 'primary',
        title: '上传后期文件',
        long: false,
        onClick: async () => {
          currentFileName.value = 'later'
          currentFolder.value = '后期文件'
          visible.value = true
        },
      },
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'later_file_list',
        type: 'table',
        showBtn: true,
        disabled: false,
        emptyRow: 0,
        customClass: ['mt-3'],
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
  // {
  //   title: '创建者',
  //   dataIndex: 'created_by',
  //   width: 180,
  //   search: false,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: true,
  //   formType: 'input',
  //   commonRules: [{ required: false, message: '创建者必填' }],
  // },
  // {
  //   title: '更新者',
  //   dataIndex: 'updated_by',
  //   width: 180,
  //   search: false,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: true,
  //   formType: 'input',
  //   commonRules: [{ required: false, message: '更新者必填' }],
  // },
  // {
  //   title: '修改时间',
  //   dataIndex: 'update_time',
  //   width: 180,
  //   search: false,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: true,
  //   searchFormType: 'range',
  //   showTime: true,
  //   formType: 'date',
  //   commonRules: [{ required: false, message: '修改时间必填' }],
  // },
])
</script>
