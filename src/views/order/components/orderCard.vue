<template>
  <a-card size="small">
    <template #title>
      <div class="flex flex-row align-center">
        <a-checkbox :value="order.id"><span class="pr-2">订单编号:</span>{{ order.code }}</a-checkbox>
        <div class="text-xs">
          <span class="pr-4 font-bold text-center">{{ order.check_time }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.store_name">{{ order.store_name }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.store_area_type">{{ order.store_area_type }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.store_business_type">{{ order.store_business_type
            }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.store_product_type">{{ order.store_product_type }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.store_pricing_type">{{ order.store_pricing_type }}</span>
          <span class="pr-4 font-bold text-center" v-if="order.settle_method">{{ settleMethodLabel }}</span>
          <span class="pr-2 font-bold text-center">收货地址:</span>
          <store-select style="width: 150px" v-model="order.consignee_id" size="mini" @change="onStoreChanged" />
        </div>
      </div>
    </template>
    <template #extra>
      <div class="flex flex-row items-center gap-4">
        <a-button type="primary" @click="expandAll" size="mini">{{ tableExpand ? '收起' : '展开' }}全部</a-button>
        <a-button v-if="scene === 'confirm'" type="primary" size="mini" @click="onPass">通过</a-button>
        <a-button v-if="scene === 'confirm'" type="primary" size="mini" status="danger" @click="onBack">打回</a-button>
      </div>
    </template>
    <div class="flex flex-row items-center gap-2 pb-3 font-bold" style="font-size: 12px">
      <span class="pt-0.5">
        <span class="pl-1 text-black">品牌名称:</span>
        <span class="pl-3 text-black">{{ order.client_brand }}</span>
      </span>
      <span class="pt-0.5">
        <span class="pl-1 text-black">提交人:</span>
        <span class="pl-3 text-black">{{ order.order_submiter }}</span>
      </span>
      <span class="pt-0.5">
        <span class="pl-1 text-black">卡券名称:</span>
        <span class="pl-3 text-black">{{ order.coupon_name }}</span>
      </span>
      <span class="pt-0.5">
        <span class="pl-1 text-black">发货计划:</span>
        <a-date-picker :disabled="scene === 'index'" size="mini" style="width: 150px; margin-left: 20px"
          v-model="order.delivery_time" @change="onDeliveryTimeChange" />
      </span>
      <span v-if="scene === 'index'" class="pt-0.5">
        <span class="pl-1 text-black">支付状态:</span>
        <span class="pl-3 text-black">{{ payStatusLabel }}</span>
      </span>
      <span style="display: none;" class="pt-0.5">
        <span class="pl-1 text-black">发货状态:</span>
        <a-select :disabled="scene === 'index'" :options="[{
          label: '已发货',
          value: 1
        }, {
          label: '未发货',
          value: 2
        }]" v-model="order.delivery_status" size="mini" style="width: 100px; margin-left: 20px"
          @change="onDeliveryStatusChange" />
      </span>
      <span class="pt-0.5">
        <span class="pl-1 text-black">优惠金额:</span>
        <span class="pl-3 text-black">{{ order.coupon_consume }}</span>
      </span>
      <span class="pt-0.5 flex flex-row items-center">
        <span class="text-black">运费:</span>
        <a-input-number style="width: 80px; margin-left: 20px;" size="mini" class="pl-3" v-model="order.freight_avg"
          @blur="onFreightBlur" />
      </span>
      <span class="pt-0.5">
        <span class="pl-1 text-black">订单金额:</span>
        <span class="pl-3 text-black">{{ order.pay_amount }}</span>
      </span>
      <span v-if="scene === 'index'" class="pt-0.5">
        <span class="pl-1 text-black">汇总批号:</span>
        <span class="pl-3 text-black">{{ order.summary_batch_code }}</span>
      </span>
    </div>
    <div class="flex flex-row gap-4 pb-3 align-center">
      <!--      style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 10px"-->
      <!--      <a-typography-title :heading="6">商品列表</a-typography-title>-->
      <div class="flex flex-row gap-2 align-center">
        <span class="font-bold" style="font-size: 12px; padding-top: 0.125rem; color: black">订单备注:</span>
        <a-input size="mini" v-model="order.remark" style="width: 800px" @focus="onRemarkFocus" @blur="onRemarkBlur"
          @pressEnter="onRemarkBlur" />
      </div>
    </div>
    <a-table size="mini" :data="goods" column-resizable :bordered="{ cell: true }" :pagination="false" ref="tableRef"
      hide-expand-button-on-empty :scroll="{ x: 2000, y: 2000 }">
      <template #columns>
        <a-table-column title="产品名称" data-index="product_id" :width="300">
          <template #cell="{ record, column, index }">
            <span v-if="record.row_type === 'craft'"></span>
            <product-id-select size="mini" v-else v-model="record.product_id" :disabled="disableProductEdit(record)"
              @change="onProductChanged($event, record)" />
          </template>
        </a-table-column>
        <a-table-column title="产品级别" data-index="product_grade_id" :width="100">
          <!--          <template #cell="{ record, column, index }">-->
          <!--            <product-grade-select v-model="record.product_grade_id" :disabled="true" />-->
          <!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['productGrade']">{{ renderDictValue('productGrade',
          record.product_grade_id) }}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="画面类型" data-index="product_picture_type_id" :width="100">
          <!--          <template #cell="{ record, column, index }">-->
          <!--            <product-picture-type-select v-model="record.product_picture_type_id" :disabled="true" />-->
          <!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['productPictureType']">{{ renderDictValue('productPictureType',
          record.product_picture_type_id) }}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="源文件" data-index="associated_file" :width="300">
          <template #cell="{ record, column, index }">
            <span v-if="record.row_type === 'craft'"></span>
            <associated-file-select size="mini" v-else v-model="record.associated_file" disabled />
          </template>
        </a-table-column>
        <a-table-column title="识别符" data-index="identify" :width="100">
          <template #cell="{ record, column, index }">
            <span v-if="record.row_type === 'craft'"></span>
            <a-input size="mini" v-else v-model="record.identify" :disabled="!record.editable" />
          </template>
        </a-table-column>
        <a-table-column title="宽度cm" data-index="width" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.width" disabled :min="0" :step="1" />
          </template>
        </a-table-column>
        <a-table-column title="高度cm" data-index="height" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.height" disabled :min="0" :step="1" />
          </template>
        </a-table-column>
        <a-table-column title="数量" data-index="nums" :width="120">
          <template #cell="{ record, column, index }">
            <a-input-number size="mini" v-model="record.nums" :disabled="scene !== 'index' || !record.editable" :min="0"
              :step="1" />
          </template>
        </a-table-column>
        <a-table-column v-if="scene === 'create'" title="工艺" data-index="craft_id">
          <template #cell="{ record, column, index }">
            <a-button v-if="record.row_type === 'goods'" size="mini" status="success" shape="circle"
              @click="addCraft(record)">
              <icon-plus />
            </a-button>
            <pricing-craft-select size="mini" v-if="record.row_type === 'craft'" v-model="record.craft_id"
              :disabled="disableCraftEdit(record)" @change="onCraftChanged($event, record)"
              :product-id="record.product_id" />
          </template>
        </a-table-column>
        <a-table-column title="计价方式" data-index="pricing_type_id" :width="100">
          <!--          <template #cell="{ record, column, index }">-->
          <!--            <pricing-type-select v-model="record.pricing_type_id" :disabled="true" />-->
          <!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['pricingType']">{{ renderDictValue('pricingType', record.pricing_type_id)
              }}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="计量单位" data-index="pricing_unit_id" :width="100">
          <!--          <template #cell="{ record, column, index }">-->
          <!--            <pricing-unit-select v-model="record.pricing_unit_id" :disabled="true" />-->
          <!--          </template>-->
          <template #cell="{ record, column, index }">
            <span v-if="bizDict.$state['pricingUnit']">{{ renderDictValue('pricingUnit', record.pricing_unit_id)
              }}</span>
            <span v-else>加载中</span>
          </template>
        </a-table-column>
        <a-table-column title="单价" data-index="unit_price">
          <!--          <template #cell="{ record, column, index }">-->
          <!--            <a-input v-model="record.unit_price" :disabled="true" />-->
          <!--          </template>-->
          <template #cell="{ record, column, index }">
            <span>{{ record.unit_price ? record.unit_price : '' }}</span>
          </template>
        </a-table-column>
        <a-table-column title="金额" data-index="amount" />
        <a-table-column title="操作" fixed="right" :width="140">
          <template #cell="{ record, column }">
            <div style="display: flex; flex-direction: row; gap: 10px">
              <a-button v-if="!record.editable && scene === 'create'" shape="circle" status="danger" size="mini"
                @click="onDeleteGoodsOrCraft(record)">
                <icon-delete />
              </a-button>
              <a-button v-if="!record.editable && record.row_type === 'goods'" size="mini" status="warning"
                shape="circle" @click="onEditGoodsOrCraft(record)">
                <icon-edit />
              </a-button>
              <a-button v-if="record.editable" type="primary" status="success" size="mini" shape="circle"
                @click="onSubmitGoodsOrCraft(record)">
                <icon-check />
              </a-button>
              <a-button v-if="record.editable" type="primary" status="danger" size="mini" shape="circle"
                @click="onCancelGoodsOrCraft(record)">
                <icon-close />
              </a-button>
              <a-button v-if="record.row_type === 'goods'" size="mini" status="success" shape="circle"
                @click="openFileModal(record)">
                <icon-eye />
              </a-button>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
  <ma-form-modal ref="modalRef" v-model:visible="visible" :hide-title="true" :width="800" :column="modalColumn"
    :submit="() => { }">
  </ma-form-modal>
