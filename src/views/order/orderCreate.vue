<template>
  <div class="h-full ma-content-block">
    <!--门店表单-->
    <a-modal v-model:visible="showStore" :width="1400" title="门店选择" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-form :model="storeForm">
        <ma-crud :options="crud" :columns="storeColumns" ref="crudRef">
        </ma-crud>
      </a-form>
    </a-modal>
    <a-space class="p-3">
      <a-button type="primary" @click="handleClickAddStore">新增门店订单</a-button>
      <a-select v-if="showForm" placeholder="请选择卡券" allow-search>
        <a-option v-for="item of coupons" :value="item.value" :label="item.label" />
      </a-select>
    </a-space>
    <!--订单表单-->
    <div class="p-3 ma-content-block">
      <ma-form v-if="showForm" v-model="form" :options="options" :columns="columns" @submit="handleSubmit">
      </ma-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Notification, Message, Button, Modal } from '@arco-design/web-vue'
import orderApi from '@/api/order'
import storeApi from '@/api/store'
import couponItemApi from '@/api/couponItem'
import warehouseAddressApi from '@/api/warehouseAddress'
import productApi from '@/api/product'
import attachmentApi from '@/api/system/attachment'
// import couponApi from '@/api/coupon'

const form = ref({})//订单表单
const options = ref({})//订单选项
const columns = ref([])//订单字段
const crudRef = ref()//选择门店的crud
const showStore = ref(false)//是否弹出选择对话框
const showForm = ref(false)//是否展示订单表单
const selectStore = reactive({
  storeIds: new Set(), // 使用Set来存储已经选择的ID
})
const warehouses = ref([])//仓库地址
const products = ref([])//产品库
const productSelect = ref([])//产品选项
const files = ref([])//文件库
const filesSelect = ref([])//文件选项
const coupons = ref([])//卡券

//删除门店
const removeStore = (dataIndexObj) => {
  let dataIndex = dataIndexObj.id
  const index = columns.value.findIndex((c) => c.dataIndex === dataIndex)
  if (index !== -1) {
    columns.value.splice(index, 1)//删除表格
    selectStore.storeIds.delete(dataIndex)//删除hash
    if (columns.value.length == 0) showForm.value = false
  }
  console.log('delete table', columns.value)
}

//加载卡券
const getMyCoupon = () => {
  couponItemApi.getMyCoupon()
    .then(res => {
      coupons.value = res.data
    }).catch(error => {
      console.error("获取卡券失败", error)
    })
}
getMyCoupon()

//加载仓库地址
const getWarehouses = () => {
  warehouseAddressApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        warehouses.value.push({
          label: item.address,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取仓库地址失败", error)
    })
}
getWarehouses()

//加载产品库
const getProducts = () => {
  productApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        products.value.push(item)
        productSelect.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取产品库失败", error)
    })
}
getProducts()

//加载文件库
const getFiles = () => {
  attachmentApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        files.value.push(item)
        filesSelect.value.push({
          label: item.origin_name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取文件库失败", error)
    })
}
getFiles()

// //加载卡券列表
// const getCoupons = () => {
//   couponApi.getPageList({ type: 'all' })
//     .then(res => {
//       res.data.forEach(function (item) {
//         coupons.value.push(item)
//       })
//     })
//     .catch(error => {
//       console.error("获取卡券列表失败", error)
//     })
// }
// getCoupons()

const selectProduct = (id) => {
  let product = {}
  products.value.forEach(function (item) {
    if (item.id == id) {
      product = item
    }
  })
  return product
}

//处理产品选择后变更
const updateProduct = (storeId, productDetails) => {
  console.log('productDetails', productDetails)
  // 找到对应的订单表单
  console.log(columns.value)
  const orderForm = columns.value.find(column => column.dataIndex === storeId)
  console.log('orderForm', orderForm)
  if (orderForm) {
    // 找到产品级别的输入字段
    console.log('orderForm.formList', orderForm.formList)
    const orderList = orderForm.formList.find(field => field.dataIndex === 'order-list-' + storeId)
    const productGradeField = orderList.formList.find(field => field.dataIndex === 'product_grade')
    console.log('productGradeField', productGradeField)
    console.log('productDetails.grade', productDetails.grade_id)
    if (productGradeField) {
      // 更新产品级别字段的值
      productGradeField.placeholder = productDetails.grade_id
    }
  }
}


const handleClickAddStore = () => {
  showStore.value = true
}
const handleBeforeOk = (done) => {
  let selected = filterStoreByIds(crudRef.value.getSelecteds().value, crudRef.value.getTableData())
  selected.forEach(function (store) {
    if (selectStore.storeIds.has(store.id)) {
      Notification.warning(store.name + '已存在!')
    } else {
      columns.value.push(orderTemplate(store.name, store.id))
      selectStore.storeIds.add(store.id)
    }
  })
  showForm.value = true
  console.log('add table', columns.value)
  window.setTimeout(() => {
    done()
    // prevent close
    // done(false)
  }, 1000)
}

const handleCancel = () => {
  showStore.value = false
}

