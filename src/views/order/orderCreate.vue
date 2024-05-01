<template>
  <div class="h-full ma-content-block">
    <!--门店表单-->
    <a-modal fullscreen v-model:visible="showStore" title="门店选择" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-form :model="storeForm">
        <ma-crud :options="crud" :columns="storeColumns" ref="crudRef">
        </ma-crud>
      </a-form>
    </a-modal>
    <a-space class="p-3">
      <a-button type="primary" @click="handleClickAddStore">新增门店订单</a-button>
      <a-select placeholder="请选择卡券" allow-search>
        <a-option>卡券1</a-option>
        <a-option>卡券2</a-option>
        <a-option disabled>卡券4</a-option>
      </a-select>
    </a-space>
    <!--订单表单-->
    <div class="p-3 ma-content-block">
      <ma-form v-model="form" :options="options" :columns="columns" @submit="handleSubmit">
      </ma-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Notification, Message } from '@arco-design/web-vue'
import storeApi from '@/api/store'
import warehouseAddressApi from '@/api/warehouseAddress'

const form = ref({})//订单表单
const options = ref({})//订单选项
const columns = ref([])//订单字段
const crudRef = ref()//选择门店的crud
const showStore = ref(false)//是否弹出选择对话框
const selectStore = reactive({
  storeIds: new Set(), // 使用Set来存储已经选择的ID
});
const warehouse = ref([])//仓库地址

//加载仓库地址
const loadWarehouseAddresses = () => {
  warehouseAddressApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (address) {
        warehouse.value.push({
          label: address.address,
          value: address.id
        })
      })
    })
    .catch(error => {
      console.error("获取仓库地址失败", error)
    });
}
loadWarehouseAddresses()

const handleClickAddStore = () => {
  showStore.value = true;
};
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
  window.setTimeout(() => {
    done()
    // prevent close
    // done(false)
  }, 1000)
};

const handleCancel = () => {
  showStore.value = false;
}

const filterStoreByIds = (ids, data) => {
  return data.filter(item => ids.includes(item.id));
}

const handleSubmit = async ({ values, errors }) => {
  console.log(values)
}

const storeForm = ref({})
const crud = reactive({
  api: storeApi.getPageList,
  recycleApi: storeApi.getRecyclePageList,
  showIndex: true,
  searchColNumber: 5,
  pageLayout: 'fixed',
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
  const data = {
    formType: 'card',
    title: title,
    customClass: ['mt-3', 'mb-5'],
    formList: [
      {
        dataIndex: 'consignee-' + storeId, title: '收货地址', formType: 'select',
        data: warehouse,
        // data: { url: '/warehouseAddress/index?type=all', props: { label: 'address', value: 'id' }, translation: true },
        // rules: [{ required: true, message: '请选择收货地址' }]
      },
      // {
      //   title: '下单产品', formType: 'divider', orientation: 'left', margin: '30px',
      // },
      {
        title: '订单列表', dataIndex: 'order-list-' + storeId, formType: 'children-form', type: 'table', emptyRow: 1, hideLabel: true,
        formList: [
          {
            dataIndex: 'product_name',
            title: '产品名称',
            formType: 'select',
            placeholder: '请选择',
            data: [
              {
                label: '产品A',
                value: 1,
              },
              {
                label: '产品B',
                value: 2,
              },
            ],
            // rules: [{ required: true, message: '请选择产品' }]
          },
          {
            dataIndex: 'associated_file',
            title: '上传文件',
            formType: 'select',
            placeholder: '请选择',
            data:
              [
                {
                  label: '文件1',
                  value: 1,
                },
                {
                  label: '文件2',
                  value: 2,
                },
              ],
            // rules: [{ required: true, message: '请选择上传文件' }]
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
            // rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'height',
            title: '高度',
            placeholder: '请输入',
            // rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'nums',
            title: '数量',
            placeholder: '请输入',
            // rules: [{ required: true, message: '请输入' }]
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
};
</script>