<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- switch -->
      <template #status="{ record }">
        <a-switch :disabled="sysInfoStore.info.is_client || !sysInfoStore.info.is_team_leader" :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)" :default-checked="record.status == 1" />
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/pricingProduct'
import productApi from '@/api/product'
import { Message, Modal } from '@arco-design/web-vue'
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

const changeStatus = async (status, id) => {
  Modal.info({
    title: '提示',
    content: '确认吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      api.changeStatus({
        'id': id,
        'value': status,
      }).then(res => {
        if (res.code == 200) {
          Message.success(res.message)
        } else {
          Message.error(res.message)
        }
        crudRef.value.refresh()
      })
    },
    onCancel: async () => {
      console.log('cancel')
      crudRef.value.refresh()
    }
  })
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
  add: { show: sysInfoStore.info.is_team_leader ? true : false, api: api.save, auth: ['/pricingProduct/save'] },
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
    title: '客方',
    dataIndex: 'client_group_id',
    width: 100,
    search: !sysInfoStore.info.is_client,
    addDisplay: true,
    editDisplay: true,
    addDisabled: false,
    editDisabled: true,
    hide: sysInfoStore.info.is_client,
    dict: { url: '/clientGroup/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
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
    addDisabled: false,
    editDisabled: true,
    hide: false,
    dict: {
      url: '/pricingProduct/index4Search',
      params: sysInfoStore.info.is_client ? { type: 'client' } : {},
      props: { label: 'name', value: 'product_id' },
      translation: true
    },
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
        // modalForm.pricing_type = item.pricing_type
        modalForm.pricing_type_id = item.pricing_type_id
        modalForm.pricing_unit_id = item.pricing_unit_id
        modalForm.grade_id = item.grade_id
        modalForm.picture_type_id = item.picture_type_id
      }
    },
    commonRules: [{ required: false, message: '产品必填' }],
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
    dict: { url: '/productGrade/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
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
    dict: { url: '/productPictureType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
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
  // {
  //   title: '计价方式',
  //   dataIndex: 'pricing_type',
  //   formType: 'select',
  //   search: false,
  //   dict: { name: 'bizPricingType', props: { label: 'label', value: 'value' }, translation: true },
  //   disabled: true,
  // },
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
    control: (value) => {
      if (value == 8) {
        return {
          non_standrd_id: { display: true },
        }
      } else {
        return {
          non_standrd_id: { display: false },
        }
      }
    },
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
    title: '非标计价规则',
    dataIndex: 'non_standrd_id',
    width: 100,
    search: false,
    addDisplay: false,
    editDisplay: false,
    dict: { url: '/pricingNonStandrd/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
  },
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
    title: '启用状态',
    dataIndex: 'status',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'radio',
    // commonRules: [{ required: false, message: '必填' }],
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
</script>
