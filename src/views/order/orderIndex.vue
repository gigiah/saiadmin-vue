<template>
	<div style="width: 100%">
		<div class="order-header">
			<order-index-search @search="getOrders" :disabledBtn="disabledBtn" />
			<div class="gap-4 p-4 ma-content-block lg:flex">
				<a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
				<a-button type="primary" size="mini" status="success" @click="onSubmitOrder" :disabled="submitDisabled">汇总</a-button>
				<a-button status="danger" size="mini" @click="onSubmitOrderAll" :disabled="false">全部汇总</a-button>
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
			</div>
		</div>
		<div class="order-content">
			<a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
				<a-spin class="flex flex-col gap-2" :loading="loading" tip="数据正在加载中...">
					<order-card
						v-for="(item, index) in orders"
						:order="item"
						:key="index"
						@changed="onOrderChanged"
						@beforeChange="changeBtnStatus(true)"
						@afterChange="changeBtnStatus(false)"
						scene="index"
					></order-card>
				</a-spin>
			</a-checkbox-group>
		</div>
		<ma-form-modal ref="submitModalRef" v-model:visible="submitVisible" :hide-title="true" :width="800" :column="submitModalColumn" :submit="submitSummary"></ma-form-modal>
		<ma-form-modal
			ref="submitAllModalRef"
			v-model:visible="submitAllVisible"
			:hide-title="true"
			:width="800"
			:column="submitModalColumn"
			:submit="submitSummaryAll"
		></ma-form-modal>
	</div>
</template>

<script setup>
import orderApi from '@/api/order'
import storeApi from '@/api/store'
import summaryOrderApi from '@/api/summaryOrder'
import { onMounted, ref, computed, reactive } from 'vue'
import OrderCard from '@/views/order/components/orderCard.vue'
import { useBizDictStore } from '@/store'
import { Message, Modal } from '@arco-design/web-vue'
import MaFormModal from '@/components/ma-form-modal/index.vue'
import OrderIndexSearch from '@/views/order/components/orderIndexSearch.vue'

const pageSizeOptions = [1, 5, 10, 20]
const pageSize = ref(10)
const currentPage = ref(1)
const pageTotal = ref(1)
const loading = ref(false)
const queryParams = ref({})

const stores = ref([])
const orders = ref([])
const submitVisible = ref(false)
const submitAllVisible = ref(false)
const bizDict = useBizDictStore()
const addStoreModalVisible = ref(false)
const checkedValues = ref([])
const submitDisabled = computed(() => checkedValues.value.length === 0)

const disabledBtn = ref(false)

const onCheckUpdate = (result) => {
	checkedValues.value = result
}

onMounted(() => {
	// getOrders()
	bizDict.flushDict('store', 'warehouseAddress', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit')
	bizDict.fetchPricingProduct4Search('', 'admin')
})

function changeBtnStatus(status) {
	disabledBtn.value = status
}

function setPageSize(size) {
	pageSize.value = size
	getOrders()
}

function setPage(page) {
	if (page === undefined || page === null || page === '' || page < 1) {
		page = 1
	}
	currentPage.value = page
	getOrders()
}

function getOrders(params = {}) {
	loading.value = true
	let query = {}
	query = params
	query.menu = 'customerService'
	query.limit = pageSize.value
	query.page = currentPage.value
	// queryParams.value = params
	// console.log('queryParams', queryParams.value)
	// 检查 create_time 的日期范围是否超过 31 天
	if (params.create_time && Array.isArray(params.create_time)) {
		const startDate = new Date(params.create_time[0])
		const endDate = new Date(params.create_time[1])
		// 计算日期差
		const dateDiff = (endDate - startDate) / (1000 * 60 * 60 * 24)
		if (dateDiff > 31) {
			loading.value = false
			console.error('搜索时间超过31天')
			Message.error('搜索时间不可超过31天')
			return // 终止执行
		}
		query.create_time = params.create_time
	}
	orderApi
		.orderTree({
			status: [50, 60, 70, 80, 90],
			...query,
		})
		.then((res) => {
			loading.value = false
			orders.value = res.data.data
			pageTotal.value = res.data.total
			if (res.data.total <= 0) {
				pageTotal.value = 1
			}
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
	submitVisible.value = true
}

function onSubmitOrderAll() {
	submitAllVisible.value = true
}

function onDeleteBatch() {
	Modal.confirm({
		title: '确认',
		content: '是否确认？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					ids: [props.order.id],
					value: '审订中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('提交成功')
						emit('changed')
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

const submitSummary = async (formData) => {
	Modal.confirm({
		title: '提示',
		content: '请确保所有修改已经保存，否则可能产生严重错误',
		onOk: () => {
			loading.value = true
			summaryOrderApi
				.handleOrderSummary({
					orderIds: checkedValues.value,
					summaryBatchCode: formData.summary_batch_code,
				})
				.then((res) => {
					if (res.code === 200) {
						Message.success('汇总成功')
						oading.value = false
						// getOrders()
					}
				})
				.finally((res) => {
					loading.value = false
				})
		},
	})
}
const submitSummaryAll = async (formData) => {
	Modal.confirm({
		title: '提示汇总全部订单吗？',
		content: '请确保所有修改已经保存，否则可能产生严重错误',
		onOk: () => {
			loading.value = true
			let data = queryParams.value
			data.all = true
			data.summaryBatchCode = formData.summary_batch_code
			summaryOrderApi
				.handleOrderSummary(data)
				.then((res) => {
					if (res.code === 200) {
						Message.success('汇总成功')
						loading.value = false
						// getOrders()
					}
				})
				.finally((res) => {
					loading.value = false
				})
		},
	})
}

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
.order-header {
	position: fixed;
	top: 95px;
	z-index: 999;
	width: 100%;
}

.order-content {
	width: 100%;
	margin-top: 190px;
}
</style>
