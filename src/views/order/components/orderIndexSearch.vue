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
  });
  storeApi.getPageList({type: 'all'}).then(res => {
    storeOptions.value = res.data;
  });
})

</script>

<!--order/orderIndex-->
<!--品牌名称=brand_name, type=input-->
<!--营销区域=store_area_type, type=select, data source url=/storeAreaType/index?type=all-->
<!--门店名称=store_id, type=select, data source url=/store/index?type=all-->
<!--订单号=code, type=input-->
<!--发货状态=delivery_status, 枚举 1=已发货 2=未发货, null=全部-->
<!--支付状态=pay_status, 枚举 1=已支付 2=未支付, null=全部-->
<!--起止日期=create_time, type=dateTimeRange-->


<template>
  <a-form :model="searchForm" class="ma-content-block pt-4 pr-4 pl-4">
    <a-row>
      <a-col :span="8">
        <a-form-item label="品牌名称" class="!mb-0" field="code">
          <a-input size="mini" v-model="searchForm.brand_name" placeholder="请输入品牌名称" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="营销区域" class="!mb-0" field="store_area_type">
          <a-select size="mini" v-model="searchForm.store_area_type" placeholder="请选择营销区域" :field-names="areaFieldNames" :options="areaOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="门店名称" class="!mb-0" field="store_id">
          <a-select size="mini" v-model="searchForm.store_id" placeholder="请选择门店名称" :field-names="storeFieldNames" :options="storeOptions" allow-clear allow-search />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单号" class="!mb-0" field="code">
          <a-input size="mini" v-model="searchForm.code" placeholder="请输入订单号" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="发货状态" class="!mb-0" field="delivery_status">
          <a-select size="mini" v-model="searchForm.delivery_status" placeholder="请选择发货状态" :options="[{label: '已发货', value: 1}, {label: '未发货', value: 2}]" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="支付状态" class="!mb-0" field="pay_status">
          <a-select size="mini" v-model="searchForm.pay_status" placeholder="请选择支付状态" :options="[{label: '已支付', value: 1}, {label: '未支付', value: 2}]" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="起止日期" class="!mb-0" field="create_time">
          <a-range-picker size="mini" v-model="searchForm.create_time" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <div class="ma-content-block flex items-center justify-center pt-4 gap-4">
    <a-button type="primary" size="mini" @click="handleSearch">查询</a-button>
    <a-button size="mini" @click="handleReset">
      <template #icon>
        <icon-refresh />
      </template>
      <template #default>重置</template>
    </a-button>
  </div>
</template>