<script setup lang="ts">
import {ref} from "vue";
import type {FileItem} from "@arco-design/web-vue";

defineProps<{
  limit?: number,
  disabled?: boolean,
}>();

const emits = defineEmits<{'update:modelValue': [value: FileItem[]]}>();

const fileItem = ref<FileItem[]>([]);

function handleChange(value: FileItem[]) {
  fileItem.value = value;
  emits('update:modelValue', value);
}

function handleRemove(idx: number) {
  fileItem.value.splice(idx, 1);
  emits('update:modelValue', fileItem.value);
}
</script>

<template>
  <div class="w-full">
    <a-upload
        :limit="limit"
        v-model="fileItem"
        :show-file-list="false"
        :disabled="disabled"
        :auto-upload="false"
        @change="handleChange" />
    <div class="flex flex-col gap-1 w-full">
      <div class="bg-blue-100 p-2 flex justify-between items-center" v-for="(file, idx) in fileItem">
        <span class="overflow-ellipsis overflow-hidden">{{file.name}}</span>
        <a-button type="text" :disabled="disabled" size="mini" status="danger" @click="handleRemove(idx)">
          <icon-close-circle />
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>