</template>
<script setup>

import { computed, onMounted, ref, watch, reactive } from "vue";
import orderApi from '@/api/order';
import pricingProductApi from '@/api/pricingProduct';
import pricingCraftApi from '@/api/pricingCraft';
import uploadBatchApi from '@/api/uploadBatch';
import { Message, Modal } from "@arco-design/web-vue";
import { v4 as uuidv4 } from 'uuid';

import { useBizDictStore } from "@/store";
import ProductIdSelect from "@/views/order4Client/components/productIdSelect.vue";
import AssociatedFileSelect from "@/views/order4Client/components/associatedFileSelect.vue";
import PricingCraftSelect from "@/views/order4Client/components/pricingCraftSelect.vue";
import StoreSelect from "@/views/order4Client/components/storeSelect.vue";
import MaFormModal from "@/components/ma-form-modal/index.vue"

const bizDict = useBizDictStore();

const props = defineProps({
  order: Object,
  scene: String
});


const modalColumn = reactive([
  {
    title: '标题',
    dataIndex: 'title',
    width: 180,
    search: true,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '标题必填' }],
  },
  {
    title: '源文件',
    dataIndex: 'source_file',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'input',
    disabled: true,
    commonRules: [{ required: true, message: '源文件必填' }],
  },
  {
    title: '预览图',
    dataIndex: 'preview_image',
    width: 180,
    search: false,
    addDisplay: true,
    editDisplay: true,
    hide: false,
    formType: 'upload',
    type: 'image',
    returnType: 'url',
    multiple: false,
    disabled: true,
    commonRules: [{ required: false, message: '预览图必填' }],
  },
  {
    formType: 'card',
    title: '链接文件',
    formList: [
      {
        title: '',
        hideLabel: true,
        formType: 'children-form',
        dataIndex: 'link_file_list',
        type: 'table',
        showBtn: false,
        disabled: true,
        formList: [
          {
            title: '文件名',
            hideLabel: true,
            dataIndex: 'label',
            disabled: true,
            formType: 'input',
            width: 150,
          },
          {
            title: '地址',
            hideLabel: true,
            dataIndex: 'value',
            disabled: true,
            formType: 'input',
          },
        ],
      },
    ],
  },
])

