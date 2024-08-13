<script setup>
import useUploadStore from "@/store/modules/upload";
import {onMounted, ref, watch} from "vue";

const uploadStore = useUploadStore();
const hasUpload = ref(false);

watch(() => uploadStore.$state, (val) => {
  hasUpload.value = Object.keys(uploadStore.$state).length > 0;
}, {deep: true});

function getCurrentTitle(item) {
    if (item.status === 'uploading') {
        return `文件上传中：${item.currentFileName}`;
    }
    if (item.status === 'success') {
        return `文件已全部上传成功`;
    }
    if (item.status === 'error') {
      return `文件上传失败：${item.currentFileName}`;
    }
    return '正在等待上传';
}

onMounted(() => {
  hasUpload.value = Object.keys(uploadStore.$state).length > 0;
})

</script>
<template>
  <div class="mgs-nfc rounded p-2 shadow-lg flex items-center justify-center">
    <a-list
        :max-height="360" class="h-full w-full" v-if="hasUpload">
      <a-list-item v-for="(item, key) in uploadStore.$state"
                   class="cursor-pointer"
                   :key="key">
        <a-list-item-meta :title="getCurrentTitle(item)">
          <template #description>
            <div class="flex justify-between" style="font-size: 13px;">
              <span>{{item.current}}/{{item.count}}</span>
            </div>
          </template>
          <template #avatar>
            <a-avatar class="arco-badge-color-green" >
              <icon-check v-if="item.status === 'success'" />
              <icon-close v-else-if="item.status === 'error'" />
              <icon-upload v-else />
            </a-avatar>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-empty v-else />
  </div>

</template>

<style lang="less" scoped>
.mgs-nfc {
  width: 400px;
  background: var(--color-bg-1);
  height: 360px;
  border: 1px solid var(--color-border-1);
  margin-right: 10px;
  margin-top: 9px;
  position: relative;
}
:deep(.arco-list-item-meta-content)
{
  width: 100%;
}
</style>