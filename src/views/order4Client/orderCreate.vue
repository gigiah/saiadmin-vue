<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 操作前置扩展 -->
			<template #operationBeforeExtend="{ record }">
				<a-link v-if="record.row_type === 'order' || record.row_type == 'goods'" @click="openAdd(record)"
					v-auth="[]">
					<icon-plus /> {{ record.row_type === 'order' ? '产品' : '工艺' }}
				</a-link>
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/order'
import productApi from '@/api/product'
import craftApi from '@/api/craft'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const deleteForms = ref([])

const orderShowIndex = {
	'store_id': { 'addDisabled': false, 'editDisabled': true },
	'consignee_id': { 'addDisabled': false, 'editDisabled': false },
}

const goodsShowIndex = {
	// 'store_id': { 'addDisabled': true, 'editDisabled': true },
	'product_id': { 'addDisabled': false, 'editDisabled': true },
	'associated_file': { 'addDisabled': false, 'editDisabled': false },
	'product_grade_id': { 'addDisabled': true, 'editDisabled': true },
	'product_picture_type_id': { 'addDisabled': true, 'editDisabled': true },
	'width': { 'addDisabled': false, 'editDisabled': false },
	'height': { 'addDisabled': false, 'editDisabled': false },
	'nums': { 'addDisabled': false, 'editDisabled': false },
	'remark': { 'addDisabled': false, 'editDisabled': false },
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
	'remark': { 'addDisabled': false, 'editDisabled': false },
	'pricing_type_id': { 'addDisabled': true, 'editDisabled': true },
	'pricing_unit_id': { 'addDisabled': true, 'editDisabled': true },
	'unit_price': { 'addDisabled': true, 'editDisabled': true },
	'amount': { 'addDisabled': true, 'editDisabled': true },
}

//产品/工艺添加操作
const openAdd = (record) => {
	console.log('openAddRecord', record)
	console.log('openAdd', columns)
	if (record.row_type == 'order') {
		resetAddColumnsDisplay('goods')
		columns[1].addDefaultValue = record.id;//order_id
		columns[2].addDefaultValue = 'goods'
		columns[3].addDefaultValue = record.store_id
	}
	else if (record.row_type == 'goods') {
		resetAddColumnsDisplay('craft')
		columns[1].addDefaultValue = record.id;//goods_id
		columns[2].addDefaultValue = 'craft';
		columns[5].addDefaultValue = record.product_id;
		columns[10].addDefaultValue = String(record.width);
		columns[11].addDefaultValue = String(record.height);
		columns[12].addDefaultValue = String(record.nums);
		columns[14].addDefaultValue = undefined
		columns[15].addDefaultValue = undefined
	}
	crudRef.value.crudFormRef.add()
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
	api: api.orderCreateTree,
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 200,
	add: { show: true, text: '门店订单', title: '添加', api: api.save, auth: [] },
	edit: { show: true, text: '编辑', title: '编辑', api: api.update, auth: [] },
	delete: { show: true, api: api.delete, auth: [], realApi: api.realDestroy, realAuth: [] },
	recovery: { show: true, api: api.recovery, auth: [] },
	formOption: { viewType: 'drawer', width: 600 },
	isExpand: true,
	size: 'small',
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
		// if (formData.row_type == 'order') {
		// 	//nothing
		// }
		// else if (formData.row_type == 'goods') {
		// 	const resp = await api.getByParentId({ parentId: formData.parent_id, type: 'order' })
		// 	if(resp){
		// 		columns[3].editDefaultValue = resp.data
		// 	}
		// }
		// else if (formData.row_type == 'craft') {
		// 	const resp = await api.getByParentId({ parentId: formData.parent_id, type: 'goods' })
		// 	if(resp){
		// 		columns[5].editDefaultValue = resp.data
		// 	}
		// }
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
		width: 120,
		editDefaultValue: (record) => {
			return record.store_id == 0 ? undefined : record.store_id
		},
	},
	// {
	// 	title: '订单号',
	// 	dataIndex: 'code',
	// },
	// {
	// 	title: '运费',
	// 	dataIndex: 'freight',
	// },
	// {
	// 	title: '订单金额',
	// 	dataIndex: 'total_amount',
	// },
	// {
	// 	title: '结算类型',
	// 	dataIndex: 'settlement',
	// },
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
	// {
	// 	title: '发货日期',
	// 	dataIndex: 'delivery_time',
	// },
	// {
	// 	title: '发货状态',
	// 	dataIndex: 'delivery_status',
	// },
	// {
	// 	title: '录单人',
	// 	dataIndex: 'order_creater',
	// },
	// {
	// 	title: '审订人',
	// 	dataIndex: 'order_checker',
	// },
	// {
	// 	title: '提交人',
	// 	dataIndex: 'order_submiter',
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
        const resp = await productApi.read(val)
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
	},
	{
		title: '工艺',
		dataIndex: 'craft_id',
		formType: 'select',
		dict: {
			url: '/pricingCraft/index4Search?type=all',
			props: { label: 'name', value: 'craft_id' },
			translation: true,
		},
		onChange: async (val) => {
			console.log('val', val)  // ----2
			if (val) {
        const modalForm = crudRef.value.getFormData();
        if (!modalForm) {
          Message.error('未找到表单对象');
          return;
        }
				const resp = await craftApi.read(val)
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
