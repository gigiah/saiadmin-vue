<template>
  <a-modal v-model:visible="visible" :width="1400" :footer="false">
    <template #title>相册内容</template>
    <div class="justify-between p-4 ma-content-block lg:flex">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
      </ma-crud>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/storeGalleryItem'
import { Message } from '@arco-design/web-vue'


const visible = ref(false)
const crudRef = ref()
const galleryId = ref()

const open = (row) => {
  galleryId.value = row.id
  visible.value = true
  crudRef.value.requestData()
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.gallery_id = galleryId
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: true, api: api.save, auth: ['/storeGalleryItem/save'] },
  edit: { show: true, api: api.update, auth: ['/storeGalleryItem/update'] },
  delete: { show: true, api: api.delete, auth: ['/storeGalleryItem/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/storeGalleryItem/recovery'] },
  formOption: { width: 800 },
  beforeOpenAdd: () => {
    columns[1].addDefaultValue = Number.parseInt(galleryId.value)
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
    title: '相册',
    dataIndex: 'gallery_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    editDisabled: true,
    hide: false,
    dict: { url: '/storeGallery/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '相册ID必填' }],
  },
  {
    title: '用品名称',
    dataIndex: 'name',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    maxLength: 16,
    commonRules: [{ required: true, message: '名称必填' }],
  },
  {
    title: '源文件',
    dataIndex: 'associated_file',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/uploadBatch/index?type=all', props: { label: 'title', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '源文件必填' }],
  },
  {
    title: '产品名称',
    dataIndex: 'product_pricing_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/pricingProduct/index4Search', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '模板产品必填' }],
  },
  {
    title: '小程序预览图',
    dataIndex: 'preview_url',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'image',
    returnType: 'url',
    multiple: false,
    extra: '仅用于小程序用品预览，请确保与源文件内容相符！图片宽高建议在1200像素内，超出将不能完整显示。',
    commonRules: [{ required: false, message: '预览图必填' }],
  },
  {
    title: '固定宽度',
    dataIndex: 'width',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '固定宽度必填' }],
  },
  {
    title: '固定高度',
    dataIndex: 'height',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '固定高度必填' }],
  },
  {
    title: '用品说明',
    dataIndex: 'remark',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '用品说明必填' }],
  },
  // {
  //   title: '产品线',
  //   dataIndex: 'product_type_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: { url: '/storeProductType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
  //   formType: 'select',
  //   commonRules: [{ required: true, message: '产品线必填' }],
  // },
  {
    title: '价格体系',
    dataIndex: 'pricing_type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/storePricingType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    multiple: true,
    editDefaultValue: async (record) => {
      const response = await api.read(record.id)
      return response.data.list.map((item) => item.id)
    },
    // commonRules: [{ required: true, message: '价格体系必填' }],
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

defineExpose({ open })
</script>
