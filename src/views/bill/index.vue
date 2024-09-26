<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
			<template #tableButtons>
				<a-button style="display: none;">生成对账单</a-button>
			</template>
      <template #operationBeforeExtend="{ record }">
        <a-space v-if="record.manual_excel" size="mini">
          <a-link @click="downloadManualExcel(record)"><icon-to-bottom />结算对账单</a-link>
        </a-space>
        <a-space size="mini">
          <a-link @click="exportBill(record)"><icon-to-bottom />系统对账单</a-link>
        </a-space>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/bill'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'

const crudRef = ref()

// const exportBill = async (record) => {
//   Message.info('对账单下载中，请稍后')
//   const response = await api.exportBillExcel({ id: record.id })
//   if (response) {
//     tool.download(response, record.name + '系统对账单.xlsx')
//     Message.success('开始下载')
//   } else {
//     Message.error('下载失败')
//   }
// }

const exportBill = async (record) => {
  let res = await api.exportBillExcel({ id: record.id })
  window.location.href = res.data.filePath
}

const downloadManualExcel = async (record) => {
  window.location.href = record.manual_excel
}

const crud = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  searchColNumber: 4,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: false },
  operationColumn: true,
  operationColumnWidth: 330,
  add: { show: false, api: api.save, auth: ['/bill/save'] },
  edit: { show: true, api: api.update, auth: ['/bill/update'] },
  delete: { show: true, api: api.delete, auth: ['/bill/destroy'] },
  recovery: { show: true, api: api.recovery, auth: ['/bill/recovery'] },
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
    title: '客户*',
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
    cascaderItem: ['client_sys_id'],
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
    commonRules: [{ required: true, message: '系统对账单必填' }],
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
    title: '生成日期*',
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
  {
    title: '结算对账单',
    dataIndex: 'manual_excel',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'file',
    multiple: false,
    requestData: { storageType: 'app' },
    commonRules: [{ required: false, message: '提交对账单必填' }],
  },
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
    commonRules: [{ required: true, message: '结算金额必填' }],
  },
  // {
  //   title: '状态',
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
  //     url: '/core/user/index?type=all&code=financial',
  //     props: { label: 'nickname', value: 'id' },
  //     translation: true,
  //   },
  //   formType: 'select',
  //   commonRules: [{ required: true, message: '财务人员必填' }],
  // },
  {
    title: '财务可视',
    dataIndex: 'finance_show',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
    formType: 'radio',
    // commonRules: [{ required: false, message: '财务可视必填' }],
    control: (val) => {
      if (val == 1) {
        return {
          finance_show: { disabled: true },
        }
      } else {
        return {
          finance_show: { disabled: false },
        }
      }
    }
  },
  {
    title: '客方人员',
    dataIndex: 'client_sys_id',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: true,
    dict: {
      url: '/core/user/index?type=all&isClient=1&client_group_id={{key}}',
      props: { label: 'nickname', value: 'id' },
      translation: true,
    },
    formType: 'select',
    commonRules: [{ required: true, message: '客方人员必填' }],
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
    commonRules: [{ required: true, message: '备注必填' }],
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