watch(() => props.order, () => {
  console.log('order changed');
  initGoods();
});

const payStatusLabel = computed(() => {
  switch (props.order.pay_status) {
    case 1:
      return '已支付';
    case 2:
      return '未支付';
    default:
      return '未知';
  }
})

const consigneeAddress = computed(() => {
  const obj = bizDict.$state['store'][props.order.consignee_id];
  return obj ? obj.label : '';
});

const deliveryStatusLabel = computed(() => {
  switch (props.order.delivery_status) {
    case 1:
      return '已发货';
    case 2:
      return '未发货';
    default:
      return '未知';
  }
})

const settleMethodLabel = computed(() => {
  switch (props.order.settle_method) {
    case 'current':
      return '现结';
    case 'month':
      return '月结';
    default:
      return '未知';
  }
})

const emit = defineEmits(['changed']);

const goods = ref([]);
const tableRef = ref();

let tempRecord = {};

function disableProductEdit(record) {
  if (props.scene === 'confirm') {
    return true;
  }
  if (typeof (record.key) === 'string') {
    return !record.editable && record.key.includes('tmpAdd');
  } else {
    return true;
  }
}

function disableCraftEdit(record) {
  if (typeof (record.key) === 'string') {
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
  if (typeof (record.key) === 'string' && record.key.includes('tmpAdd')) {
    if (!record.width || !record.height || !record.nums || !record.product_id) {
      Message.error('请选择产品，填写宽度、高度、数量');
      return;
    }
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
  if (typeof (record.key) === 'string' && record.key.includes('tmpAdd')) {
    if (record.row_type === 'goods') {
      goods.value.splice(goods.value.findIndex((item) => item.key === record.key), 1);
    } else if (record.row_type === 'craft') {
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

function handleSubmitCheck() {
  Modal.confirm({
    title: '确认发起提交',
    content: '是否确认发起提交？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: [props.order.id],
        value: '审批中',
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
  tableExpand.value ? tableRef.value.expandAll(true) : tableRef.value.expandAll(false);
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

function onFreightBlur() {
  orderApi.update(props.order.id, {
    row_type: 'order',
    store_id: props.order.store_id,
    consignee_id: props.order.consignee_id,
    freight_avg: props.order.freight_avg
  }).then(value => {
    if (value.code === 200) {
      Message.success('更新成功');
      emit('changed');
    }
  })
}

function onPass() {
  Modal.confirm({
    title: '确认',
    content: '是否确认？',
    onOk: () => {
      orderApi.handleOrderChange({
        ids: [props.order.id],
        value: '生产中',
      }).then(value => {
        if (value.code === 200) {
          Message.success('提交成功');
          emit('changed');
        }
      })
    }
  });
}

function onBack() {
  Modal.confirm({
    title: '确认',
    content: '是否确认？',
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

function onDeliveryStatusChange() {
  orderApi.update(props.order.id, {
    row_type: 'order',
    store_id: props.order.store_id,
    consignee_id: props.order.consignee_id,
    delivery_status: props.order.delivery_status
  }).then(value => {
    if (value.code === 200) {
      Message.success('更新成功');
      emit('changed');
    }
  })
}

function onDeliveryTimeChange() {
  orderApi.update(props.order.id, {
    row_type: 'order',
    store_id: props.order.store_id,
    consignee_id: props.order.consignee_id,
    delivery_time: props.order.delivery_time
  }).then(value => {
    if (value.code === 200) {
      Message.success('更新成功');
      emit('changed');
    }
  })
}

const modalRef = ref()

const visible = ref(false)

const openFileModal = (record) => {
  console.log(record)
  uploadBatchApi.read(record.associated_file)
    .then(res => {
      Object.keys(res.data).forEach((key) => {
        modalRef.value.form[key] = res.data[key]
      })
      visible.value = true
    })
}

</script>

<style scoped></style>