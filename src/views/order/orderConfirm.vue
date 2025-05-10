<template>
	<div style="width: 100%">
		<div class="order-header">
			<order-confirm-search @search="getOrders" />
			<div class="gap-4 p-4 ma-content-block lg:flex">
				<a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
				<a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">通过</a-button>
				<a-button type="primary" size="mini" status="danger" @click="onDeleteBatch" :disabled="submitDisabled">打回</a-button>
				<!-- <a-button status="danger" size="mini" @click="onSubmitOrderAll" :disabled="false">全部通过</a-button> -->
				<!-- <a-button status="danger" size="mini" @click="onDeleteBatchAll" :disabled="false">全部打回</a-button> -->
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
					<order-card v-for="(item, index) in orders" :order="item" :key="index" @changed="onOrderChanged" scene="confirm"></order-card>
				</a-spin>
			</a-checkbox-group>
		</div>
	</div>
</template>

<script setup>
import orderApi from '@/api/order'
import storeApi from '@/api/store'
import { onMounted, ref, computed } from 'vue'
import OrderCard from '@/views/order/components/orderCard.vue'
import { useBizDictStore } from '@/store'
import { Message, Modal } from '@arco-design/web-vue'
import OrderConfirmSearch from '@/views/order/components/orderConfirmSearch.vue'

const pageSizeOptions = [1, 5, 10, 20]
const pageSize = ref(10)
const currentPage = ref(1)
const pageTotal = ref(1)
const loading = ref(false)

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
	bizDict.flushDict('store', 'warehouseAddress', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit')
	bizDict.fetchPricingProduct4Search('', 'admin')
})

function setPage(page) {
	if (page === undefined || page === null || page === '' || page < 1) {
		page = 1
	}
	currentPage.value = page
}

function setPageSize(size) {
	pageSize.value = size
}

function getOrders(params = {}) {
	console.log('params', params)
	loading.value = true
	let query = {}
	query = params
	query.limit = pageSize.value
	query.page = currentPage.value
	orderApi
		.orderTree({
			status: 40,
			...query,
		})
		.then((res) => {
			orders.value = res.data.data
			pageTotal.value = res.data.total
			if (res.data.total <= 0) {
				pageTotal.value = 1
			}
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
		title: '确认',
		content: '是否确认？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					// ids: [props.order.id],
					ids: checkedValues.value,
					value: '生产中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('提交成功')
						// emit('changed');
						getOrders()
					}
				})
		},
	})
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
					beforeStatus: '审批中',
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

function onSubmitOrderAll() {
	Modal.confirm({
		title: '确认发起通过',
		content: '是否确认全部发起通过？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					all: true,
					value: '生产中',
					beforeStatus: '审批中',
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
		title: '确认打回',
		content: '是否确认打回全部的订单？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					all: true,
					value: '审批中',
					beforeStatus: '审订中',
				})
				.then((value) => {
					if (value.code === 200) {
						Message.success('打回成功')
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
