<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/pricingProduct'
import productApi from '@/api/product'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const products = ref([])
const products4Select = ref([])
const currentRule = ref({
  max: 0,
  min: 0,
  msg: '请先选择产品',
})

//加载产品库
const getProducts = () => {
  productApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        products.value.push(item)
        products4Select.value.push({
          label: item.name,
          value: item.id,
          disabled: true,
        })
      })
    })
    .catch(error => {
      console.error("获取产品库失败", error)
    })
}
getProducts()

const selectProduct = (id) => {
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
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: true, api: api.save, auth: ['/pricingProduct/save'] },
  edit: { show: true, api: api.update, auth: ['/pricingProduct/update'] },
  delete: { show: true, api: api.delete, auth: ['/pricingProduct/destroy'] },
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
    title: '人员',
    dataIndex: 'sys_user_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/core/user/index?type=all', props: { label: 'nickname', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '人员必填' }],
  },
  {
    title: '客方',
    dataIndex: 'client_id',
    width: 100,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'select',
    commonRules: [{ required: false, message: '客方必填' }],
  },
  {
    title: '产品',
    dataIndex: 'product_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    // dict: { url: '/product/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    data: products4Select,
    formType: 'select',
    commonRules: [{ required: false, message: '产品必填' }],
    control: (val, maFormObject) => {
      let product = selectProduct(val)
      currentRule.value.min = product.price_min
      currentRule.value.max = product.price_max
      currentRule.value.msg = '范围在' + product.price_min + '-' + product.price_max
      maFormObject.price_min = product.price_min
      maFormObject.price_max = product.price_max
    },
    commonRules: [
      { required: true, message: '必填' },
    ],
  },
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
    title: '最低限价',
    dataIndex: 'price_min',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: false,
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
    editDisplay: false,
    hide: true,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: false, message: '最高限价必填' }],
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
