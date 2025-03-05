<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<upload-modal :key="modalKey" :visible="visible" @ok="handleOk" @cancel="handleCancel" />
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 表格按钮后置扩展 -->
			<template v-if="isStore == false" #tableBeforeButtons>
				<a-button type="outline">
					<template #icon><icon-save /></template>云盘容量 {{ diskVol.remain }}/{{ diskVol.total }}G
				</a-button>
				<a-button @click="showModal" @submit="" type="primary" status="normal" class="w-full mt-2 lg:w-auto lg:mt-0"
					><template #icon><icon-plus /></template>上传文件
				</a-button>
			</template>
			<template v-if="isStore == true" #operationAfterExtend="{ record }">
				<a-link @click="downloadBatch(record)">下载</a-link>
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, toRaw, watch } from 'vue'
import api from '@/api/uploadBatch'
import { Message, Notification } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'
import OssUpload from '@/views/uploadBatch/components/ossUpload.vue'
import useUploadStore from '@/store/modules/upload'
import UploadModal from '@/views/uploadBatch/components/upload-modal.vue'

const crudRef = ref()
const sysInfoStore = useSysInfoStore()
const diskVol = ref({})

const visible = ref(false)

const showModal = () => {
	visible.value = true
}

const modalKey = ref(0)

function handleOk() {
	modalKey.value++
	visible.value = false
}

function handleCancel() {
	visible.value = false
}

const getDiskVol = () => {
	api.diskVol().then((res) => {
		diskVol.value = {
			total: res.data.total,
			remain: res.data.remain,
		}
	})
}
const isStore = sysInfoStore.info.is_store ? true : false

//批量下载文件
async function downloadFile(url, filename) {
	try {
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors', // 确保跨域请求正确处理
		})
		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}`)
		}
		const blob = await response.blob()
		const blobUrl = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = blobUrl
		link.download = filename
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(blobUrl)
	} catch (error) {
		console.error('Error downloading file:', error)
	}
}

function getFileExtension(url) {
	return url.split('.').pop().split(/\#|\?/)[0]
}

function downloadFilesInBatches(fileUrls, batchSize = 5) {
	let batchStart = 0

	async function processBatch() {
		while (batchStart < fileUrls.length) {
			const batch = fileUrls.slice(batchStart, batchStart + batchSize)
			const downloadPromises = batch.map(({ url, filename }) => downloadFile(url, filename))

			// Await the completion of all downloads in the current batch
			await Promise.all(downloadPromises)

			// Move to the next batch
			batchStart += batchSize
		}
	}

	processBatch()
		.then(() => console.log('All files downloaded.'))
		.catch((error) => console.error('Error downloading files:', error))
}

const downloadBatch = (record) => {
	console.log('record', record)
	let data = record
	const fileUrls = []
	// 添加 source_file
	fileUrls.push({
		url: data.source_file,
		filename: data.title, // 使用原始 title 包含扩展名
	})
	// 添加 preview_image
	const previewExtension = getFileExtension(data.preview_image)
	fileUrls.push({
		url: data.preview_image,
		filename: `preview-${data.title.split('.').slice(0, -1).join('.')}.${previewExtension}`,
	})
	// 添加 link_file_list
	data.link_file_list.forEach((file) => {
		const extension = getFileExtension(file.value)
		fileUrls.push({
			url: file.value,
			filename: `${file.label}.${extension}`,
		})
	})
	console.log('fileUrls', fileUrls)
	downloadFilesInBatches(fileUrls, fileUrls.length) // 根据需要调整批次大小
}

onMounted(() => {
	getDiskVol()
})

const crud = reactive({
	api: api.getPageList,
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	searchColNumber: 3,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 160,
	add: { show: false, api: api.save, auth: ['/uploadBatch/save'] },
	edit: { show: sysInfoStore.info.is_store ? false : true, text: '查看', title: '查看', api: api.update, auth: ['/uploadBatch/update'] },
	delete: { show: sysInfoStore.info.is_store ? false : true, api: api.delete, auth: ['/uploadBatch/destroy'] },
	recovery: { show: true, api: api.recovery, auth: ['/uploadBatch/recovery'] },
	formOption: { width: 800 },
	isDbClickEdit: true,
})

const columns = reactive([
	{
		title: '编号',
		dataIndex: 'id',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '编号必填' }],
	},
	{
		title: '源文件',
		dataIndex: 'title',
		width: 180,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		editDisabled: true,
		commonRules: [{ required: true, message: '标题必填' }],
	},
	{
		title: '路径',
		dataIndex: 'source_file',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: sysInfoStore.info.is_store ? true : false,
		formType: 'input',
		editDisabled: true,
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
		editDisabled: true,
		commonRules: [{ required: false, message: '预览图必填' }],
	},
	{
		formType: 'card',
		title: '链接文件',
		customClass: ['mb-5'],
		hide: true,
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
	{
		title: '排序',
		dataIndex: 'sort',
		width: 180,
		search: false,
		addDisplay: false,
		addDefaultValue: 100,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '排序必填' }],
	},
	{
		title: '状态',
		dataIndex: 'status',
		width: 180,
		search: false,
		addDisplay: false,
		addDefaultValue: 1,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '状态必填' }],
	},
	{
		title: '门店下载授权',
		dataIndex: 'visit_show',
		width: 200,
		search: false,
		addDisplay: false,
		addDefaultValue: 1,
		editDisplay: true,
		hide: sysInfoStore.info.is_store ? true : false,
		dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true },
		formType: 'select',
		// commonRules: [{ required: false, message: '状态必填' }],
	},
	{
		title: '授权营销区域',
		dataIndex: 'area_type_ids',
		width: 180,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: sysInfoStore.info.is_store ? true : false,
		dict: { url: '/storeAreaType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		multiple: true,
		editDefaultValue: async (record) => {
			const response = await api.read(record.id)
			return response.data.area_list.map((item) => item.id)
		},
		// commonRules: [{ required: sysInfoStore.info?.is_admin ? false : true, message: '营销区域必填' }],
	},
	{
		title: '授权价格体系',
		dataIndex: 'pricing_type_id',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: sysInfoStore.info.is_store ? true : false,
		dict: { url: '/storePricingType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		formType: 'select',
		multiple: true,
		editDefaultValue: async (record) => {
			const response = await api.read(record.id)
			return response.data.pricing_list.map((item) => item.id)
		},
		// commonRules: [{ required: sysInfoStore.info?.is_admin ? false : true, message: '价格体系必填' }],
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
		search: true,
		addDisplay: false,
		editDisplay: false,
		hide: false,
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
</script>
