<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectChange">
			<!-- 表格前置扩展 -->
			<template #tableBeforeButtons>
				<a-button @click="submitApply()" type="primary" status="warning"><icon-check />提交</a-button>
			</template>
			<!-- 操作前置扩展 -->
			<template #operationBeforeExtend="{ record }">
				<a-link @click="applyPanel(record)"> <icon-code />修改 </a-link>
			</template>
		</ma-crud>
		<div>
			<ma-form-modal ref="modalRef" v-model:visible="modalVisible" :hide-title="true" :width="800" :column="applyColumn" :submit="applySubmit"> </ma-form-modal>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/storeItemApply'
import pricingCraftApi from '@/api/pricingCraft'
import { Message, Modal } from '@arco-design/web-vue'
import MaFormModal from '@/components/ma-form-modal/index.vue'

//模态编辑
const modalRef = ref()
const modalVisible = ref(false)
const craftSelection = ref([])
const buildCraftIds = (obj) => {
	let values = Object.values(obj)
	let hasEmptyString = values.includes('')
	let result = hasEmptyString ? '' : values.sort().join(',')
	return result
}
const getCraftSelection = async (craft_ids) => {
	let response = await pricingCraftApi.list('craft_ids=' + craft_ids)
	craftSelection.value = response.data.map((item) => ({
		label: item.name,
		value: item.id,
	}))
}
const applyPanel = async (record) => {
	let _craftIds = ''
	Object.keys(record).forEach((key) => {
		modalRef.value.form[key] = record[key]
	})
	_craftIds = buildCraftIds(record['item_craft_ids'])
	await getCraftSelection(_craftIds)
	modalVisible.value = true
}
const applySubmit = (formData) => {
	console.log(formData)
	api.updateApply(formData).then((res) => {
		console.log('res', res)
		if (res.code == 200) {
			Message.success('保存成功')
			crudRef.value.refresh()
		} else {
			Message.error('保存失败')
		}
	})
	return true
}

//批量选择
const selecteds = ref([])
const selectChange = (val) => {
	selecteds.value = val
}
const submitApply = async () => {
	if (selecteds.value.length === 0) {
		Message.error('至少要选择一条申请记录')
		return
	}
	let ids = []
	console.log('selecteds', selecteds)
	selecteds.value.forEach(function (id) {
		ids.push(id)
	})
	if (ids.length === 0) {
		Message.error('至少要选择一条申请记录')
		return
	}
	Modal.info({
		title: '提示',
		content: '每提交一次均生成独立订单！确定提交吗？',
		simple: false,
		okText: '确定',
		cancelText: '取消',
		onOk: async () => {
			await api
				.submitApply({
					ids: ids,
				})
				.then((res) => {
					if (res.code == 200) {
						Message.success('提交成功')
						crudRef.value.refresh()
					}
				})
			crudRef.value.refresh()
		},
	})
	console.log('ids', ids)
	return true
}

const crudRef = ref()

const crud = reactive({
	api: api.getPageList,
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	searchColNumber: 3,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 160,
	add: { show: true, api: api.save, auth: ['/storeItemApply/save'] },
	edit: { show: true, api: api.update, auth: ['/storeItemApply/update'] },
	delete: { show: true, api: api.delete, auth: [] },
	recovery: { show: true, api: api.recovery, auth: ['/storeItemApply/recovery'] },
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
	// {
	//   title: '门店',
	//   dataIndex: 'store_id',
	//   width: 180,
	//   search: false,
	//   addDisplay: true,
	//   editDisplay: true,
	//   hide: false,
	//   formType: 'input',
	//   commonRules: [{ required: false, message: '门店必填' }],
	// },
	// {
	// 	title: '用品类型ID',
	// 	dataIndex: 'gallery_item_id',
	// 	width: 180,
	// 	search: false,
	// 	addDisplay: true,
	// 	editDisplay: true,
	// 	hide: false,
	// 	formType: 'input',
	// 	commonRules: [{ required: false, message: '用品类型内容ID必填' }],
	// },
	{
		title: '用品类型',
		dataIndex: 'gallery_id',
		width: 150,
		search: false,
		addDisplay: true,
		editDisplay: true,
		editDisabled: true,
		hide: true,
		dict: { url: '/storeGallery/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: false, message: '用品类型ID必填' }],
	},
	{
		title: '用品名称',
		dataIndex: 'name',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		maxLength: 16,
		commonRules: [{ required: true, message: '名称必填' }],
	},
	{
		title: '源文件',
		dataIndex: 'associated_file',
		width: 150,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		dict: { url: '/uploadBatch/index?type=all', props: { label: 'title', value: 'id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: true, message: '源文件必填' }],
	},
	{
		title: '产品名称',
		dataIndex: 'product_pricing_id',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		dict: { url: '/pricingProduct/index4Search', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: true, message: '模板产品必填' }],
	},
	{
		title: '工艺',
		dataIndex: 'craft_ids',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'select',
		multiple: true,
		dict: { url: '/craft/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		// commonRules: [{ required: false, message: '必填' }],
		// editDefaultValue: async (record) => {
		// 	const response = await api.read(record.id)
		// 	return response.data.craft_list.map((item) => item.id)
		// },
	},
	{
		title: 'PC预览图',
		dataIndex: 'preview_url',
		width: 120,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'upload',
		type: 'image',
		returnType: 'url',
		multiple: false,
		extra: '仅用于PC用品预览，请确保与源文件内容相符！图片宽高建议在1200像素内，超出将不能完整显示。',
		commonRules: [{ required: false, message: '预览图必填' }],
	},
	{
		title: '宽度CM',
		dataIndex: 'width',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '宽度CM必填' }],
	},
	{
		title: '高度CM',
		dataIndex: 'height',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '高度CM必填' }],
	},
	{
		title: '数量',
		dataIndex: 'count',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '数量必填' }],
	},
	{
		title: '计量单位',
		dataIndex: 'unit',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '必填' }],
	},
	{
		title: '画面内容',
		dataIndex: 'identify',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '必填' }],
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

