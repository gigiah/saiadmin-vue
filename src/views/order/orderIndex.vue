<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectChange">
			<!-- 表格前置扩展 -->
			<!-- <template #tableBeforeButtons>
				<a-button @click="submitOrders()" type="primary" status="success">发起审订</a-button>
			</template> -->
			<!-- 操作前置扩展 -->
			<!-- <template #operationBeforeExtend="{ record }">
				<a-link v-if="record.row_type === 'order' || record.row_type == 'goods'" @click="openAdd(record)"
					v-auth="[]">
					<icon-plus /> {{ record.row_type === 'order' ? '产品' : '工艺' }}
				</a-link>
			</template> -->
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { judgeCode } from "@/utils/common";
import api from '@/api/order'
import productApi from '@/api/product'
import craftApi from '@/api/craft'
import pricingProductApi from '@/api/pricingProduct'
import pricingCraftApi from '@/api/pricingCraft'
import { Message, Modal } from '@arco-design/web-vue'

const crudRef = ref()
const deleteForms = ref([])
const selecteds = ref([])
const nextStage = ref('')
const currentStatus = ref([40, 50, 60, 70, 90])

const orderShowIndex = {
	'store_id': { 'addDisabled': false, 'editDisabled': true },
	'consignee_id': { 'addDisabled': false, 'editDisabled': true },
	'freight': { 'addDisabled': false, 'editDisabled': false },
}

