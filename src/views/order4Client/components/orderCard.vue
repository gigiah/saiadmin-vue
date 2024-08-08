<template>
  <a-card size="small">
    <template #title>
      <div class="flex-row align-center flex">
        <a-checkbox :value="order.id"><span class="pr-2">订单编号:</span>{{order.code}}</a-checkbox>
        <div class="text-xs">
          <span class="pr-4 text-center font-bold" v-if="order.store_name">{{order.store_name}}</span>
          <span class="pr-4 text-center font-bold" v-if="order.store_area_type">{{order.store_area_type}}</span>
          <span class="pr-4 text-center font-bold" v-if="order.store_business_type">{{order.store_business_type}}</span>
          <span class="pr-4 text-center font-bold" v-if="order.store_product_type">{{order.store_product_type}}</span>
          <span class="pr-4 text-center font-bold" v-if="order.store_pricing_type">{{order.store_pricing_type}}</span>
          <span class="pr-2 text-center font-bold">门店地址:</span>
          <store-select v-model="order.consignee_id" size="mini" @change="onStoreChanged" />
        </div>
      </div>
    </template>
    <template #extra>
      <a-button type="primary" @click="expandAll" size="mini" style="margin-right: 1rem">{{tableExpand ? '收起': '展开'}}全部</a-button>
      <a-button type="primary" status="success" size="mini" @click="handleSubmit" style="margin-right: 1rem">提交审订</a-button>
      <a-button type="primary" status="danger" size="mini" @click="handleDeleteOrder">删除订单</a-button>
    </template>
<!--    <div class="flex flex-row align-center">-->
<!--      <a-typography>{{ order.consignee_address }}</a-typography>-->
<!--    </div>-->
    <div class="flex flex-row align-center pb-3 gap-4">
<!--      style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 10px"-->
<!--      <a-typography-title :heading="6">商品列表</a-typography-title>-->
      <a-button type="primary" status="success" @click="addNew" size="mini">新增商品</a-button>
      <div class="flex flex-row align-center gap-2">
        <span style="padding-top: 0.125rem; color: black">订单备注:</span>
        <a-input size="mini" v-model="order.remark" style="width: 200px" @focus="onRemarkFocus" @blur="onRemarkBlur" @pressEnter="onRemarkBlur" />

      </div>
    </div>
    <a-table size="mini" :data="goods" column-resizable :bordered="{cell: true}" :pagination="false"
             ref="tableRef"
             hide-expand-button-on-empty
             :scroll="{x: 2000, y: 2000}">
      <template #columns>
        <a-table-column title="产品名称" data-index="product_id" :width="300">
          <template #cell="{ record, column, index }">
            <span v-if="record.row_type === 'craft'"></span>
            <product-id-select size="mini" v-else v-model="record.product_id" :disabled="disableProductEdit(record)" @change="onProductChanged($event, record)" />
          </template>
        </a-table-column>
        <a-table-column title="产品级别" data-index="product_grade_id" :width="100">
<!--          <template #cell="{ record, column, index }">-->
<!--            <product-grade-select v-model="record.product_grade_id" :disabled="true" />-->
<!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['productGrade']">{{renderDictValue('productGrade', record.product_grade_id)}}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="画面类型" data-index="product_picture_type_id" :width="100">
<!--          <template #cell="{ record, column, index }">-->
<!--            <product-picture-type-select v-model="record.product_picture_type_id" :disabled="true" />-->
<!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['productPictureType']">{{renderDictValue('productPictureType', record.product_grade_id)}}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="源文件" data-index="associated_file" :width="300">
          <template #cell="{ record, column, index }">
            <span v-if="record.row_type === 'craft'"></span>
            <associated-file-select size="mini" v-else v-model="record.associated_file" :disabled="!record.editable" />
          </template>
        </a-table-column>
        <a-table-column title="宽度cm" data-index="width" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.width" :disabled="!record.editable || record.row_type === 'craft'" :min="0" :step="1" />
          </template>
        </a-table-column>
        <a-table-column title="高度cm" data-index="height" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.height" :disabled="!record.editable || record.row_type === 'craft'" :min="0" :step="1" />
          </template>
        </a-table-column>
        <a-table-column title="数量" data-index="nums" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.nums" :disabled="!record.editable || record.row_type === 'craft'" :min="0" :step="1" />
          </template>
        </a-table-column>
        <a-table-column title="工艺" data-index="craft_id">
          <template #cell="{ record, column, index }">
            <a-button v-if="record.row_type === 'goods'" size="mini" status="success" shape="circle" @click="addCraft(record)">
              <icon-plus />
            </a-button>
            <pricing-craft-select size="mini" v-if="record.row_type === 'craft'" v-model="record.craft_id" :disabled="disableCraftEdit(record)" @change="onCraftChanged($event, record)" :product-id="record.product_id" />
          </template>
        </a-table-column>
        <a-table-column title="计价方式" data-index="pricing_type_id" :width="100">