const filterStoreByIds = (ids, data) => {
  return data.filter(item => ids.includes(item.id))
}

const handleSubmit = async ({ values, errors }) => {
  Modal.info({
    title: '提示',
    content: '确定提交订单吗？',
    simple: false,
    onBeforeOk: (done) => {
      console.log('form data', form.value)
      let data = integrateData(form.value)
      console.log('integrate data', data)
      orderApi.handleCreateOrder(data)
      columns.value = []
      selectStore.storeIds.clear()
      done(true)
      Notification.success('订单提交成功')
    },
  })

}

const integrateData = (data) => {
  const result = []
  // 遍历 JSON 对象的键
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // 获取 ID（例如："order-list-1" 中的 "1"）
      const idMatch = key.match(/(\d+)$/)
      if (idMatch) {
        const id = idMatch[0]
        // 查找或创建对应 ID 的集成对象
        let orderGroup = result.find(item => item.id === id)
        if (!orderGroup) {
          orderGroup = { id: id, orderList: [], consignee: null }
          result.push(orderGroup)
        }
        // 根据键名决定如何处理数据
        if (key.startsWith('order-list')) {
          // 将 "order-list-x" 的数组合并到 orderList
          orderGroup.orderList.push(...data[key])
        } else if (key.startsWith('consignee')) {
          // 将 "consignee-x" 的值设置为 consignee
          orderGroup.consignee = data[key]
        }
      }
    }
  }
  return result
}

const storeForm = ref({})
const crud = reactive({
  api: storeApi.getPageList,
  recycleApi: storeApi.getRecyclePageList,
  showIndex: true,
  searchColNumber: 5,
  pageLayout: 'normal',
  rowSelection: { showCheckedAll: true },
  operationColumn: false,
  operationColumnWidth: 160,
  add: { show: false, api: storeApi.save, auth: ['/store/save'] },
  edit: { show: false, api: storeApi.update, auth: ['/store/update'] },
  delete: { show: false, api: storeApi.delete, auth: ['/store/destroy'] },
  recovery: { show: false, api: storeApi.recovery, auth: ['/store/recovery'] },
  formOption: { width: 800 },
})

const storeColumns = reactive([
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
    title: '门店编号',
    dataIndex: 'code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '门店编号必填' }],
  },
  {
    title: '门店名',
    dataIndex: 'name',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '门店名必填' }],
  },
  {
    title: '营销区域',
    dataIndex: 'area_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/storeAreaType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '营销区域必填' }],
  },
  {
    title: '经营模式',
    dataIndex: 'business_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/storeBusinessType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '经营模式必填' }],
  },
  {
    title: '产品线',
    dataIndex: 'product_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/storeProductType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '产品线必填' }],
  },
  {
    title: '价格体系',
    dataIndex: 'pricing_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/storePricingType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '价格体系必填' }],
  },
])

const orderTemplate = (title, storeId) => {
  let data = {
    formType: 'card',
    title: title,
    dataIndex: storeId,
    customClass: ['m-3'],
    extra: '删除',
    remove: removeStore,
    formList: [
      {
        dataIndex: 'consignee-' + storeId, title: '收货地址', formType: 'select',
        data: warehouses,
        rules: [{ required: true, message: '请选择收货地址' }]
      },
      // {
      //   title: '下单产品', formType: 'divider', orientation: 'left', margin: '30px',
      // },
      {
        title: '订单列表', dataIndex: 'order-list-' + storeId, formType: 'children-form', type: 'table', emptyRow: 1, hideLabel: true, showBtn: true,
        formList: [
          {
            dataIndex: 'product_id',
            title: '产品名称',
            formType: 'select',
            placeholder: '请选择',
            data: productSelect,
            onChange: (id) => {
              let product = selectProduct(id)
              updateProduct(storeId, product)
            },
            // onChange: (val) => {
            //   console.log('val', val)
            //   return { product_picture_type: { display: false } }
            // },
            rules: [{ required: true, message: '请选择产品' }]
          },
          {
            dataIndex: 'associated_file',
            title: '文件名',
            formType: 'select',
            placeholder: '请选择',
            data: filesSelect,
            rules: [{ required: true, message: '请选择上传文件' }]
          },
          {
            dataIndex: 'product_grade',
            title: '产品级别',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'product_picture_type',
            title: '画面类型',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'width',
            title: '宽度',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'height',
            title: '高度',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'count',
            title: '数量',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'craft',
            title: '制作选项',
            formType: 'select',
            placeholder: '请选择',
            data: [
              {
                label: '党员',
                value: 1,
              },
              {
                label: '团员',
                value: 2,
              },
              {
                label: '群众',
                value: 3,
              },
            ],
          },
          {
            dataIndex: 'remark',
            title: '备注说明',
            placeholder: '请输入',
          },
          {
            dataIndex: 'pricing_type_id',
            title: '计价方式',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'pricing_unit_id',
            title: '计量单位',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'unit_price',
            title: '单价',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'amount',
            title: '金额',
            placeholder: '',
            disabled: true,
          },
        ],
      }
    ],
  }
  return data
}
</script>