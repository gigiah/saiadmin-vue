<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectChange">
      <!-- 表格前置扩展 -->
      <template #tableBeforeButtons>
        <a-button @click="printLabel()" type="primary" status="success">打印</a-button>
      </template>
      <!-- 操作前置扩展 -->
      <!-- <template #operationBeforeExtend="{ record }">
        <a-link v-if="record.row_type === 'goods' && record.associated_file" @click="openFileModal(record)" v-auth="[]">
          <icon-eye />查看文件
        </a-link>
      </template> -->
    </ma-crud>
    <div>
      <ma-form-modal ref="modalRef" v-model:visible="visible" :hide-title="true" :width="800" :column="modalColumn"
        :submit="() => { }">
      </ma-form-modal>
    </div>
    <div>
      <ma-form-modal ref="submitModalRef" v-model:visible="submitVisible" :hide-title="true" :width="800"
        :column="submitModalColumn" :submit="submitSummary">
      </ma-form-modal>
    </div>
    <!--打印标签-->
    <a-modal v-model:visible="labelPrintVisible" :footer="false" :hide-title="true" width="375px">
      <div id="printArea" ref="printArea">
        <!-- 这里是要打印的内容 -->
        <table v-for="item in orderTreeData" :key="item.id" style="margin-bottom: 30px;">
          <tr>
            <td colspan="7" class="code">{{ item.orderLabelNo }}</td>
          </tr>
          <tr>
            <td colspan="7" class="title">客户简称：{{ item.client }}</td>
          </tr>
          <tr>
            <td colspan="7" class="title">门店名称：{{ item.store }}</td>
          </tr>
          <tr>
            <td colspan="7" class="title">营销区域：{{ item.storeArea }}</td>
          </tr>
          <tr>
            <td colspan="7" class="title">价格体系：{{ item.storePricing }}</td>
          </tr>
          <!-- <tr>
            <td colspan="2">{{ item.client }}</td>
            <td>{{ item.store }}</td>
            <td>{{ item.storeArea }}</td>
            <td>{{ item.storePricing }}</td>
          </tr> -->
          <!-- <tr>
            <td colspan="7" style="height: 20px;"></td>
          </tr> -->
          <tr>
            <td width="20%">产品名称</td>
            <td width="10%">宽</td>
            <td width="10%">高</td>
            <td width="10%">数量</td>
            <td width="20%">制作选项</td>
            <td width="20%">文件名称</td>
            <td width="10%">标识符</td>
          </tr>
          <tr v-for="itemGoods in item.goods" :key="itemGoods.id">
            <td>{{ itemGoods.name }}</td>
            <td>{{ itemGoods.width }}</td>
            <td>{{ itemGoods.height }}</td>
            <td>{{ itemGoods.nums }}</td>
            <td>{{ itemGoods.craftDesc }}</td>
            <td>{{ itemGoods.associatedFileName }}</td>
            <td>{{ itemGoods.identify }}</td>
          </tr>
        </table>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { judgeCode } from "@/utils/common";
import api from '@/api/order'
import summaryOrderApi from '@/api/summaryOrder'
import productApi from '@/api/product'
import craftApi from '@/api/craft'
import uploadBatchApi from '@/api/uploadBatch'
import pricingProductApi from '@/api/pricingProduct'
import pricingCraftApi from '@/api/pricingCraft'
import billApi from '@/api/bill'
import { Message, Modal } from '@arco-design/web-vue'
import MaFormModal from "@/components/ma-form-modal/index.vue"

const crudRef = ref()
const deleteForms = ref([])
const selecteds = ref([])
const nextStage = ref('')
const currentStatus = ref([50, 60, 70, 90])
const requestParamsData = ref()
const loading = ref(false)
const triggerPrinter = ref(false);

const modalRef = ref()
const visible = ref(false)
const labelPrintVisible = ref(false)

const submitModalRef = ref()
const submitVisible = ref(false)

const orderTreeData = ref([])

const currentClientGrpId = ref(false)

const orderShowIndex = {
  'store_id': { 'addDisabled': false, 'editDisabled': true },
  'consignee_id': { 'addDisabled': false, 'editDisabled': true },
  'freight': { 'addDisabled': false, 'editDisabled': false },
  'label_no': { 'addDisabled': false, 'editDisabled': true },
  'label_sub_no': { 'addDisabled': false, 'editDisabled': false },
}

