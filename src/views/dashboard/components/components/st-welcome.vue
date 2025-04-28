<template>
	<div v-if="showBtn === true" class="flex justify-between mb-3">
		<div class="flex justify-between w-full p-3 rounded-sm ma-content-block">
			<div class="flex inline-block pl-0">
				<a-button type="primary" status="warning" @click="flushCache">刷新缓存</a-button>
			</div>
		</div>
	</div>
	<div class="flex justify-between">
		<div class="flex justify-between w-full p-3 rounded-sm ma-content-block">
			<div class="flex inline-block pl-0">
				<div class="pl-3 mt-2">
					<div class="content-block-title">{{ userStore.user.nickname || userStore.user.username }}，欢迎回来！</div>
					<div class="mt-2 leading-5">欢迎使用本系统</div>
				</div>
			</div>
			<div class="hidden ml-5 datetime md:block">
				<h2 class="text-3xl text-center">{{ time }}</h2>
				<p class="text-base">{{ day }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'
import dayjs from 'dayjs'
import { useSysInfoStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import dataMaintain from '@/api/system/dataMaintain'

const userStore = useUserStore()
const visible = ref(false)

const sysInfoStore = useSysInfoStore()

const time = ref(null)
const day = ref(null)

const showBtn = ref(false)

onMounted(() => {
	showTime()
	setInterval(() => showTime(), 1000)
	if (sysInfoStore.info.is_admin) showBtn.value = true
})


const showTime = () => {
	time.value = dayjs().format('HH:mm:ss')
	day.value = dayjs().format('YYYY年MM月DD日')
}

const openPage = (url = '') => {
	window.open(url)
}

const flushCache = () => {
	dataMaintain
		.flushCache()
		.then((res) => {
			Message.success('清除成功')
		})
		.catch((err) => {
			Message.error('清除失败')
		})
}
</script>

<style scoped>
.datetime {
	background: rgb(var(--primary-6));
	color: #fff;
	width: 160px;
	text-align: center;
	border-radius: 3px;
	padding: 5px 10px;
}
</style>
