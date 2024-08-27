<template>
	<div class="justify-between p-4 ma-content-block lg:flex">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 状态列 -->
			<template #status="{ record }">
				<a-switch :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)"
					:default-checked="record.status == 1" />
			</template>
			<!-- 头像列 -->
			<template #avatar="{ record }">
				<a-avatar>
					<img :src="record.avatar ? $tool.showFile(record.avatar) : $url + 'avatar.jpg'"
						style="object-fit: cover" />
				</a-avatar>
			</template>
			<!-- 操作列扩展 -->
			<template #operationAfterExtend="{ record }">
				<a-link @click="selectOperation('resetPassword', record)">重置密码</a-link>
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import MaTreeSlider from '@cps/ma-treeSlider/index.vue'
import dept from '@/api/system/dept'
import user from '@/api/system/user'
import commonApi from '@/api/common'
import { Message, Modal } from '@arco-design/web-vue'
import { useSysInfoStore } from '@/store'

const depts = ref([])
const homePageList = ref([])
const crudRef = ref()

const setHomeVisible = ref(false)
const userid = ref()
const homePage = ref('')
const sysInfoStore = useSysInfoStore()

onMounted(() => {
	dept.tree().then((res) => {
		depts.value = res.data
		depts.value.unshift({ label: '所有部门', value: 'all' })
	})
	commonApi.getDict('dashboard').then((res) => (homePageList.value = res.data))
})

const changeStatus = async (status, id) => {
	const response = await user.changeStatus({ id, status })
	if (response.code === 200) {
		Message.success(response.message)
	}
}

const updateCache = (id) => {
	user.clearCache({ id }).then((res) => {
		if (res.code === 200) Message.success(res.message)
	})
}

const resetPassword = (id) => {
	if (id === sysInfoStore.info.sys_user_id) {
		Message.error('不可重置自己')
		return false
	}
	user.initUserPassword({ id }).then((res) => res.code === 200 && Message.success(res.message))
}

const selectOperation = (value, record) => {
	if (value === 'resetPassword') {
		Modal.info({
			title: '提示',
			content: '确定将该用户密码重置为 123456 吗？',
			simple: false,
			onBeforeOk: (done) => {
				resetPassword(record.id)
				done(true)
			},
		})
		return
	}
}

const crud = reactive({
	api: user.getPageList4Client,
	beforeRequest: params => {
		params.clientReq = true
	},
	recycleApi: user.getRecyclePageList,
	searchColNumber: 3,
	showIndex: false,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 200,
	add: { show: true, api: user.save },
	edit: { show: true, api: user.update },
	delete: { show: true, api: user.deletes, realApi: user.realDestroy },
	recovery: { show: true, api: user.recoverys },
	formOption: {
		width: 800,
	},
	beforeAdd: (record) => {
		record.reqType = 'client'
		return true
	},
	beforeOpenEdit: (record) => {
		if (record.id === sysInfoStore.info.sys_user_id) {
			Message.error('不可编辑自己')
			return false
		}
		return true
	},
	beforeEdit: (record) => {
		record.reqType = 'client'
		return true
	},
	beforeDelete: (ids) => {
		if (ids.includes(sysInfoStore.info.sys_user_id)) {
			Message.error('不可删除自己')
			return false
		}
		return true
	},
})

const columns = reactive([
	{ title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
	{
		title: '头像',
		dataIndex: 'avatar',
		width: 75,
		formType: 'upload',
		returnType: 'url',
		multiple: false,
		type: 'image',
		rounded: true,
		labelWidth: '86px',
	},
	{
		title: '账户',
		dataIndex: 'username',
		width: 130,
		search: true,
		addDisabled: false,
		editDisabled: true,
		commonRules: [{ required: true, message: '账户必填' }],
	},
	// {
	// 	title: '所属部门',
	// 	dataIndex: 'dept_id',
	// 	hide: true,
	// 	formType: 'tree-select',
	// 	multiple: false,
	// 	treeCheckable: false,
	// 	treeCheckStrictly: true,
	// 	dict: { url: '/core/dept/index?tree=true' },
	// 	// commonRules: [{ required: true, message: '所属部门必选' }],
	// 	validateTrigger: 'focus',
	// 	editDefaultValue: (record) => {
	// 		return record.dept_id == 0 ? undefined : record.dept_id
	// 	},
	// },
	{
		title: '密码',
		dataIndex: 'password',
		hide: true,
		autocomplete: 'off',
		addDefaultValue: '123456',
		editDefaultValue: '',
		addDisabled: false,
		editDisabled: true,
		type: 'password',
		addRules: [{ required: true, message: '密码必填' }],
	},
	{ title: '昵称', dataIndex: 'nickname', width: 120, addRules: [{ required: true, message: '昵称必填' }], },
	// {
	// 	title: '角色',
	// 	dataIndex: 'role_ids',
	// 	width: 120,
	// 	formType: 'select',
	// 	multiple: true,
	// 	dict: { url: '/core/role/index?saiType=all', props: { label: 'name', value: 'id' } },
	// 	hide: true,
	// 	commonRules: [{ required: true, message: '角色必选' }],
	// 	editDefaultValue: async (record) => {
	// 		const response = await user.read(record.id)
	// 		return response.data.roleList.map((item) => item.id)
	// 	},
	// },
	{
		title: '手机',
		dataIndex: 'phone',
		width: 150,
		search: true,
		commonRules: [{ match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }],
	},
	// {
	// 	title: '岗位',
	// 	dataIndex: 'post_ids',
	// 	width: 120,
	// 	formType: 'select',
	// 	multiple: false,
	// 	dict: { url: '/core/post/index?saiType=all', props: { label: 'name', value: 'id' } },
	// 	hide: true,
	// 	editDefaultValue: async (record) => {
	// 		const response = await user.read(record.id)
	// 		const ids = response.data.postList.map((item) => item.id)
	// 		return ids
	// 	},
	// },
	// {
	// 	title: '邮箱',
	// 	dataIndex: 'email',
	// 	width: 200,
	// 	search: true,
	// 	commonRules: [{ type: 'email', message: '请输入正确的邮箱' }],
	// },
	// {
	// 	title: '企业微信',
	// 	dataIndex: 'wechat_business',
	// 	width: 75,
	// 	formType: 'upload',
	// 	returnType: 'url',
	// 	multiple: false,
	// 	type: 'image',
	// 	labelWidth: '86px',
	// },
	{
		title: '销售区域',
		dataIndex: 'area_type_ids',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'select',
		multiple: true,
		dict: { url: '/storeAreaType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
		// commonRules: [{ required: false, message: '必填' }],
		editDefaultValue: async (record) => {
			const response = await user.read(record.id)
			return response.data.area_list.map((item) => item.id)
		},
	},
	{
		title: '启用状态',
		dataIndex: 'status',
		width: 100,
		search: true,
		formType: 'radio',
		dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
		addDefaultValue: '1',
		labelWidth: '86px',
	},
	{
		title: '备注',
		dataIndex: 'remark',
		width: 180,
		hide: true,
		formType: 'textarea',
		labelWidth: '86px',
	},
	{
		title: '创建时间',
		dataIndex: 'create_time',
		width: 180,
		addDisplay: false,
		editDisplay: false,
		search: true,
		formType: 'range',
	},
])
</script>

<script>
export default { name: 'system:user' }
</script>

<style scoped></style>
