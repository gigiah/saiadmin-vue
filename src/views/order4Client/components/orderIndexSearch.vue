<script setup>
import {onMounted, ref} from "vue";
import storeAreaApi from '@/api/storeAreaType';
import storeApi from '@/api/store';

const searchForm = ref({});

const emit = defineEmits(['search', 'reset']);

const handleReset = () => {
  searchForm.value = {};
  emit('reset');
}

const handleSearch = () => {
  emit('search', searchForm.value);
}

const areaFieldNames = {value: 'id', label: 'name'}
const areaOptions = ref([])
const storeFieldNames = {value: 'id', label: 'name'}
const storeOptions = ref([])

onMounted(() => {
  storeAreaApi.getPageList({type: 'all'}).then(res => {
    console.log(res.data);
    areaOptions.value = res.data;
  })
  storeApi.getPageList({type: 'all'}).then(res => {
    storeOptions.value = res.data;
  })
})

</script>

<template>
  <a-form :model="searchForm" class="pt-4 pl-4 pr-4 ma-content-block">
    <a-row>
      <a-col :span="6">
        <a-form-item label="订单号" class="!mb-0" field="code">
          <a-input size="mini" v-model="searchForm.code" placeholder="请输入订单号" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="营销区域" class="!mb-0" field="store_area_type">
          <a-select size="mini" v-model="searchForm.store_area_type" placeholder="请选择营销区域" :field-names="areaFieldNames" :options="areaOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="门店名称" class="!mb-0" field="store_id">
          <a-select size="mini" v-model="searchForm.store_id" placeholder="请输入门店名称" :field-names="storeFieldNames" :options="storeOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="起止日期*" class="!mb-0" field="create_time">
          <a-range-picker size="mini" v-model="searchForm.create_time" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <div class="flex items-center justify-center gap-4 pt-4 ma-content-block">
    <a-button type="primary" size="mini" @click="handleSearch">查询</a-button>
    <a-button size="mini" @click="handleReset">
      <template #icon>
        <icon-refresh />
      </template>
      <template #default>重置</template>
    </a-button>
  </div>
</template>