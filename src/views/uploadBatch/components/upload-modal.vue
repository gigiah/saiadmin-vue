<script setup>
import OssUpload from "@/views/uploadBatch/components/ossUpload.vue";
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import useUploadStore from "@/store/modules/upload";

const uploadStore = useUploadStore();

defineProps({
  visible: Boolean,
})

const emit = defineEmits(['ok', 'cancel'])

const uploadData = ref({
  sourceFiles: [],
  previewImages: [],
  linkFiles: [],
})


const handleOk = () => {
  uploadStore.createTask(uploadData.value).then(() => {
    console.log('保存成功');
  });
  emit('ok')
  Message.info('上传中，请在消息通知中查看上传进度');
}
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <a-modal :hide-title="true" :width="800" :visible="visible" title="上传文件" @ok="handleOk"
           @cancel="handleCancel">
    <a-form ref="uploadForm" :model="uploadData">
      <a-form-item label="源文件(必须先上传)">
        <oss-upload v-model="uploadData.sourceFiles" />
      </a-form-item>
      <a-form-item label="预览图">
        <oss-upload v-model="uploadData.previewImages" :limit="1" />
      </a-form-item>
      <a-form-item label="链接文件">
        <oss-upload v-model="uploadData.linkFiles" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
</style>