const goodsShowIndex = {
  // 'store_id': { 'addDisabled': true, 'editDisabled': true },
  'product_id': { 'addDisabled': false, 'editDisabled': true },
  'associated_file': { 'addDisabled': false, 'editDisabled': true },
  // 'correct_file': { 'addDisabled': false, 'editDisabled': true },
  'identify': { 'addDisabled': false, 'editDisabled': true },
  'product_grade_id': { 'addDisabled': true, 'editDisabled': true },
  'product_picture_type_id': { 'addDisabled': true, 'editDisabled': true },
  'width': { 'addDisabled': false, 'editDisabled': true },
  'height': { 'addDisabled': false, 'editDisabled': true },
  'nums': { 'addDisabled': true, 'editDisabled': true },
  'remark': { 'addDisabled': false, 'editDisabled': true },
  'pricing_type_id': { 'addDisabled': true, 'editDisabled': true },
  'pricing_unit_id': { 'addDisabled': true, 'editDisabled': true },
  'unit_price': { 'addDisabled': true, 'editDisabled': true },
  'amount': { 'addDisabled': true, 'editDisabled': true },
  'label_no': { 'addDisabled': false, 'editDisabled': false },
  'label_sub_no': { 'addDisabled': false, 'editDisabled': false },
}

const craftShowIndex = {
  // 'product_id': { 'addDisabled': true, 'editDisabled': true },
  'craft_id': { 'addDisabled': false, 'editDisabled': true },
  'width': { 'addDisabled': true, 'editDisabled': true },
  'height': { 'addDisabled': true, 'editDisabled': true },
  'nums': { 'addDisabled': true, 'editDisabled': true },
  'remark': { 'addDisabled': false, 'editDisabled': true },
  'pricing_type_id': { 'addDisabled': true, 'editDisabled': true },
  'pricing_unit_id': { 'addDisabled': true, 'editDisabled': true },
  'unit_price': { 'addDisabled': true, 'editDisabled': true },
  'amount': { 'addDisabled': true, 'editDisabled': true },
}

