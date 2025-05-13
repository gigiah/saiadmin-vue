<template>
	<div style="width: 100%">
		<!--    <div class="gap-4 p-4 ma-content-block lg:flex">-->
		<!--      <a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>-->
		<!--      <a-button type="primary" size="mini" status="warning" @click="onAddCoupon">选择卡券</a-button>-->
		<!--      <a-button type="primary" size="mini" @click="onSubmitOrder" :disabled="submitDisabled">提交生产</a-button>-->
		<!--      <a-button type="primary" size="mini" @click="onDeleteBatch" :disabled="submitDisabled">批量删除</a-button>-->
		<!--    </div>-->
		<div class="order-header">
			<div class="pb-4 ma-content-block">
				<order-index-search @search="getOrders" :identity="identity" />
			</div>
			<div class="gap-4 p-4 ma-content-block lg:flex">
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
						:identity="identity"
						@changed="onOrderChanged"
						@beforeChange="changeBtnStatus(true)"
						@afterChange="changeBtnStatus(false)"
						scene="index"
						allow-diff-store="1"
					></order-card>
				</a-spin>
			</a-checkbox-group>
		</div>
		<add-store-modal :visible="addStoreModalVisible" @add-success="handleAddStoreSuccess" @add-cancel="addStoreModalVisible = false" />
		<modal :visible="addCouponModalVisible" title="选择卡券" @ok="onAddCouponOk" @cancel="onAddCouponCancel">
			<a-select :key="couponKey" v-model="couponSelected" placeholder="请选择" :options="couponList" />
		</modal>
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
import { request } from '@/utils/request'
import couponItemApi from '@/api/couponItem'
import OrderIndexSearch from '@/views/order4Client/components/orderIndexSearch.vue'
import { useSysInfoStore } from '@/store'

const sysInfoStore = useSysInfoStore()

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

const addCouponModalVisible = ref(false)
const couponList = ref([])
const couponSelected = ref()
const couponKey = ref(0)

const identity = ref('client')
if (sysInfoStore.info.is_store === true) identity.value = 'store'

const disabledBtn = ref(false)

const onAddCoupon = () => {
	addCouponModalVisible.value = true
	couponSelected.value = undefined
	request({
		url: '/couponItem/getUsableCoupon',
		method: 'get',
	}).then((value) => {
		if (value.code === 200) {
			couponList.value = value.data
			couponKey.value += 1
		}
	})
}

const onAddCouponCancel = () => {
	addCouponModalVisible.value = false
}

const onAddCouponOk = () => {
	addCouponModalVisible.value = false
	couponItemApi
		.selectCoupon({
			id: couponSelected.value,
			option: 'select',
		})
		.then((res) => {
			if (res.code === 200) {
				Message.success('卡券使用成功')
				getOrders()
			}
		})
}

const onCheckUpdate = (result) => {
	checkedValues.value = result
}

onMounted(() => {
	// getOrders();
	bizDict.flushDict('store', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit')
	bizDict.fetchPricingProduct4Search('', '', 'client')
})

function changeBtnStatus(status) {
	disabledBtn.value = status
}

function setPage(page) {
	if (page === undefined || page === null || page === '' || page < 1) {
		page = 1
	}
	currentPage.value = page
	getOrders()
}

function setPageSize(size) {
	pageSize.value = size
	getOrders()
}

function getOrders(params = {}) {
	console.log('params', params)
	loading.value = true
	let query = {}
	query = params
	query.limit = pageSize.value
	query.page = currentPage.value
	query.menu = 'client'
	orderApi
		.orderTree({
			status: [40, 50, 60, 70, 80, 90],
			...query,
		})
		.then((res) => {
			pageTotal.value = res.data.total
			orders.value = res.data.data
			if (res.data.total <= 0) {
				pageTotal.value = 1
			}
			loading.value = false
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
		title: '确认提交生产',
		content: '是否确认提交生产？',
		onOk: () => {
			orderApi
				.handleOrderChange({
					ids: checkedValues.value,
					value: '审批中',
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