const applyColumn = reactive([
	{
		title: '用品类型',
		dataIndex: 'gallery_id',
		width: 150,
		search: false,
		addDisplay: true,
		editDisplay: true,
		editDisabled: true,
		hide: false,
		disabled: true,
		dict: { url: '/storeGallery/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: false, message: '用品类型ID必填' }],
	},
	{
		title: '用品名称',
		dataIndex: 'name',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		disabled: true,
		maxLength: 16,
		commonRules: [{ required: true, message: '名称必填' }],
	},
	{
		title: '源文件',
		dataIndex: 'associated_file',
		width: 150,
		search: false,
		addDisplay: true,
		editDisplay: true,
		disabled: true,
		hide: false,
		dict: { url: '/uploadBatch/index?type=all', props: { label: 'title', value: 'id' }, translation: true },
		formType: 'select',
		commonRules: [{ required: true, message: '源文件必填' }],
	},
	{
		title: '产品名称',
		dataIndex: 'product_pricing_id',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		disabled: true,
		dict: { url: '/pricingProduct/index4Search', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		// cascaderItem: ['craft_ids'],
		commonRules: [{ required: true, message: '模板产品必填' }],
	},
	{
		title: '工艺',
		dataIndex: 'craft_ids',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'select',
		multiple: true,
		// disabled: true,
		dict: { data: craftSelection, translation: true },
		// dict: { url: '/pricingCraft/list?craft_ids=' + craftSelectIds, props: { label: 'name', value: 'id' }, translation: true },
		// dict: { url: '/craft/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		// editDefaultValue: async (record) => {
		// 	const response = await api.read(record.id)
		// 	return response.data.craft_list.map((item) => item.id)
		// },
	},
	{
		title: 'PC预览图',
		dataIndex: 'preview_url',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'upload',
		type: 'image',
		returnType: 'url',
		multiple: false,
		disabled: true,
		// extra: '仅用于PC用品预览，请确保与源文件内容相符！图片宽高建议在1200像素内，超出将不能完整显示。',
		commonRules: [{ required: false, message: '预览图必填' }],
	},
	{
		title: '用品说明',
		dataIndex: 'remark',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		disabled: true,
		// commonRules: [{ required: false, message: '暂无说明' }],
	},
	{
		title: '宽度CM',
		dataIndex: 'width',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '宽度必填' }],
	},
	{
		title: '高度CM',
		dataIndex: 'height',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '高度必填' }],
	},
	{
		title: '数量',
		dataIndex: 'count',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'input',
		defaultValue: '0',
		commonRules: [{ required: false, message: '数量必填' }],
	},
	{
		title: '画面内容',
		dataIndex: 'identify',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'textarea',
		// commonRules: [{ required: false, message: '必填' }],
	},
	// {
	//   title: '产品线',
	//   dataIndex: 'product_type_id',
	//   width: 100,
	//   search: false,
	//   addDisplay: true,
	//   editDisplay: true,
	//   hide: false,
	//   dict: { url: '/storeProductType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
	//   formType: 'select',
	//   commonRules: [{ required: true, message: '产品线必填' }],
	// },
])
</script>
