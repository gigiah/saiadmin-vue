<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="openModal(record)" v-auth="[]">
          <icon-eye />查看运单
        </a-link>
      </template>
    </ma-crud>
    <div>
      <ma-form-modal ref="modalRef" v-model:visible="visible" :hide-title="true" :width="800" :column="modalColumn"
        :submit="submitModal">
      </ma-form-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/deliveryBatch'
import { Message } from '@arco-design/web-vue'
import MaFormModal from "@/components/ma-form-modal/index.vue"

const crudRef = ref()
const modalRef = ref()
const visible = ref(false)

const openModal = (record) => {
  api.read(record.id)
    .then(res => {
      Object.keys(res.data).forEach((key) => {
        modalRef.value.form[key] = res.data[key]
      })
      visible.value = true
    })
  return
}

const submitModal = async (formData) => {
  console.log('data', formData)
  api.update(formData.id, formData)
    .then(res => {
      if (res.code == 200) {
        Message.success('保存成功')
      } else {
        Message.error('保存失败');
      }
    }).catch(error => {
      Message.error('保存失败')
    })
}

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: false },
  operationColumn: true,
  operationColumnWidth: 160,
  add: { show: false, api: api.save, auth: ['/deliveryBatch/save'] },
  edit: { show: true, api: api.update, auth: ['/deliveryBatch/update'] },
  delete: { show: false, api: api.delete, auth: ['/deliveryBatch/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/deliveryBatch/recovery'] },
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
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '客方组必填' }],
  },
  {
    title: '批次号',
    dataIndex: 'code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '批次号必填' }],
  },
  {
    title: '物流公司',
    dataIndex: 'carrier_code',
    formType: 'select',
    dict: { name: 'bizCarrier', props: { label: 'label', value: 'value' }, translation: true },
  },
  {
    title: '物流单号',
    dataIndex: 'delivery_code',
    formType: 'input',
    width: 200,
  },
  {
    title: '批次号',
    dataIndex: 'code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: false, message: '批次号必填' }],
  },
  {
    title: '所属团队',
    dataIndex: 'dept_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '所属团队必填' }],
  },
  {
    title: '人员ID',
    dataIndex: 'sys_user_id',
    width: 180,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: true,
    formType: 'input',
    commonRules: [{ required: false, message: '人员ID必填' }],
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

const modalColumn = reactive([
  {
    title: '物流公司',
    dataIndex: 'carrier_code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    disabled: true,
    dict: { name: 'bizCarrier', props: { label: 'label', value: 'value' }, translation: true },
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    title: '物流单号',
    dataIndex: 'delivery_code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    title: '发货批次号',
    dataIndex: 'code',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    title: '运单金额',
    dataIndex: 'freight_total',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: false,
    // commonRules: [{ required: true, message: '必填' }],
  },
  {
    formType: 'card',
    title: '包含订单',
    formList: [
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'orders',
        type: 'table',
        showBtn: true,
        disabled: false,
        formList: [
          {
            title: '订单号码',
            hideLabel: true,
            dataIndex: 'code',
            disabled: false,
            formType: 'input',
            width: 300,
          },
          {
            title: '订单运费',
            hideLabel: true,
            dataIndex: 'freight_avg',
            disabled: false,
            formType: 'input',
            width: 150,
          },
        ],
      },
    ],
  },
])

</script>
