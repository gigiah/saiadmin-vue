<template>
  <a-modal :visible="visible" title="选择门店" @ok="onAddStoreOk" @cancel="onAddStoreCancel" :on-before-ok="onAddStoreBeforeOk">
    <a-form ref="addStoreFormRef" :model="addStoreModalForm" :rules="addStoreFormRules">
      <a-form-item label="门店名称" field="store_id" required>
        <store-select v-model="addStoreModalForm.store_id"></store-select>
      </a-form-item>
      <a-form-item label="收货地址" field="consignee_id" required>
        <consignee-select v-model="addStoreModalForm.consignee_id"></consignee-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import StoreSelect from "@/views/order4Client/components/storeSelect.vue";
import ConsigneeSelect from "@/views/order4Client/components/consigneeSelect.vue";
import {ref} from "vue";
import orderApi from "@/api/order";
import {Message} from "@arco-design/web-vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(['addSuccess', "addCancel"]);

const addStoreFormRef = ref();

const addStoreModalForm = ref({
  store_id: '',
  consignee_id: '',
});

const addStoreFormRules = {
  store_id: [{required: true, message: '请选择门店'}],
  consignee_id: [{required: true, message: '请选择门店地址'}]
}

async function onAddStoreBeforeOk() {
  const error = await addStoreFormRef.value.validate();
  return !error;

}

function onAddStoreOk() {
  orderApi.save({
    ...addStoreModalForm.value,
    parent_id: 0,
    row_type: "order",
  }).then(res => {
    if (res.code !== 200) {
      return;
    }
    emit('addSuccess');
  });
}

function onAddStoreCancel() {
  emit('addCancel');
}
</script>

<style scoped>
</style>