<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #fapiao_status="{ record }">
        <a-switch :checked-value="1" unchecked-value="2" @change="changeFapiaoStatus($event, record.id)"
          :default-checked="record.fapiao_status == 1" :disabled="record.fapiao_status == 1" />
      </template>
      <template #checkout_status="{ record }">
        <a-switch :checked-value="1" unchecked-value="2" @change="changeCheckoutStatus($event, record.id)"
          :default-checked="record.checkout_status == 1" :disabled="record.checkout_status == 1" />
      </template>
      <template #operationBeforeExtend="{ record }">
        <a-space v-if="!record.manual_excel" size="mini">
          <a-link @click="downloadManualExcel(record)"><icon-to-bottom />结算对账单</a-link>
        </a-space>
        <a-space size="mini">
          <a-link @click="exportBill(record)"><icon-to-bottom />系统对账单</a-link>
          <a-link v-if="record.fapiao_method != 0" @click="viewItems(record)"><icon-menu />查看发票</a-link>
        </a-space>
      </template>
    </ma-crud>
    <bill-fapiao ref="itemRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/bill'
import billFapiao from '@/views/billFapiao/index.vue'
import { Message, Modal } from '@arco-design/web-vue'
import tool from '@/utils/tool'

const crudRef = ref()
const itemRef = ref()

const viewItems = (record) => {
  itemRef.value.open(record)
}

const exportBill = async (record) => {
  Message.info('系统对账单下载中，请稍后')
  const response = await api.exportBillExcel({ id: record.id })
  if (response) {
    tool.download(response, record.name + '系统对账单.xlsx')
    Message.success('开始下载')
  } else {
    Message.error('下载失败')
  }
}

const changeFapiaoStatus = async (status, id) => {
  Modal.info({
    title: '提示',
    content: '确认吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const response = await api.changeFapiaoStatus({ id, status })
      if (response.code === 200) {
        Message.success(response.message)
        crudRef.value.refresh()
      }
    },
    onCancel: async () => {
      console.log('cancel')
      crudRef.value.refresh()
    }
  })
}

const changeCheckoutStatus = async (status, id) => {
  Modal.info({
    title: '提示',
    content: '确认吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const response = await api.changeCheckoutStatus({ id, status })
      if (response.code === 200) {
        Message.success(response.message)
        crudRef.value.refresh()
      }
    },
    onCancel: async () => {
      console.log('cancel')
      crudRef.value.refresh()
    }
  })
}

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 310,
  add: { show: false, api: api.save },
  edit: { show: false, api: api.update },
  delete: { show: false, api: api.delete },
  recovery: { show: false, api: api.recovery },
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
    title: '客户',
    dataIndex: 'client_group_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'select',
    dict: { url: '/clientGroup/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    disabled: true,
    commonRules: [{ required: false, message: '客户必填' }],
  },
  {
    title: '开票人',
    dataIndex: 'fapiao_create_sys_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: {
      url: '/core/user/index?type=all&code=financial',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    disabled: true,
    // commonRules: [{ required: false, message: '财务人员必填' }],
  },
  {
    title: '结单人',
    dataIndex: 'bill_checkout_sys_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: {
      url: '/core/user/index?type=all&code=financial',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    disabled: true,
    // commonRules: [{ required: false, message: '财务人员必填' }],
  },
  {
    title: '结款类型',
    dataIndex: 'type',
    width: 100,
    search: true,
    addDisplay: true,
    addDefaultValue: 1,
    editDisplay: true,
    hide: false,
    dict: { name: 'bizBillType', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    disabled: true,
    commonRules: [{ required: true, message: '结款类型必填' }],
  },
  {
    title: '系统对账单',
    dataIndex: 'name',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '对账单名必填' }],
  },
  {
    title: '对账人员',
    dataIndex: 'service_sys_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: {
      url: '/core/user/index?type=all&code=service',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    disabled: true,
    commonRules: [{ required: false, message: '客服人员必填' }],
  },
  {
    title: '生成日期',
    dataIndex: 'create_time',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    searchFormType: 'range',
    showTime: true,
    formType: 'date',
    disabled: true,
    commonRules: [{ required: false, message: '生成日期必填' }],
  },
  {
    title: '系统金额',
    dataIndex: 'bill_total',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '系统金额必填' }],
  },
  // {
  //   title: '结算对账单',
  //   dataIndex: 'manual_excel',
  //   width: 180,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'input',
  //   disabled: true,
  //   commonRules: [{ required: false, message: '结算对账单必填' }],
  // },
  {
    title: '结算金额',
    dataIndex: 'final_total',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '结算金额' }],
  },
  {
    title: '开票确认',
    dataIndex: 'fapiao_status',
    width: 100,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: false,
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '状态必填' }],
  },
  {
    title: '收款确认',
    dataIndex: 'checkout_status',
    width: 100,
    search: false,
    addDisplay: false,
    editDisplay: false,
    hide: false,
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'select',
    commonRules: [{ required: false, message: '状态必填' }],
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: '',
    editDisplay: true,
    hide: false,
    formType: 'textarea',
  },
  // {
  //   title: '客方人员',
  //   dataIndex: 'client_sys_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: {
  //     url: '/core/user/index?type=all&code=client',
  //     props: { label: 'nickname', value: 'id' },
  //     translation: true,
  //   },
  //   formType: 'select',
  //   commonRules: [{ required: false, message: '客方人员必填' }],
  // },
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
