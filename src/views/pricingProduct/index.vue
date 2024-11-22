<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 表格按钮后置扩展 -->
      <template #tableAfterButtons>
        <a-button v-if="sysInfoStore.info.is_team_leader" type="outline" @click="modifyShow"><template #icon><icon-code /></template>选择产品
        </a-button>
      </template>
    </ma-crud>
    <a-modal v-model:visible="visible" @ok="modifySave">
      <a-transfer :title="['未选择产品', '已选择产品']" show-search :data="items4Transfer" v-model="items4TransferSelected"
        :source-input-search-props="{
          placeholder: '搜索未选产品'
        }" :target-input-search-props="{
      placeholder: '搜索已选产品'
    }" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/pricingProduct'
import productApi from '@/api/product'
import { Message } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'

const crudRef = ref()
const currentRule = ref({
  max: 0,
  min: 0,
  msg: '请先选择产品',
})
const products = ref([])
const items4Transfer = ref([])
const items4TransferSelected = ref([])
const sysInfoStore = useSysInfoStore()
const visible = ref(false)

//加载全部产品库
const getProducts = () => {
  let requestApi = null
  requestApi = productApi
  requestApi.getSelectList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        products.value.push(item)
        items4Transfer.value.push({
          value: item.id,
          label: item.name
        })
      })
    })
    .catch(error => {
      console.error("获取全部产品库失败", error)
    })
}
getProducts()

//加载已有产品库
const getProductsSelectd = () => {
  let requestApi = null
  requestApi = api
  requestApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        items4TransferSelected.value.push(item.product_id)
      })
    })
    .catch(error => {
      console.error("获取已选产品库失败", error)
    })
}
getProductsSelectd()

console.log('items4Transfer', items4Transfer.value)
console.log('items4TransferSelected', items4TransferSelected.value)

const modifyShow = () => {
  visible.value = true
}

const modifySave = () => {
  console.log(items4TransferSelected.value)
  api.saveBatch({
    ids: items4TransferSelected.value,
    type: 'market',
  })
    .then(res => {
      Message.success('保存成功')
      crudRef.value.refresh()
    })
    .catch(error => {
      Message.success('保存失败')
    })
  visible.value = false
}

const selectItem = (id) => {
  let product = {}
  products.value.forEach(function (item) {
    if (item.id == id) {
      product = item
    }
  })
  return product
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.type = 'team'
  },
  beforeAdd: (form) => {
    form.type = 'team'
    return true
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: sysInfoStore.info?.is_admin ? true : false, api: api.save, auth: ['/pricingProduct/save'] },
  edit: { show: sysInfoStore.info.is_team_leader ? true : false, api: api.update, auth: ['/pricingProduct/update'] },
  delete: { show: sysInfoStore.info.is_team_leader ? true : false, api: api.delete, auth: ['/pricingProduct/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/pricingProduct/recovery'] },
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
    title: '团队',
    dataIndex: 'dept_id',
    width: 100,
    search: sysInfoStore.info?.is_admin ? true : false,
    addDisplay: sysInfoStore.info?.is_admin ? true : false,
    editDisplay: sysInfoStore.info?.is_admin ? true : false,
    hide: sysInfoStore.info?.is_admin ? true : false ? false : true,
    dict: { url: '/core/dept/index?type=all&role_code=marketing', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    defaultActiveFirstOption: true,
    commonRules: [{ required: false, message: '团队必填' }],
  },
  // {
  //   title: '客方',
  //   dataIndex: 'client_group_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: true,
  //   formType: 'select',
  //   commonRules: [{ required: false, message: '客方必填' }],
  // },
  {
    title: '产品',
    dataIndex: 'product_id',
    width: 200,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/pricingProduct/index4Search', props: { label: 'name', value: 'product_id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '产品必填' }],
    disabled: true,
    onChange: (val) => {
      let item = selectItem(val)
      console.log(item)
      const modalForm = crudRef.value.getFormData();
      if (!modalForm) {
        Message.error('未找到表单对象');
        return;
      }
      modalForm.price_min = item.price_min
      modalForm.price_max = item.price_max
      modalForm.pricing_type_id = item.pricing_type_id
      modalForm.grade_id = item.grade_id
      modalForm.picture_type_id = item.picture_type_id
    },
    commonRules: [
      { required: true, message: '必填' },
    ],
  },
  // {
  //   title: '产品级别',
  //   dataIndex: 'grade_id',
  //   width: 100,
  //   search: true,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   disabled: true,
  //   dict: { url: '/productGrade/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
  //   formType: 'select',
  // },
  // {
  //   title: '画面类型',
  //   dataIndex: 'picture_type_id',
  //   width: 100,
  //   search: true,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   disabled: true,
  //   dict: { url: '/productPictureType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
  //   formType: 'select',
  // },
  {
    title: '标准单价',
    dataIndex: 'price',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [
      { required: true, message: '必填' },
      // { type: 'number', min: currentRule.min, max: currentRule.max, message: currentRule.msg },
    ],
  },
  {
    title: '计价方式',
    dataIndex: 'pricing_type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: { url: '/pricingType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
  },
  {
    title: '计量单位',
    dataIndex: 'pricing_unit_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    disabled: true,
    dict: { url: '/pricingUnit/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
  },
  {
    title: '自动推送',
    dataIndex: 'is_auto_push',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    addDefaultValue: 1,
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'radio',
    commonRules: [{ required: true, message: '启用状态必填' }],
  },
  {
    title: '最低限价',
    dataIndex: 'price_min',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '最低限价必填' }],
  },
  {
    title: '最高限价',
    dataIndex: 'price_max',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '最高限价必填' }],
  },
  // {
  //   title: '计价方式',
  //   dataIndex: 'pricing_type',
  //   formType: 'select',
  //   search: false,
  //   dict: { name: 'bizPricingType', props: { label: 'label', value: 'value' }, translation: true },
  //   disabled: true,
  // },
  {
    title: '详情图',
    dataIndex: 'desc_json',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: false,
    formType: 'upload',
    type: 'image',
    returnType: 'url',
    multiple: false,
    commonRules: [{ required: false, message: '详情图必填' }],
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
    title: '添加时间',
    dataIndex: 'create_time',
    width: 180,
    search: false,
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