<template>
	<div>
		<order-index-search @search="getOrders" :disabledBtn="disabledBtn" />
		<div class="gap-4 p-4 ma-content-block lg:flex">
			<a-button type="primary" size="mini" @click="onSelectAll">{{ isSelectAll ? '全部取消' : '选择全部' }}</a-button>
			<a-button type="primary" size="mini" status="success" @click="onSubmitOrder" :disabled="submitDisabled">汇总</a-button>
			<a-button status="danger" size="mini" @click="onSubmitOrderAll" :disabled="false">全部汇总</a-button>
			<a-select v-model="pageSize" :options="pageSizeOptions" class="h-7 w-28"></a-select>
		</div>
		<a-checkbox-group class="flex flex-col gap-2" v-model="checkedValues">
			<a-spin :loading="loading" tip="数据正在加载中...">
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

const pageSizeOptions = [
	{ label: '1条', value: 1 },
	{ label: '5条', value: 5 },
	{ label: '10条', value: 10 },
	{ label: '20条', value: 20 },
]
const pageSize = ref(10)

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
	getOrders()
	bizDict.flushDict('store', 'warehouseAddress', 'productGrade', 'productPictureType', 'uploadBatch', 'pricingType', 'pricingUnit')
	bizDict.fetchPricingProduct4Search('', 'admin')
})

function changeBtnStatus(status) {
	disabledBtn.value = status
}

function getOrders(params = {}) {
	loading.value = true
	params.menu = 'customerService'
	params.limit = pageSize.value
	queryParams.value = params
	console.log('queryParams', queryParams.value)
	orderApi
		.orderTree({
			status: [50, 60, 70, 80, 90], // 0: 录入中
			...params,
		})
		.then((res) => {
			loading.value = false
			orders.value = res.data
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
			data.all = true;
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

<style scoped></style>
