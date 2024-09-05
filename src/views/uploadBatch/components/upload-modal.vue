<script setup>
import OssUpload from "@/views/uploadBatch/components/ossUpload.vue";
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import useUploadStore from "@/store/modules/upload";
import {useMessageStateStore} from "@/store";
import messageState from "@/store/modules/messageState";

const uploadStore = useUploadStore();
const uploadForm = ref();

const messageStateStore = useMessageStateStore();

defineProps({
  visible: Boolean,
})

const emit = defineEmits(['ok', 'cancel'])

const uploadData = ref({
  sourceFiles: [],
  previewImages: [],
  linkFiles: [],
})


const handleOk = async () => {
  const validate = await uploadForm.value.validate();
  if (validate) {
    for (const key in validate) {
      Message.error(validate[key].message)
    }
    return;
  }
  uploadStore.createTask(uploadData.value).then(() => {
    console.log('保存成功');
  });
  emit('ok')
  messageStateStore.setIsShow(true);
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
      <a-form-item label="源文件(必须先上传)" field="sourceFiles" :rules="[{required: true, message: '源文件必须上传'}]">
        <oss-upload v-model="uploadData.sourceFiles" />
      </a-form-item>
      <a-form-item field="previewImages" label="预览图">
        <oss-upload v-model="uploadData.previewImages" :limit="1" />
      </a-form-item>
      <a-form-item field="linkFiles" label="链接文件">
        <oss-upload v-model="uploadData.linkFiles" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
</style>