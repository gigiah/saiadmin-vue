<script setup>
import { onMounted, ref } from "vue";
import clientGroupApi from '@/api/clientGroup';
import storeAreaApi from '@/api/storeAreaType';
import storeBusinessType from "@/api/storeBusinessType";
import storePricingType from "@/api/storePricingType";

const searchForm = ref({});

const emit = defineEmits(['search', 'reset']);

const handleReset = () => {
  searchForm.value = {};
  emit('reset');
}

const handleSearch = () => {
  emit('search', searchForm.value);
  loadSearchForm();
}

const clientGrpFieldNames = { value: 'id', label: 'name' }
const clientGrpOptions = ref([])
const areaFieldNames = { value: 'id', label: 'name' }
const areaOptions = ref([])
const bizFieldNames = { value: 'id', label: 'name' }
const bizOptions = ref([])
const pricingFieldNames = { value: 'id', label: 'name' }
const pricingOptions = ref([])

onMounted(() => {
  loadSearchForm();
})

const loadSearchForm = () => {
  clientGroupApi.getPageList({ type: 'all' }).then(res => {
    console.log(res.data);
    clientGrpOptions.value = res.data;
  });
  if (!searchForm.value.client_group_id) return;
  storeAreaApi.getPageList({
    type: 'all',
    client_group_id: searchForm.value.client_group_id
  }).then(res => {
    console.log(res.data);
    areaOptions.value = res.data;
  });
  storeBusinessType.getPageList({
    type: 'all',
    client_group_id: searchForm.value.client_group_id
  }).then(res => {
    bizOptions.value = res.data;
  });
  storePricingType.getPageList({
    type: 'all',
    client_group_id: searchForm.value.client_group_id
  }).then(res => {
    pricingOptions.value = res.data;
  });
}

</script>

<!--order/orderConfirm-->
<!--品牌名称=brand_name, type=input-->
<!--营销区域=store_area_type, type=select, data source url=/storeAreaType/index?type=all-->
<!--经营类型=store_business_type, type=select, data source url=/storeBusinessType/index?type=all-->
<!--价格体系=store_pricing_type, type=select, data source url=/storePricingType/index?type=all-->


<template>
  <a-form :model="searchForm" class="pt-4 pl-4 pr-4 ma-content-block">
    <a-row>
      <!-- <a-col :span="6">
        <a-form-item label="品牌名称" class="!mb-0" field="code">
          <a-input size="mini" v-model="searchForm.brand_name" placeholder="请输入品牌名称" allow-clear />
        </a-form-item>
      </a-col> -->
      <a-col :span="6">
        <a-form-item label="客户*" class="!mb-0" field="client_group_id">
          <a-select size="mini" v-model="searchForm.client_group_id" placeholder="请选择客户名称"
            :field-names="clientGrpFieldNames" :options="clientGrpOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="营销区域" class="!mb-0" field="store_area_type">
          <a-select size="mini" v-model="searchForm.store_area_type" placeholder="请选择营销区域" :field-names="areaFieldNames"
            :options="areaOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="经营类型" class="!mb-0" field="store_business_type">
          <a-select size="mini" v-model="searchForm.store_business_type" placeholder="请选择经营类型"
            :field-names="bizFieldNames" :options="bizOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="价格体系" class="!mb-0" field="store_pricing_type">
          <a-select size="mini" v-model="searchForm.store_pricing_type" placeholder="请选择价格体系"
            :field-names="pricingFieldNames" :options="pricingOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <!--      <a-col :span="8">-->
      <!--        <a-form-item label="创建时间" class="!mb-0" field="createTime">-->
      <!--          <a-range-picker size="mini" v-model="searchForm.createTime" />-->
      <!--        </a-form-item>-->
      <!--      </a-col>-->
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