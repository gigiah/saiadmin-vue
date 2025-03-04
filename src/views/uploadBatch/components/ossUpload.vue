<script setup lang="ts">
import { ref } from 'vue'
import type { FileItem } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
	limit?: number
	disabled?: boolean
  maxSize?: number
}>()

const emits = defineEmits<{ 'update:modelValue': [value: FileItem[]] }>()

const fileItem = ref<FileItem[]>([])

function handleChange(value: FileItem[]) {
	fileItem.value = value
	emits('update:modelValue', value)
}

function handleRemove(idx: number) {
	fileItem.value.splice(idx, 1)
	emits('update:modelValue', fileItem.value)
}
</script>

<template>
	<div class="w-full">
		<a-upload :limit="limit" v-model="fileItem" :show-file-list="false" :disabled="disabled" :auto-upload="false" @change="handleChange" />
		<div class="flex flex-col w-full gap-1">
			<div class="flex items-center justify-between p-2 bg-blue-100" v-for="(file, idx) in fileItem">
				<span class="overflow-hidden overflow-ellipsis">{{ file.name }}</span>
				<a-button type="text" :disabled="disabled" size="mini" status="danger" @click="handleRemove(idx)">
					<icon-close-circle />
				</a-button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
