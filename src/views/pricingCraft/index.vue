<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/pricingCraft'
import craftApi from '@/api/craft'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const currentRule = ref({
  max: 0,
  min: 0,
  msg: '请先选择产品',
})
const craft = ref([])

//加载工艺库
const getcraft = () => {
  craftApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        craft.value.push(item)
      })
    })
    .catch(error => {
      console.error("获取工艺库失败", error)
    })
}
getcraft()

const selectItem = (id) => {
  let product = {}
  craft.value.forEach(function (item) {
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
  add: { show: true, api: api.save, auth: ['/pricingCraft/save'] },
  edit: { show: true, api: api.update, auth: ['/pricingCraft/update'] },
  delete: { show: true, api: api.delete, auth: ['/pricingCraft/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/pricingCraft/recovery'] },
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
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/core/dept/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    defaultActiveFirstOption: true,
    commonRules: [{ required: false, message: '团队必填' }],
  },
  // {
  //   title: '客方',
  //   dataIndex: 'client_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: false,
  //   editDisplay: false,
  //   hide: true,
  //   formType: 'select',
  //   commonRules: [{ required: false, message: '客方必填' }],
  // },
  {
    title: '工艺',
    dataIndex: 'craft_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/pricingCraft/index4Search?type=all', props: { label: 'name', value: 'craft_id' }, translation: true },
    // data: craft4selects,
    formType: 'select',
    control: (val, maFormObject) => {
      let item = selectItem(val)
      // currentRule.value.min = item.price_min
      // currentRule.value.max = item.price_max
      // currentRule.value.msg = '范围在' + item.price_min + '-' + item.price_max
      maFormObject.price_min = item.price_min
      maFormObject.price_max = item.price_max
    },
    commonRules: [{ required: false, message: '工艺必填' }],
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
    title: '自动推送',
    dataIndex: 'is_auto_push',
    width: 100,
    search: true,
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
