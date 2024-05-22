<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 图标列 -->
			<template #icon="{ record }">
				<component :is="record.icon" v-if="record.icon" />
			</template>
			<!-- 状态列 -->
			<template #status="{ record }">
				<a-switch :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)"
					:default-checked="record.status == 1" />
			</template>
			<!-- 操作前置扩展 -->
			<template #operationBeforeExtend="{ record }">
				<a-link @click="openAddProduct(record)" v-if="record.row_type === 'order'" v-auth="[]"><icon-plus />
					产品</a-link>
				<a-link @click="openAddCraft(record)" v-if="record.row_type === 'goods'" v-auth="[]"><icon-plus />
					工艺</a-link>
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
const currentParentId = ref()

//添加产品操作
const openAddProduct = (record) => {
	console.log('record', record)
	console.log('openAddProduct', columns)
	resetColumnsDisplay()
	columns[1].addDefaultValue = record.order_id
	columns[2].addDefaultValue = 'goods'
	columns[3].addDefaultValue = record.store_id
	columns[3].disabled = true
	// columns[2].addDisplay = false
	columns[4].addDisplay = false
	columns[7].addDisplay = false
	crudRef.value.crudFormRef.add()
}

//添加工艺操作
const openAddCraft = (record) => {
	console.log('record', record)
	console.log('openAddCraft', columns)
	resetColumnsDisplay()
	columns[1].addDefaultValue = record.id;//goods_id
	columns[2].addDefaultValue = 'craft';
	columns[3].disabled = true;
	columns[3].addDisplay = false;
	columns[4].addDisplay = false;
	columns[5].addDefaultValue = record.product_id;
	columns[5].disabled = true;
	columns[6].addDisplay = false;
	columns[8].addDisplay = false;
	columns[9].addDisplay = false;
	columns[10].addDefaultValue = record.width;
	columns[10].disabled = true;
	columns[11].addDefaultValue = record.height;
	columns[11].disabled = true;
	columns[12].addDefaultValue = record.nums;
	columns[12].disabled = true;
	crudRef.value.crudFormRef.add()
}

//重置表格
const resetColumnsDisplay = () => {
	for (let i = 0; i < columns.length; i++) {
		if (columns[i].dataIndex == 'parent_id') {
			columns[i].addDisplay = false
			columns[i].editDisplay = false
		} else {
			columns[i].addDiPsplay = true
			columns[i].editDisplay = true
		}

	}
	window.setTimeout(() => {
		console.log('resetColumnsDisplay load!')
	}, 1500)
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
		console.log('beforeOpenAdd', columns)
		resetColumnsDisplay()
		columns[2].addDefaultValue = 'order';
		columns[5].addDisplay = false;
		columns[6].addDisplay = false;
		columns[7].addDisplay = false;
		columns[8].addDisplay = false;
		columns[9].addDisplay = false;
		columns[10].addDisplay = false;
		columns[11].addDisplay = false;
		columns[12].addDisplay = false;
		columns[13].addDisplay = false;
		columns[14].addDisplay = false;
		columns[15].addDisplay = false;
		columns[16].addDisplay = false;
		columns[17].addDisplay = false;


		return true
	},
	//编辑前操作
	beforeOpenEdit: (formData) => {
		console.log('beforeOpenEdit', columns)
		console.log('beforeOpenEdit Form', formData)
		resetColumnsDisplay()
		if (formData.row_type == 'order') {
			columns[3].disabled = true;
			columns[5].editDisplay = false;
			columns[6].editDisplay = false;
			columns[7].editDisplay = false;
			columns[8].editDisplay = false;
			columns[9].editDisplay = false;
			columns[10].editDisplay = false;
			columns[11].editDisplay = false;
			columns[12].editDisplay = false;
			columns[13].editDisplay = false;
			columns[14].editDisplay = false;
			columns[15].editDisplay = false;
			columns[16].editDisplay = false;
			columns[17].editDisplay = false;
		}
		else if (formData.row_type == 'goods') {
			// columns[2].editDefaultValue = formData.store_id
			// columns[2].disabled = true
			resetColumnsDisplay()
			columns[3].editDisplay = false
			columns[4].editDisplay = false
			columns[7].editDisplay = false
		}
		else if (formData.row_type == 'craft') {
			resetColumnsDisplay()
			columns[3].editDisplay = false
			columns[4].editDisplay = false
			columns[7].editDisplay = false
		}
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
		hide: true
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
			url: '/product/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		control: async (val, maFormObj) => {
			if (val) {
				const resp = await productApi.read(val)
				let item = resp.data
				maFormObj.product_grade_id = item.grade_id
				maFormObj.product_picture_type_id = item.picture_type_id
				maFormObj.pricing_type_id = item.pricing_type_id
				maFormObj.pricing_unit_id = item.pricing_unit_id
				maFormObj.unit_price = item.price
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
			url: '/craft/index?type=all',
			props: { label: 'name', value: 'id' },
			translation: true,
		},
		onChange: async (val, maFormObj) => {
			console.log('val', val)
			console.log('maFormObj', maFormObj)
			if (val) {
				const resp = await craftApi.read(val)
				console.log('resp', resp)
				let item = resp.data
				maFormObj.unit_price = item.price
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
		readonly: true,
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
		readonly: true,
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
		readonly: true,
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
		readonly: true,
		disabled: true,
	},
	{
		title: '单价',
		dataIndex: 'unit_price',
		defaultValue: '',
		readonly: true,
		disabled: true,
	},
	{
		title: '金额',
		dataIndex: 'amount',
		defaultValue: '',
		readonly: true,
		disabled: true,
	},
])
</script>

<style scoped>
.icon {
	width: 1em;
}
</style>
