<template>
	<div class="h-full">
		<div class="p-3 ma-content-block">
			<ma-form v-model="form" :columns="columns" ref="maForm" @onSubmit="handlerSubmit"></ma-form>
			<ma-form v-for="item in storeForm"></ma-form>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

const storeForm = ref([])

const form = ref({})

const columns = ref([
	{
		formType: 'grid',
		customClass: ['mb-2'],
		cols: [
			{
				span: 6,
				formList: [
					{
						formType: 'grid-tailwind',
						colNumber: 1,
						cols: [
							{
								formList: [
									{
										title: '门店名称',
										dataIndex: 'mianmao',
										formType: 'select',
										dict: {
											data: [
												{
													label: '党员',
													value: 1,
												},
												{
													label: '团员',
													value: 2,
												},
												{
													label: '群众',
													value: 3,
												},
											],
										},
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		formType: 'card',
		title: '已选门店',
		hideLabel: true,
		customClass: ['mb-5'],
		
		formList: [
			{
				formType: 'children-form',
				dataIndex: 'shangxuejingli',
				type: 'table',
				hideLabel: true,
				formList: [
					{
						dataIndex: 'qishinian',
						title: '门店名称',
					},
					{
						dataIndex: 'endnian',
						title: '营销区域',
					},
					{
						dataIndex: 'xuexiao',
						title: '经营模式',
					},
					{
						dataIndex: 'xueli',
						title: '产品线',
					},
					{
						dataIndex: 'zhuanye',
						title: '价格体系',
					},
				],
			},
		],
	},
])

const handlerSubmit = (data, done) => {
	// 显示表单提交中状态
	done(true)
	if (data) {
		if (data.name == '张三') {
			Message.info('真实姓名是张三')
		}
		// todo
		console.log(data)
		Message.success('提交成功')
	}
	// 关闭表单提交中状态
	done(false)
}
</script>