const goodsShowIndex = {
	// 'store_id': { 'addDisabled': true, 'editDisabled': true },
	'product_id': { 'addDisabled': false, 'editDisabled': true },
	'associated_file': { 'addDisabled': false, 'editDisabled': true },
	'correct_file': { 'addDisabled': false, 'editDisabled': true },
	'identify': { 'addDisabled': false, 'editDisabled': true },
	'product_grade_id': { 'addDisabled': true, 'editDisabled': true },
	'product_picture_type_id': { 'addDisabled': true, 'editDisabled': true },
	'width': { 'addDisabled': false, 'editDisabled': true },
	'height': { 'addDisabled': false, 'editDisabled': true },
	'nums': { 'addDisabled': false, 'editDisabled': false },
	'remark': { 'addDisabled': false, 'editDisabled': true },
	'pricing_type_id': { 'addDisabled': true, 'editDisabled': true },
	'pricing_unit_id': { 'addDisabled': true, 'editDisabled': true },
	'unit_price': { 'addDisabled': true, 'editDisabled': true },
	'amount': { 'addDisabled': true, 'editDisabled': true },
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

const selectChange = (val) => {
	selecteds.value = val
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

//产品/工艺添加操作
const openAdd = (record) => {
	console.log('openAddRecord', record)
	console.log('openAdd', columns)
	setColumnsValue()
	if (record.row_type == 'order') {
		resetAddColumnsDisplay('goods')
		setColumnsValue('parent_id', record.id, 'add')
		setColumnsValue('row_type', 'goods', 'add')
		setColumnsValue('store_id', record.store_id, 'add')
		// columns[1].addDefaultValue = record.id;//order_id
		// columns[2].addDefaultValue = 'goods'
		// columns[3].addDefaultValue = record.store_id
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
		// columns[1].addDefaultValue = record.id;//goods_id
		// columns[2].addDefaultValue = 'craft';
		// columns[5].addDefaultValue = record.product_id;
		// columns[10].addDefaultValue = String(record.width);
		// columns[11].addDefaultValue = String(record.height);
		// columns[12].addDefaultValue = String(record.nums);
		// columns[14].addDefaultValue = undefined
		// columns[15].addDefaultValue = undefined
		// columns[7].dict.params = { product_id: record.product_id }
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
	api: api.orderTree,
	requestParams: { status: currentStatus },
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 85,
	add: { show: false, text: '门店订单', title: '添加', api: api.save, auth: [] },
	edit: { show: true, text: '编辑', title: '编辑', api: api.update, auth: [] },
	delete: { show: false, api: api.delete, auth: [], realApi: api.realDestroy, realAuth: [] },
	recovery: { show: false, api: api.recovery, auth: [] },
	formOption: { viewType: 'drawer', width: 600 },
	isExpand: true,
	size: 'mini',
	resizable: false,
	stripe: false,
	columnWidth: 80,
	beforeSearch: (requestParams) => {
		requestParams.orderBy = 'id'
		requestParams.orderType = 'desc'
	},
	//添加门店前操作
	beforeOpenAdd: () => {
		console.log('beforeOpenAddColumns', columns)
		resetAddColumnsDisplay('order')
		columns[1].addDefaultValue = 0
		columns[2].addDefaultValue = 'order';
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
		title: '客方人员',
		dataIndex: 'client_id',
		width: 100,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		dict: { url: '/clientUser/index?type=all', props: { label: 'name', value: 'client_id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: false, message: '客方必填' }],
	},
	{
		title: '门店',
		dataIndex: 'store_id',
		search: true,
		formType: 'select',
		dict: {
			url: '/store/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		commonRules: [{ required: true, message: '门店必填' }],
		width: 100,
		editDefaultValue: (record) => {
			return record.store_id == 0 ? undefined : record.store_id
		},
	},
	{
		title: '提交人',
		dataIndex: 'order_submiter',
	},
	{
		title: '订单号',
		dataIndex: 'code',
		search: true,
		width: 200,
	},
	{
		title: '运费',
		dataIndex: 'freight',
	},
	{
		title: '订单金额',
		dataIndex: 'total_amount',
	},
	{
		title: '结算类型',
		dataIndex: 'settle_method',
		formType: 'select',
		dict: { name: 'bizSettleMethod', props: { label: 'label', value: 'value' }, translation: true },
	},
	// {
	// 	title: '支付状态',
	// 	dataIndex: 'pay_status',
	// },
	{
		title: '收货地址',
		dataIndex: 'consignee_id',
		formType: 'select',
		dict: {
			url: '/warehouseAddress/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		commonRules: [{ required: true, message: '收货地址必填' }],
		width: 150,

	},
	{
		title: '发货日期',
		dataIndex: 'delivery_time',
	},
	{
		title: '发货状态',
		dataIndex: 'delivery_status',
		formType: 'select',
		dict: { name: 'bizDeliveryStatus', props: { label: 'label', value: 'value' }, translation: true },
	},
	// {
	// 	title: '录单人',
	// 	dataIndex: 'order_creater',
	// },
	// {
	// 	title: '审订人',
	// 	dataIndex: 'order_checker',
	// },
	{
		title: '产品名',
		dataIndex: 'product_id',
		formType: 'select',
		dict: {
			url: '/pricingProduct/index4Search?type=all',
			props: { label: 'name', value: 'product_id' },
			translation: true,
		},
		onChange: async (val) => {
			if (val) {
				const modalForm = crudRef.value.getFormData();
				if (!modalForm) {
					Message.error('未找到表单对象');
					return;
				}
				const resp = await pricingProductApi.read4Order({ id: val })
				let item = resp.data
				modalForm.product_grade_id = item.grade_id
				modalForm.product_picture_type_id = item.picture_type_id
				modalForm.pricing_type_id = item.pricing_type_id
				modalForm.pricing_unit_id = item.pricing_unit_id
				modalForm.unit_price = item.price
			}
		},
		commonRules: [{ required: true, message: '产品必填' }],
	},
	{
		title: '文件名',
		dataIndex: 'associated_file',
		formType: 'select',
		dict: {
			url: '/uploadBatch/index?type=all',
			props: { label: 'title', value: 'id' },
			translation: true,
		},
		width: 150,
	},
	{
		title: '修正文件名',
		dataIndex: 'correct_file',
		formType: 'select',
		dict: {
			url: '/uploadBatch/index?type=all',
			props: { label: 'title', value: 'id' },
			translation: true,
		},
		width: 150,
	},
	{
		title: '识别符',
		dataIndex: 'identity',
	},
	{
		title: '工艺',
		dataIndex: 'craft_id',
		formType: 'select',
		dict: {
			url: '/pricingCraft/index4Search',
			params: { product_id: null },
			props: { label: 'name', value: 'craft_id' },
			translation: true,
		},
		onChange: async (val) => {
			if (val) {
				const modalForm = crudRef.value.getFormData();
				if (!modalForm) {
					Message.error('未找到表单对象');
					return;
				}
				const resp = await pricingCraftApi.read4Order({ id: val })
				let item = resp.data
				modalForm.pricing_type_id = item.pricing_type_id
				modalForm.pricing_unit_id = item.pricing_unit_id
				modalForm.unit_price = item.price
			}
		},
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
		title: '宽度',
		dataIndex: 'width',
	},
	{
		title: '高度',
		dataIndex: 'height',
	},
	{
		title: '数量',
		dataIndex: 'nums',
	},
	{
		title: '备注说明',
		dataIndex: 'remark',
		hide: true,
		formType: 'textarea',
	},
	{
		title: '计价方式',
		dataIndex: 'pricing_type_id',
		formType: 'select',
		dict: {
			url: '/pricingType/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		disabled: true,
	},
	{
		title: '计量单位',
		dataIndex: 'pricing_unit_id',
		formType: 'select',
		dict: {
			url: '/pricingUnit/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		disabled: true,
	},
	{
		title: '单价',
		dataIndex: 'unit_price',
		defaultValue: '',
		disabled: true,
	},
	{
		title: '金额',
		dataIndex: 'amount',
		defaultValue: '',
		disabled: true,
	},
])
</script>

<style scoped>
.icon {
	width: 1em;
}
</style>
