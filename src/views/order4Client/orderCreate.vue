<template>
	<div style="width: 100%">
		<div class="order-header">
			<order-create-search @search="getOrders" />
			<div class="gap-4 p-4 ma-content-block lg:flex">
				<a-button type="primary" size="mini" @click="onAddStore">选择门店</a-button>
				<a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
				<a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">提交选择</a-button>
				<a-button type="primary" size="mini" @click="onDeleteBatch" :disabled="submitDisabled">删除选择</a-button>
				<!-- <a-button status="danger" size="mini" @click="onSubmitOrderAll" :disabled="false">全部审订</a-button> -->
				<!-- <a-button status="danger" size="mini" @click="onDeleteBatchAll" :disabled="false">全部删除</a-button> -->
				<a-pagination
					:current="currentPage"
					:total="pageTotal"
					:page-size="pageSize"
					:page-size-options="pageSizeOptions"
					:show-page-size="true"
					simple
					@change="setPage"
					@page-size-change="setPageSize"
				/>
				<div class="gap-4 lg:flex" style="margin-left: 20%">
					<a-button type="primary" size="mini" @click="onExportBatch">导出表格</a-button>
					<a-upload :show-file-list="false" :custom-request="onImport">
						<template #upload-button>
							<a-button type="primary" size="mini">导入表格</a-button>
						</template>
					</a-upload>
				</div>
			</div>
		</div>
		<div class="order-content">
			<a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
				<a-spin class="flex flex-col gap-2" :loading="loading" tip="数据正在加载中...">
					<order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged" scene="create"></order-card>
				</a-spin>
			</a-checkbox-group>
		</div>
		<add-store-modal :visible="addStoreModalVisible" @add-success="handleAddStoreSuccess" @add-cancel="addStoreModalVisible = false" />
	</div>
</template>

<script setup>
import orderApi from '@/api/order'
import storeApi from '@/api/store'
import { onMounted, ref, computed } from 'vue'
import OrderCard from '@/views/order4Client/components/orderCard.vue'
import { useBizDictStore } from '@/store'
import AddStoreModal from '@/views/order4Client/components/addStoreModal.vue'
import { Message, Modal } from '@arco-design/web-vue'
import OrderCreateSearch from '@/views/order4Client/components/orderCreateSearch.vue'

const pageSizeOptions = [1, 5, 10, 20]
const pageSize = ref(10)
const currentPage = ref(1)
const pageTotal = ref(1)
const loading = ref(false)
const queryParams = ref({})

const stores = ref([])
const orders = ref([])
const bizDict = useBizDictStore()
const addStoreModalVisible = ref(false)
const checkedValues = ref([])
const submitDisabled = computed(() => checkedValues.value.length === 0)

const onCheckUpdate = (result) => {
	checkedValues.value = result
}

onMounted(() => {
	getOrders()
	bizDict.flushDict('store', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit')
	bizDict.fetchPricingProduct4Search('', '', 'client')
})

function setPage(page) {
	if (page === undefined || page === null || page === '' || page < 1) {
		page = 1
	}
	currentPage.value = page
	getOrders(queryParams.value)
}

function setPageSize(size) {
	pageSize.value = size
	getOrders(queryParams.value)
}

function getOrders(params = {}) {
	console.log('params', params)
	loading.value = true
	let query = {}
	query = params
	query.limit = pageSize.value
	query.page = currentPage.value
	queryParams.value = query
	orderApi
		.orderTree({
			status: [0], // 0: 录入中
			...query,
		})
		.then((res) => {
			loading.value = false
			pageTotal.value = res.data.total
			if (res.data.total <= 0) {
				pageTotal.value = 1
			}
			orders.value = res.data.data
		})
		.finally(() => {
			loading.value = false
		})
}

function getAllStore() {
	storeApi
		.getPageList({
			type: 'all',
		})
		.then((res) => {
			console.log(res)
			stores.value = res.data
		})
}

function onAddStore() {
	console.log('添加门店')
	addStoreModalVisible.value = true
}

function onSubmitOrder() {
	Modal.confirm({
		title: '确认发起审订',
		content: '是否确认发起审订？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					ids: checkedValues.value,
					value: '审订中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('提交成功')
						checkedValues.value = []
						getOrders()
					}
				})
		},
	})
}

function onOrderChanged() {
	console.log('订单变更')
	checkedValues.value = []
	getOrders()
}

function handleAddStoreSuccess() {
	console.log('添加门店成功')
	addStoreModalVisible.value = false
	getOrders()
}

function onDeleteBatch() {
	Modal.confirm({
		title: '确认删除',
		content: '是否确认删除选中的订单？',
		onOk: () => {
			orderApi
				.handleDelete(
					checkedValues.value.map((id) => {
						return {
							type: 'order',
							id: id,
						}
					})
				)
				.then((value) => {
					if (value.code === 200) {
						Message.success('删除成功')
						checkedValues.value = []
						getOrders()
					}
				})
		},
	})
}

function onSubmitOrderAll() {
	Modal.confirm({
		title: '确认发起审订',
		content: '是否确认全部发起审订？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					all: true,
					value: '审订中',
					beforeStatus: '录入中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('提交成功')
						checkedValues.value = []
						getOrders()
					}
				})
		},
	})
}

function onDeleteBatchAll() {
	Modal.confirm({
		title: '确认删除',
		content: '是否确认删除全部的订单？',
		onOk: () => {
			orderApi
				.handleDelete({
					all: true,
					// value: '审订中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('删除成功')
						checkedValues.value = []
						getOrders()
					}
				})
		},
	})
}

// const exportBill = async (record) => {
//   let res = await api.exportBillExcel({ id: record.id })
//   window.location.href = res.data.filePath
// }

function onExportBatch() {
	Modal.confirm({
		title: '确认导出',
		content: '是否确认导出选中的订单？',
		onOk: () => {
			orderApi
				.orderExport({
					ids: checkedValues.value,
					value: '录入中',
				})
				.then((res) => {
					if (res.code === 200) {
						window.location.href = res.data.filePath
					}
				})
		},
	})
}

function onImport(fileOption) {
	Message.info('文件上传导入中...')
	const dataForm = new FormData()
	dataForm.append('file', fileOption.fileItem.file)
	console.log(fileOption)
	console.log(dataForm)
	orderApi.orderImport(dataForm).then((res) => {
		res.code === 200 && Message.info('导入成功，请等待系统解析')
	})
}

// function onExportBatch() {
//   Modal.confirm({
//     title: '确认导出',
//     content: '是否确认导出选中的订单？',
//     onOk: () => {
//       orderApi.orderExport(checkedValues.value.map((id) => {
//         return {
//           id: id,
//         }
//       })).then(value => {
//         if (value.code === 200) {
//           Message.success('导出成功，请等待下载');
//           // checkedValues.value = [];
//           // getOrders();
//         }
//       })
//     }
//   });
// }

let isSelectAll = computed(() => {
	return checkedValues.value.length === orders.value.length
})

function onSelectAll() {
	if (!isSelectAll.value) {
		checkedValues.value = orders.value.map((item) => item.id)
	} else {
		checkedValues.value = []
	}
}
</script>

<style scoped>
.order-header {
	position: fixed;
	top: 95px;
	z-index: 999;
	width: 100%;
}

.order-content {
	width: 100%;
	margin-top: 160px;
}
</style>