<!--          <template #cell="{ record, column, index }">-->
<!--            <pricing-type-select v-model="record.pricing_type_id" :disabled="true" />-->
<!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['pricingType']">{{renderDictValue('pricingType', record.pricing_type_id)}}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="计量单位" data-index="pricing_unit_id" :width="100">
<!--          <template #cell="{ record, column, index }">-->
<!--            <pricing-unit-select v-model="record.pricing_unit_id" :disabled="true" />-->
<!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['pricingUnit']">{{renderDictValue('pricingUnit', record.pricing_unit_id)}}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="单价" data-index="unit_price">
<!--          <template #cell="{ record, column, index }">-->
<!--            <a-input v-model="record.unit_price" :disabled="true" />-->
<!--          </template>-->
          <template #cell="{ record, column, index }">
            <span>{{record.unit_price ? record.unit_price : ''}}</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" fixed="right" :width="280">
          <template #cell="{ record, column }">
            <div style="display: flex; flex-direction: row; gap: 10px">
              <a-button v-if="!record.editable" shape="circle" status="danger" size="mini" @click="onDeleteGoodsOrCraft(record)">
                <icon-delete />
              </a-button>
              <a-button v-if="!record.editable && record.row_type === 'goods'" size="mini" status="warning" shape="circle" @click="onEditGoodsOrCraft(record)">
                <icon-edit />
              </a-button>
              <a-button v-if="record.editable" type="primary" status="success" size="mini" shape="circle" @click="onSubmitGoodsOrCraft(record)">
                <icon-check />
              </a-button>
              <a-button v-if="record.editable" type="primary" status="danger" size="mini" shape="circle" @click="onCancelGoodsOrCraft(record)">
                <icon-close />
              </a-button>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>
<script setup>

import {onMounted, ref, watch} from "vue";
import orderApi from '@/api/order';
import pricingProductApi from '@/api/pricingProduct';
import pricingCraftApi from '@/api/pricingCraft';
import {Message, Modal} from "@arco-design/web-vue";
import {v4 as uuidv4} from 'uuid';

import {useBizDictStore} from "@/store";
import ProductIdSelect from "@/views/order4Client/components/productIdSelect.vue";
import AssociatedFileSelect from "@/views/order4Client/components/associatedFileSelect.vue";
import PricingCraftSelect from "@/views/order4Client/components/pricingCraftSelect.vue";
import StoreSelect from "@/views/order4Client/components/storeSelect.vue";

const bizDict = useBizDictStore();

const props = defineProps({
  order: Object
});

watch(() => props.order, () => {
  console.log('order changed');
  initGoods();
});

const emit = defineEmits(['changed']);

const goods = ref([]);
const tableRef = ref();

let tempRecord = {};

function disableProductEdit(record) {
  if (typeof(record.key) === 'string') {
    return !record.editable && record.key.includes('tmpAdd');
  } else {
    return true;
  }
}

function disableCraftEdit(record) {
  if (typeof(record.key) === 'string') {
    return !record.key.includes('tmpAdd');
  } else {
    return true;
  }
}

function renderDictValue(dictName, value) {
  if (bizDict.$state[dictName]) {
    const dictItem = bizDict.$state[dictName].find(item => item.value === value);
    return dictItem ? dictItem.label : '';
  } else {
    return '加载中';
  }
}

function onProductChanged(value, record) {
  pricingProductApi.read4Order({
    id: value,
  }).then(res => {
    if (res.code === 200) {
      record.product_grade_id = res.data.grade_id;
      record.product_picture_type_id = res.data.picture_type_id;
      record.pricing_type_id = res.data.pricing_type_id;
      record.pricing_unit_id = res.data.pricing_unit_id;
      record.unit_price = res.data.price;
    }
  })
}

function onCraftChanged(value, record) {
  pricingCraftApi.read4Order({
    id: value,
  }).then(res => {
    if (res.code === 200) {
      record.pricing_type_id = res.data.pricing_type_id;
      record.pricing_unit_id = res.data.pricing_unit_id;
      record.unit_price = res.data.price;
    }
  });
}

