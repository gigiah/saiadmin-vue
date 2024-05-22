<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini">
          <a-link @click="viewItems(record)"><icon-menu /> 查看内容</a-link>
        </a-space>
      </template>
    </ma-crud>
    <coupon-item ref="itemRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/coupon'
import couponItem from '@/views/couponItem/index.vue'
import productApi from '@/api/product'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const itemRef = ref()

const viewItems = (record) => {
  itemRef.value.open(record)
}

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 250,
  add: { show: true, api: api.save, auth: ['/coupon/save'] },
  edit: { show: true, api: api.update, auth: ['/coupon/update'] },
  delete: { show: true, api: api.delete, auth: ['/coupon/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/coupon/recovery'] },
  formOption: { width: 800 },
})

const columns = reactive([
  {
    title: '编号',
    dataIndex: 'id',
    width: 180,
    search: true,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: true, message: '编号必填' }],
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 180,
    search: true,
    addDisplay: true,
    addDefaultValue: '',
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '名称必填' }],
  },
  {
    title: '卡券类型 ',
    dataIndex: 'type',
    width: 100,
    search: false,
    addDisplay: false, addDefaultValue: 1,
    editDisplay: false,
    hide: true,
    dict: { data: [{ "label": "卡", "value": 1 }, { "label": "券", "value": 2 }], translation: true },
    formType: 'radio',
    commonRules: [{ required: false, message: '卡券类型 必填' }],
  },
  {
    title: '减免类型',
    dataIndex: 'discount_type',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { name: 'bizCouponDiscountType', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '减免类型必填' }],
  },
  {
    title: '产品',
    dataIndex: 'product_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/product/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    commonRules: [{ required: true, message: '产品必填' }],
    control: (val, maFormObject) => {
      if (val) {
        productApi.read(val)
          .then(res => {
            maFormObject.product_type_id = res.data.type_id
            maFormObject.product_grade_id = res.data.grade_id
          })
      }
    }
  },
  {
    title: '产品类型',
    dataIndex: 'product_type_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/productType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    disabled: true,
    formType: 'select',
    // commonRules: [{ required: true, message: '产品类型必填' }],
  },
  {
    title: '产品级别',
    dataIndex: 'product_grade_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/productGrade/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    disabled: true,
    formType: 'select',
    // commonRules: [{ required: true, message: '产品级别必填' }],
  },
  {
    title: '折扣门槛',
    dataIndex: 'discount_begin',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '折扣门槛必填' }],
  },
  {
    title: '折扣值',
    dataIndex: 'discount_value',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '折扣值必填' }],
  },
  {
    title: '面值',
    dataIndex: 'total',
    width: 180,
    search: false,
    addDisplay: true, addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '面值必填' }],
  },
  {
    title: '数量',
    dataIndex: 'nums',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '数量必填' }],
  },
  {
    title: '生效时间',
    dataIndex: 'start_time',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    searchFormType: 'range',
    showTime: true,
    formType: 'date',
    commonRules: [{ required: false, message: '生效时间必填' }],
  },
  {
    title: '失效时间',
    dataIndex: 'end_time',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    searchFormType: 'range',
    showTime: true,
    formType: 'date',
    commonRules: [{ required: false, message: '失效时间必填' }],
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    // commonRules: [{ required: false, message: '备注必填' }],
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
