<template>
	<a-modal v-model:visible="visible" :width="1400" :footer="false">
		<template #title>用品类型内容</template>
		<div class="justify-between p-4 ma-content-block lg:flex">
			<!-- CRUD 组件 -->
			<ma-crud :options="crud" :columns="columns" ref="crudRef">
				<template #operationBeforeExtend="{ record }">
					<a-space size="mini">
						<a-link @click="applyPanel(record)"><icon-menu /> 申请</a-link>
					</a-space>
				</template>
			</ma-crud>
		</div>
		<div>
			<ma-form-modal ref="modalRef" v-model:visible="modalVisible" :hide-title="true" :width="800" :column="applyColumn" :submit="applySubmit"> </ma-form-modal>
		</div>
	</a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/storeGalleryItem'
import applyApi from '@/api/storeItemApply'
import pricingCraftApi from '@/api/pricingCraft'
import { Message, Modal } from '@arco-design/web-vue'
import MaFormModal from '@/components/ma-form-modal/index.vue'

//外部弹窗
const visible = ref(false)
const crudRef = ref()
const galleryId = ref()

const open = (row) => {
	galleryId.value = row.id
	visible.value = true
	crudRef.value.requestData()
}

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
		if (key !== 'craft_ids') {
			modalRef.value.form[key] = record[key]
		} else {
			_craftIds = buildCraftIds(record[key])
		}
	})
	modalRef.value.form['count'] = '0'
	modalRef.value.form['identify'] = ''
	modalRef.value.form['craft_ids'] = ''
	await getCraftSelection(_craftIds)
	modalVisible.value = true
}
const applySubmit = (formData) => {
	console.log(formData)
	applyApi.saveApply(formData).then((res) => {
		console.log('res', res)
		if (res.code == 200) {
			Message.success('申请成功')
			crudRef.value.refresh()
		} else {
			Message.error('申请失败')
		}
	})
	return true
}

const crud = reactive({
	api: api.getPageList,
	beforeRequest: (params) => {
		params.gallery_id = galleryId
	},
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	searchColNumber: 3,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 160,
	add: { show: false, api: api.save, auth: ['/storeGalleryItem/save'] },
	edit: { show: false, api: api.update, auth: ['/storeGalleryItem/update'] },
	delete: { show: false, api: api.delete, auth: ['/storeGalleryItem/destroy'] },
	recovery: { show: false, api: api.recovery, auth: ['/storeGalleryItem/recovery'] },
	formOption: { width: 800 },
	beforeOpenAdd: () => {
		columns[1].addDefaultValue = Number.parseInt(galleryId.value)
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
		commonRules: [{ required: true, message: '主键必填' }],
	},
	{
		title: '用品类型',
		dataIndex: 'gallery_id',
		width: 150,
		search: false,
		addDisplay: true,
		editDisplay: true,
		editDisabled: true,
		hide: false,
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
		cascaderItem: ['craft_ids'],
		commonRules: [{ required: true, message: '模板产品必填' }],
	},
	{
		title: '可选工艺',
		dataIndex: 'craft_ids',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'select',
		multiple: true,
		dict: { url: '/pricingCraft/index4Search?status=1&product_pricing_id={{key}}', props: { label: 'name', value: 'craft_id' }, translation: true },
		// commonRules: [{ required: false, message: '必填' }],
		editDefaultValue: async (record) => {
			const response = await api.read(record.id)
			return response.data.craft_list.map((item) => item.id)
		},
	},
	{
		title: '可选工艺',
		dataIndex: 'craft_names',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: false,
		formType: 'input',
		multiple: true,
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
		// extra: '仅用于PC用品预览，请确保与源文件内容相符！图片宽高建议在1200像素内，超出将不能完整显示。',
		commonRules: [{ required: false, message: '预览图必填' }],
	},
	{
		title: '固定宽度CM',
		dataIndex: 'width',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '固定宽度必填' }],
	},
	{
		title: '固定高度CM',
		dataIndex: 'height',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '固定高度必填' }],
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
	{
		title: '价格体系',
		dataIndex: 'pricing_type_id',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		dict: { url: '/storePricingType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		multiple: true,
		editDefaultValue: async (record) => {
			const response = await api.read(record.id)
			return response.data.list.map((item) => item.id)
		},
		// commonRules: [{ required: true, message: '价格体系必填' }],
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
		commonRules: [{ required: false, message: '用品说明必填' }],
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
		dict: { data: craftSelection, translation: true },
		// dict: { url: '/pricingCraft/list?craft_ids=' + craftSelectIds, props: { label: 'name', value: 'id' }, translation: true },
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

defineExpose({ open })
</script>