function initGoods() {
  goods.value = props.order.children.map((item) => {
    let parent = goods.value.find((goodsItem) => goodsItem.id === item.id);
    let result = patchItem(item, parent);
    if (item.children) {
      item.children = item.children.map((child) => {
        return patchItem(child, item);
      });
    }
    return result;
    // item.editable = false;
    // item.key = item.id;
    // if (item.children) {
    //   item.children = item.children.map((child) => {
    //     child.editable = false;
    //     child.key = child.id;
    //     return child;
    //   });
    // }
    // return item;
  });
}

function patchItem(inputItem, parent) {
  return {
    ...inputItem,
    editable: parent ? parent.editable : false,
    key: inputItem.id,
  }
}

onMounted(initGoods);

function addNew() {
  goods.value.push({
    key: "tmpAdd" + uuidv4(),
    editable: true,
    row_type: 'goods',
    parent_id: props.order.id,
    store_id: props.order.store_id
  });
}

function handleDeleteOrder() {
  Modal.confirm({
    title: '确认删除',
    content: '是否确认删除该订单？',
    onOk: () => {
      orderApi.handleDelete([{
        type: "order",
        id: props.order.id,
      }]).then(value => {
        if (value.code === 200) {
          Message.success('删除成功');
          emit('changed');
        }
      })
    }
  });
}

function addCraft(record) {
  record.children.push({
    key: "tmpAdd" + uuidv4(),
    editable: true,
    row_type: 'craft',
    parent_id: record.id,
    product_id: record.product_id,
    nums: record.nums,
    width: record.width,
    height: record.height,
  });
  tableRef.value.expand(record.key);
}

function onEditGoodsOrCraft(record) {
  record.editable = true;
  let tmp = {};
  Object.assign(tmp, record);
  tempRecord[record.key] = tmp;
}

function onDeleteGoodsOrCraft(record) {
  Modal.confirm({
    title: '确认删除',
    content: '是否确认删除该商品？',
    onOk: () => {
      orderApi.handleDelete([{
        type: record.row_type,
        id: record.id,
      }]).then(value => {
        if (value.code === 200) {
          Message.success('删除成功');
          emit('changed');
        }
      })
    }
  })
}

function onSubmitGoodsOrCraft(record) {
  if (typeof(record.key) === 'string' && record.key.includes('tmpAdd')) {
    insertGoodsOrCraft(record);
  } else {
    updateGoodsOrCraft(record);
  }
}

function updateGoodsOrCraft(record) {
  orderApi.update(record.id, record).then(value => {
    if (value.code === 200) {
      Message.success('更新成功');
      record.editable = false;
      emit('changed');
    }
  })
}

function insertGoodsOrCraft(record) {
  orderApi.save(record).then(value => {
    if (value.code === 200) {
      Message.success('新增成功');
      emit('changed');
    }
  })
}

function onCancelGoodsOrCraft(record) {
  if (typeof(record.key) === 'string' && record.key.includes('tmpAdd')) {
    if (record.row_type === 'goods') {
      goods.value.splice(goods.value.findIndex((item) => item.key === record.key), 1);
    } else if(record.row_type === 'craft') {
      const parent = goods.value.find((item) => item.id === record.parent_id);
      parent.children.splice(parent.children.findIndex((item) => item.key === record.key), 1);
    } else {
      console.error('未知类型');
    }
  } else {
    Object.assign(record, tempRecord[record.key]);
    record.editable = false;
  }
}

function handleSubmit() {
  Modal.confirm({
    title: '确认审订',
    content: '是否确认审订该订单？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: [props.order.id],
        value: '审订中',
      }).then(value => {
        if (value.code === 200) {
          Message.success('提交成功');
          emit('changed');
        }
      })
    }
  });
}

const tableExpand = ref(false);

function expandAll() {
  tableExpand.value = !tableExpand.value;
  tableExpand.value ? tableRef.value.expandAll(true): tableRef.value.expandAll(false);
}

let tempRemark = props.order.remark;

function onRemarkFocus() {
  tempRemark = props.order.remark;
}

function onRemarkBlur() {
  if (tempRemark === props.order.remark) {
    return;
  }
  orderApi.update(props.order.id, {
    row_type: 'order',
    store_id: props.order.store_id,
    consignee_id: props.order.consignee_id,
    remark: props.order.remark
  }).then(value => {
    if (value.code === 200) {
      tempRemark = props.order.remark;
      Message.success('更新成功');
      emit('changed');
    }
  })
}

function onStoreChanged(value) {
  orderApi.update(props.order.id, {
    row_type: 'order',
    store_id: props.order.store_id,
    consignee_id: value
  }).then(value => {
    if (value.code === 200) {
      Message.success('更新成功');
      emit('changed');
    }
  })
}

</script>

<style scoped>
</style>