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
import { useSysInfoStore } from '@/store'

const crudRef = ref()
const product = ref([])
const sysInfoStore = useSysInfoStore()

//加载库
const get = () => {
  productApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        product.value.push(item)
      })
    })
    .catch(error => {
      console.error("获取工艺库失败", error)
    })
}
get()

const selectItem = (id) => {
  let obj = {}
  product.value.forEach(function (item) {
    if (item.id == id) {
      obj = item
    }
  })
  return obj
}

const crud = reactive({
  api: api.getPageList,
  beforeRequest: params => {
    params.type = 'client'
  },
  beforeAdd: (form) => {
    form.type = 'client'
    return true
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: !sysInfoStore.info.is_client,
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
    title: '客方人员',
    dataIndex: 'client_id',
    width: 100,
    search: !sysInfoStore.info.is_client,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/clientUser/index?type=all', props: { label: 'name', value: 'client_id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '客方必填' }],
  },
  {
    title: '产品',
    dataIndex: 'product_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/pricingProduct/index4Search', props: { label: 'name', value: 'product_id' }, translation: true },
    formType: 'select',
    onChange: async (val) => {
			if (val) {
				const modalForm = crudRef.value.getFormData();
				if (!modalForm) {
					Message.error('未找到表单对象');
					return;
				}
				let item = selectItem(val)
				modalForm.price_min = item.price_min
				modalForm.price_max = item.price_max
				modalForm.pricing_type = item.pricing_type
			}
		},
    commonRules: [{ required: false, message: '产品必填' }],
  },
  {
    title: '标准单价',
    dataIndex: 'price',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '标准单价必填' }],
  },
  {
    title: '最低限价',
    dataIndex: 'price_min',
    width: 180,
    search: false,
    addDisplay: false,
    addDefaultValue: 0.00,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '最低限价必填' }],
  },
  {
    title: '最高限价',
    dataIndex: 'price_max',
    width: 180,
    search: false,
    addDisplay: false,
    addDefaultValue: 0.00,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '最高限价必填' }],
  },
  {
    title: '计价方式',
    dataIndex: 'pricing_type',
    formType: 'select',
    search: true,
    dict: { name: 'bizPricingType', props: { label: 'label', value: 'value' }, translation: true },
    disabled: true,
  },
  {
    title: '非标计价方式',
    dataIndex: 'non_standrd_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    dict: { url: '/pricingNonStandrd/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
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
