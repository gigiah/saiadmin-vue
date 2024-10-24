<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space v-if="record.manual_excel" size="mini">
          <a-link @click="downloadManualExcel(record)"><icon-to-bottom />结算对账单</a-link>
        </a-space>
        <a-space size="mini" v-if="record.fapiao_method != 0">
          <a-link @click="viewItems(record)"><icon-menu />发票处理</a-link>
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
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import { useSysInfoStore } from '@/store'

const crudRef = ref()

const itemRef = ref()

const sysInfoStore = useSysInfoStore()

const viewItems = (record) => {
  itemRef.value.open(record)
}

const downloadManualExcel = async (record) => {
  if (!record.manual_excel) {
    Message.error('暂无结算单')
  } else {
    window.location.href = record.manual_excel
  }
}

const crud = reactive({
  api: api.getPageList,
  requestParams: {  client_group_id: sysInfoStore.info.client_group_id },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 3,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 280,
  add: { show: false, api: api.save },
  edit: { show: true, text: '选择开票方式', api: api.update },
  delete: { show: false, api: api.delete },
  recovery: { show: false, api: api.recovery },
  formOption: { width: 800 },
  beforeOpenEdit: (formData) => {
		console.log('beforeOpenEditColumns', columns)
		console.log('beforeOpenEditForm', formData)
    if(formData.type == 1){
      Message.error('现结账单不可选择')
      return false;
    }
		return true
	},
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
    disabled: true,
    commonRules: [{ required: true, message: '主键必填' }],
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
    title: '对账单',
    dataIndex: 'manual_excel',
    width: 200,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'file',
    disabled: true,
    // commonRules: [{ required: true, message: '结算对账单必填' }],
  },
  // {
  //   title: '汇总金额',
  //   dataIndex: 'total',
  //   width: 180,
  //   search: false,
  //   addDisplay: true, addDefaultValue: 0.00,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'input',
  //   commonRules: [{ required: true, message: '汇总金额必填' }],
  // },
  {
    title: '结算金额',
    dataIndex: 'bill_total',
    width: 180,
    search: false,
    addDisplay: true,
    addDefaultValue: 0.00,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '结算金额必填' }],
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
      url: '/core/user/index?type=all',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    disabled: true,
    commonRules: [{ required: false, message: '对账人员必填' }],
  },
  {
    title: '生成时间*',
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
    commonRules: [{ required: false, message: '创建时间必填' }],
  },
  {
    title: '发票方式',
    dataIndex: 'fapiao_method',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { name: 'bizFapiaoMethod', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'radio',
    control: (val) => {
      if (val > 0) {
        return {
          fapiao_method: { disabled: true }
        }
      } else {
        return {
          fapiao_method: { disabled: false }
        }
      }
    },
    commonRules: [{ required: false, message: '发票方式必填' }],
  },
  // {
  //   title: '提交对账单',
  //   dataIndex: 'manual_excel',
  //   width: 180,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   formType: 'input',
  //   commonRules: [{ required: false, message: '提交对账单必填' }],
  // },
  // {
  //   title: '发票状态',
  //   dataIndex: 'fapiao_status',
  //   width: 100,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
  //   formType: 'select',
  //   commonRules: [{ required: false, message: '状态必填' }],
  // },
  // {
  //   title: '财务人员',
  //   dataIndex: 'finance_sys_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: {
  //     url: '/core/user/index?type=all',
  //     props: { label: 'nickname', value: 'id' },
  //     translation: true,
  //   },
  //   formType: 'select',
  //   commonRules: [{ required: false, message: '财务人员必填' }],
  // },
  // {
  //   title: '客方人员',
  //   dataIndex: 'client_sys_id',
  //   width: 100,
  //   search: false,
  //   addDisplay: true,
  //   editDisplay: true,
  //   hide: false,
  //   dict: {
  //     url: '/core/user/index?type=all',
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