const openPrintWindow = async () => {
  await nextTick(); // 确保 DOM 已经更新
  const printHTML = document.querySelector('#printArea').innerHTML;
  const printWindow = window.open('', '_blank');
  const printStyles = `
    .icon {
      width: 1em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    .code {
      font-weight: bolder;
      font-size: 16px;
    }
    .title {
      font-weight: bolder;
      text-align: left;
    }
    th, td {
      border: 1px solid #000;
      padding: 2px;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
    }
  `;
  printWindow.document.write(`
    <html>
      <head>
        <title>大格标签打印</title>
        <style>
          ${printStyles}
        </style>
      </head>
      <body>
        ${printHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  labelPrintVisible.value = false;
};

watch(triggerPrinter, (newValue) => {
  if (newValue) {
    openPrintWindow();
  }
});

watch(labelPrintVisible, (newValue) => {
  if (newValue) {
    triggerPrinter.value = true;
  } else {
    triggerPrinter.value = false;
  }
});

const selectChange = (val) => {
  selecteds.value = val
}

const printLabel = () => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  let orderIds = []
  let goodsIds = []
  console.log('selecteds', selecteds)
  selecteds.value.forEach(function (id) {
    if (judgeCode(id) === 'order') orderIds.push(id)
    if (judgeCode(id) === 'goods') goodsIds.push(id)
  })
  if (orderIds.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  let timer = null
  api.orderTree4Print({ order_ids: orderIds, goods_ids: goodsIds })
    .then(res => {
      orderTreeData.value = transformData(res.data)
      console.log('transformData', orderTreeData.value)
      labelPrintVisible.value = true
      // loading.value = true;
    })
}

const transformData = (data) => {
  return data.map(order => {
    // 处理订单级别数据
    const transformedOrder = {
      id: order.id,
      orderLabelNo: order.label_no,
      client: order.client_name,
      store: order.store_name,
      storeArea: order.store_area_type_name,
      storePricing: order.store_pricing_type_name,
      goods: []
    };

    // 遍历订单下的商品数据
    order.children.forEach(good => {
      // 处理商品级别数据
      const transformedGood = {
        name: good.product_name,
        width: parseFloat(good.width),
        height: parseFloat(good.height),
        nums: good.nums,
        craftDesc: good.craft_desc || '',
        identify: good.identify,
        associatedFileName: good.associated_file_name || '',
      };
      // 将处理后的商品添加到订单的商品列表中
      transformedOrder.goods.push(transformedGood);
    });

    return transformedOrder;
  });
};

const summaryOrders = async () => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条订单')
    return false
  }
  let orderIds = []
  console.log('selecteds', selecteds)
  selecteds.value.forEach(function (id) {
    if (judgeCode(id) === 'order') orderIds.push(id)
  })
  if (orderIds.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  submitVisible.value = true
  return
}

const submitBills = async () => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  let orderIds = []
  console.log('selecteds', selecteds)
  selecteds.value.forEach(function (id) {
    if (judgeCode(id) === 'order') orderIds.push(id)
  })
  if (orderIds.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  Modal.info({
    title: '提示',
    content: '确定生成吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await billApi.handleCreateBill({
        orderIds: orderIds,
        requestParamsData: requestParamsData.value,
      }).then(res => {
        if (res.code == 200) {
          Message.success('生成成功')
          crudRef.value.refresh()
        }
      })
      crudRef.value.refresh()
    },
  })
  return true
}

const submitSummary = async (formData) => {
  let orderIds = []
  selecteds.value.forEach(function (id) {
    if (judgeCode(id) === 'order') orderIds.push(id)
  })
  summaryOrderApi.handleOrderSummary({
    orderIds: orderIds,
    summaryBatchCode: formData.summary_batch_code
  }).then(res => {
    if (res.code == 200) {
      Message.success('汇总成功')
      crudRef.value.refresh()
    }
  })

}

const submitOrders = async () => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  let orderIds = []
  console.log('selecteds', selecteds)
  selecteds.value.forEach(function (id) {
    if (judgeCode(id) === 'order') orderIds.push(id)
  })
  if (orderIds.length === 0) {
    Message.error('至少要选择一条订单')
    return
  }
  Modal.info({
    title: '提示',
    content: '确定发起吗？',
    simple: false,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await api.handleOrderChange({
        ids: orderIds,
        value: nextStage.value,
      })
      crudRef.value.refresh()
    },
  })
  return true
}

const openFileModal = (record) => {
  console.log(record)
  uploadBatchApi.read(record.associated_file)
    .then(res => {
      Object.keys(res.data).forEach((key) => {
        modalRef.value.form[key] = res.data[key]
      })
      visible.value = true
    })
  return
}

//产品/工艺添加操作
const openAdd = (record) => {
  console.log('openAddRecord', record)
  console.log('openAdd', columns)
  if (record.row_type == 'order') {
    resetAddColumnsDisplay('goods')
    setColumnsValue('parent_id', record.id, 'add')
    setColumnsValue('row_type', 'goods', 'add')
    setColumnsValue('store_id', record.store_id, 'add')
  }
  else if (record.row_type == 'goods') {
    resetAddColumnsDisplay('craft')
    setColumnsValue('parent_id', record.id, 'add')
    setColumnsValue('row_type', 'craft', 'add')
    setColumnsValue('product_Id', record.product_id, 'add')
    setColumnsValue('width', String(record.width), 'add')
    setColumnsValue('height', String(record.height), 'add')
    setColumnsValue('nums', String(record.nums), 'add')
    setColumnsValue('pricing_type_id', undefined, 'add')
    setColumnsValue('pricing_unit_id', undefined, 'add')
    setColumnsDict('craft_id', { product_id: record.product_id }, 'add')
  }
  crudRef.value.crudFormRef.add()
}

const setColumnsValue = (index, value, type) => {
  columns.forEach(function (item, i) {
    if (index == item.dataIndex) {
      if (type == 'add') {
        columns[i].addDefaultValue = value
      } else {
        columns[i].editDefaultValue = value
      }
    }
  })
}

const setColumnsDict = (index, value) => {
  columns.forEach(function (item, i) {
    if (index == item.dataIndex) {
      columns[i].dict.params = value
    }
  })
}

//重置添加
const resetAddColumnsDisplay = (type) => {
  console.log('type', type)
  for (let i = 0; i < columns.length; i++) {
    columns[i].addDefaultValue = undefined
    let showIndex = {}
    if (type == 'order') {
      showIndex = orderShowIndex
    }
    else if (type == 'goods') {
      showIndex = goodsShowIndex
    }
    else if (type == 'craft') {
      showIndex = craftShowIndex
    }
    if (showIndex[columns[i].dataIndex]) {
      columns[i].addDisplay = true
      if (showIndex[columns[i].dataIndex].addDisabled == true) {
        columns[i].addDisabled = true
      } else {
        columns[i].addDisabled = false
      }
    } else {
      columns[i].addDisplay = false
    }
  }
}

//重置编辑
const resetEditColumnsDisplay = (type) => {
  console.log('type', type)
  for (let i = 0; i < columns.length; i++) {
    columns[i].editDefaultValue = undefined
    let showIndex = {}
    if (type == 'order') {
      showIndex = orderShowIndex
    }
    else if (type == 'goods') {
      showIndex = goodsShowIndex
    }
    else if (type == 'craft') {
      showIndex = craftShowIndex
    }
    if (showIndex[columns[i].dataIndex]) {
      columns[i].editDisplay = true
      if (showIndex[columns[i].dataIndex].editDisabled == true) {
        columns[i].editDisabled = true
      } else {
        columns[i].editDisabled = false
      }
    } else {
      columns[i].editDisplay = false
    }
  }
}

const deleteByForm = (id, table) => {
  table.forEach(function (item) {
    if (item.id == id) {
      deleteForms.value.push({
        type: item.row_type,
        id: item.id
      })
    }
    if (item.children) {
      deleteByForm(id, item.children)
    }
  })
}

const crud = reactive({
  api: api.orderTree4Delivery,
  requestParams: {
    status: currentStatus,
    show_children: 1,
  },
  recycleApi: api.getRecyclePageList,
  showIndex: false,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 100,
  add: { show: false, text: '门店订单', title: '添加', api: api.save, auth: [] },
  edit: { show: true, text: '编辑', title: '编辑', api: api.update, auth: [] },
  delete: { show: false, api: api.delete, auth: [], realApi: api.realDestroy, realAuth: [] },
  recovery: { show: false, api: api.recovery, auth: [] },
  formOption: { width: 600 },
  isExpand: true,
  size: 'mini',
  // resizable: false,
  stripe: false,
  columnWidth: 80,
  beforeSearch: (requestParams) => {
    requestParams.orderBy = 'id'
    requestParams.orderType = 'desc'
  },
  afterSearch: (requestParams) => {
    console.log('requestParams', requestParams)
    requestParamsData.value = requestParams
    currentClientGrpId.value = requestParamsData.value.client_group_id && requestParamsData.value.client_group_id != undefined ? requestParamsData.value.client_group_id : null
    // areaTypeDict()
  },
  //添加门店前操作
  beforeOpenAdd: () => {
    console.log('beforeOpenAddColumns', columns)
    resetAddColumnsDisplay('order')
    setColumnsValue('parent_id', 0, 'add')
    setColumnsValue('row_type', 'order', 'add')
    return true
  },
  //编辑门店/产品/工艺前操作
  beforeOpenEdit: async (formData) => {
    console.log('beforeOpenEditColumns', columns)
    console.log('beforeOpenEditForm', formData)
    resetEditColumnsDisplay(formData.row_type)
    return true
  },
  //删除门店/产品/工艺前操作
  beforeDelete: (ids) => {
    console.log('beforeDeleteIds', ids)
    console.log('beforeDeleteTableData', crudRef.value.getTableData())
    deleteForms.value = []
    ids.forEach(id => {
      deleteByForm(id, crudRef.value.getTableData())
    })
    api.handleDelete(deleteForms.value)
    return true
  },
})

const columns = reactive([
  {
    title: 'ID',
    dataIndex: 'id',
    addDisplay: false,
    editDisplay: false,
    width: 50,
    hide: true
  },
  {
    title: '父级ID',
    dataIndex: 'parent_id',
    addDisplay: false,
    editDisplay: false,
    width: 50,
    hide: true,
    editDefaultValue: (record) => {
      return record.parent_id == 0 ? undefined : record.parent_id
    },
  },
  {
    title: '行类型',
    dataIndex: 'row_type',
    addDisplay: false,
    editDisplay: false,
    hide: true,
  },
  {
    title: '客方',
    dataIndex: 'client_group_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    dict: { url: '/clientGroup/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
    cascaderItem: ['area_type_id', 'pricing_type_id', 'store_id'],
    commonRules: [{ required: false, message: '客方必填' }],
  },
  {
    title: '发货计划',
    dataIndex: 'delivery_time',
    search: true,
    searchFormType: 'range',
    showTime: false,
    formType: 'date',
    width: 200,
  },
  {
    title: '营销区域',
    dataIndex: 'area_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: true,
    dict: { url: '/storeAreaType/index?type=all&client_group_id={{key}}', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
  },
  {
    title: '价格体系',
    dataIndex: 'pricing_type_id',
    width: 100,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: true,
    dict: { url: '/storePricingType/index?type=all&client_group_id={{key}}', props: { label: 'name', value: 'id' }, translation: true },
    formType: 'select',
  },
  {
    title: '门店',
    dataIndex: 'store_id',
    search: true,
    formType: 'select',
    hide: true,
    dict: {
      url: '/store/index?type=all&client_group_id={{key}}',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    commonRules: [{ required: true, message: '门店必填' }],
    width: 100,
    editDefaultValue: (record) => {
      return record.store_id == 0 ? undefined : record.store_id
    },
  },
  //名称开始
  {
    title: '营销区域',
    dataIndex: 'store_area_type',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
  },
  {
    title: '价格体系',
    dataIndex: 'store_pricing_type',
    width: 100,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
  },
  {
    title: '门店',
    dataIndex: 'store_name',
    search: false,
    formType: 'input',
    hide: false,
  },
  //名称结束
  {
    title: '订单号',
    dataIndex: 'code',
    search: true,
    width: 200,
  },
  {
    title: '产品名',
    dataIndex: 'product_id',
    formType: 'select',
    dict: {
      url: '/pricingProduct/index4Search?range=all&type=client',
      props: { label: 'name', value: 'product_id' },
      translation: true,
    },
    commonRules: [{ required: true, message: '产品必填' }],
  },
  {
    title: '产品级别',
    dataIndex: 'product_grade_id',
    formType: 'select',
    dict: {
      url: '/productGrade/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    disabled: true,
  },
  {
    title: '画面类型',
    dataIndex: 'product_picture_type_id',
    formType: 'select',
    dict: {
      url: '/productPictureType/index?type=all',
      props: { label: 'name', value: 'id' },
      translation: true,
    },
    disabled: true,
  },
  {
    title: '宽度CM',
    dataIndex: 'width',
  },
  {
    title: '高度CM',
    dataIndex: 'height',
  },
  {
    title: '数量',
    dataIndex: 'nums',
  },
  {
    title: '制作选项',
    dataIndex: 'craft_desc',
  },
  {
    title: '标签号',
    dataIndex: 'label_no',
    width: 200,
    editDisplay: true,
  },
  {
    title: '标签子号',
    dataIndex: 'label_sub_no',
    editDisplay: true,
  }
])

const modalColumn = reactive([
  {
    title: '标题',
    dataIndex: 'title',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '标题必填' }],
  },
  {
    title: '源文件',
    dataIndex: 'source_file',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '源文件必填' }],
  },
  {
    title: '预览图',
    dataIndex: 'preview_image',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'image',
    returnType: 'url',
    multiple: false,
    disabled: true,
    commonRules: [{ required: false, message: '预览图必填' }],
  },
  {
    formType: 'card',
    title: '链接文件',
    formList: [
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'link_file_list',
        type: 'table',
        showBtn: false,
        disabled: true,
        formList: [
          {
            title: '文件名',
            hideLabel: true,
            dataIndex: 'label',
            disabled: true,
            formType: 'input',
            width: 150,
          },
          {
            title: '地址',
            hideLabel: true,
            dataIndex: 'value',
            disabled: true,
            formType: 'input',
          },
        ],
      },
    ],
  },
])

const submitModalColumn = reactive([
  {
    title: '批次号',
    dataIndex: 'summary_batch_code',
    width: 180,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    commonRules: [{ required: true, message: '批次号必填' }],
  },
])

</script>

<style scoped>
.icon {
  width: 1em;
}

/* 添加一些样式使打印内容更好看 */
.container {
  padding: 10px;
  margin: 0;
}

table {
  /* width: 100%; */
  width: 335px;
  border-collapse: collapse;
  font-size: 10px;
}

.title {
  font-weight: bolder;
}

th,
td {
  border: 1px solid #000;
  padding: 2px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}
</style>
