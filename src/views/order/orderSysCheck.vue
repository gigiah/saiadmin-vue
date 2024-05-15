<template>
  <div class="h-full ma-content-block">
    <!--订单表单-->
    <div class="p-3 ma-content-block">
      <ma-form v-if="showForm" v-model="form" :options="options" :columns="columns">
      </ma-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Notification, Message, Button, Modal } from '@arco-design/web-vue'
import orderApi from '@/api/order'
import orderGoodsApi from '@/api/orderGoods'
import storeApi from '@/api/store'
import warehouseAddressApi from '@/api/warehouseAddress'
import productApi from '@/api/product'
import attachmentApi from '@/api/system/attachment'
import pricingTypeApi from '@/api/pricingType'
import pricingUnitApi from '@/api/pricingUnit'
import couponItemApi from '@/api/couponItem'

const list = ref([])

const form = ref({})//订单表单
const options = ref({
  showButtons: false,
})//订单选项
const columns = ref([])//订单字段
const crudRef = ref()//选择门店的crud
const showStore = ref(false)//是否弹出选择对话框
const showForm = ref(true)//是否展示订单表单
const selectStore = reactive({
  storeIds: new Set(), // 使用Set来存储已经选择的ID
});
const warehouses = ref([])//仓库地址
const products = ref([])//产品库
const productSelect = ref([])//产品选项
const files = ref([])//文件库
const filesSelect = ref([])//文件选项
const coupons = ref([])//卡券
const pricingType = ref([])//计价方式
const pricingUnit = ref([])//计量单位

// 加载订单
const getList = async () => {
  try {
    const order = await orderApi.getPageList({ type: 'all' });
    for (const orderItem of order.data) {
      let orderGoods = [];
      const goods = await orderGoodsApi.getPageList({ type: 'all', order_id: orderItem.id });
      for (const goodsItem of goods.data) {
        orderGoods.push(goodsItem);
      }
      list.value.push({
        'orderData': orderItem,
        'orderGoods': orderGoods,
      });
    }
  } catch (error) {
    console.error("获取订单列表失败", error);
  }
};

const renderList = async () => {
  await getList();
  list.value.forEach(function (item) {
    if (item.orderGoods.length > 0) {
      columns.value.push(orderTemplate(item.orderData.id, item.orderData, item.orderGoods));
    }
  });
};
renderList();


//加载卡券
const getMyCoupon = () => {
  couponItemApi.getMyCoupon()
    .then(res => {
      coupons.value = res.data
    }).catch(error => {
      console.error("获取卡券失败", error)
    })
}
getMyCoupon()

//加载仓库地址
const getWarehouses = () => {
  warehouseAddressApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        warehouses.value.push({
          label: item.address,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取仓库地址失败", error)
    })
}
getWarehouses()

//加载产品库
const getProducts = () => {
  productApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        products.value.push(item)
        productSelect.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取产品库失败", error)
    })
}
getProducts()

//加载计价方式
const getPricingType = () => {
  pricingTypeApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        pricingType.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取计价方式失败", error)
    })
}
getPricingType()

//加载计量单位
const getPricingUnit = () => {
  pricingUnitApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        pricingUnit.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取计量单位失败", error)
    })
}
getPricingUnit()

//加载文件库
const getFiles = () => {
  attachmentApi.getPageList({ type: 'all' })
    .then(res => {
      res.data.forEach(function (item) {
        files.value.push(item)
        filesSelect.value.push({
          label: item.origin_name,
          value: item.id
        })
      })
    })
    .catch(error => {
      console.error("获取文件库失败", error)
    })
}
getFiles()

const handleSubmit = async ({ values, errors }) => {
  Modal.info({
    title: '提示',
    content: '确定提交订单吗？',
    simple: false,
    onBeforeOk: (done) => {
      // console.log('form data', form.value)
      // let data = integrateData(form.value)
      // console.log('integrate data', data);
      // orderApi.handleCreateOrder(data)
      // columns.value = []
      // selectStore.storeIds.clear()
      // done(true)
      // Notification.success('订单提交成功')
    },
  })
}

const integrateData = (data) => {
  const result = [];
  // 遍历 JSON 对象的键
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // 获取 ID（例如："order-list-1" 中的 "1"）
      const idMatch = key.match(/(\d+)$/);
      if (idMatch) {
        const id = idMatch[0];
        // 查找或创建对应 ID 的集成对象
        let orderGroup = result.find(item => item.id === id);
        if (!orderGroup) {
          orderGroup = { id: id, orderList: [], consignee: null };
          result.push(orderGroup);
        }
        // 根据键名决定如何处理数据
        if (key.startsWith('order-list')) {
          // 将 "order-list-x" 的数组合并到 orderList
          orderGroup.orderList.push(...data[key]);
        } else if (key.startsWith('consignee')) {
          // 将 "consignee-x" 的值设置为 consignee
          orderGroup.consignee = data[key];
        }
      }
    }
  }
  return result;
}

const orderTemplate = (orderId, orderItem, orderGoods) => {
  console.log('Order Item:', orderItem)
  console.log('Order Goods:', orderGoods)

  const handlePassClick = () => {
    console.log('Pass button clicked for orderId:', orderId)
  };

  const handleDenyClick = () => {
    console.log('Deny button clicked for orderId:', orderId)
    // 其他处理逻辑
  }

  const data = {
    formType: 'card',
    title: orderItem.store_name + ' [' + orderItem.code + ']',
    dataIndex: orderId,
    customClass: ['m-3'],
    extra: '',
    formList: [
      {
        formType: 'grid',
        customClass: ['ml-8', 'mb-4'],
        cols: [
          {
            span: 2,
            formList: [
              {
                formType: 'grid',
                colNumber: 2,
                cols: [
                  {
                    formList: [
                      {
                        title: '通过',
                        dataIndex: 'pass',
                        formType: 'button',
                        onClick: handlePassClick
                      },
                    ],
                  },
                  {
                    formList: [
                      {
                        title: '打回',
                        dataIndex: 'deny',
                        formType: 'button',
                        onClick: handleDenyClick
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        dataIndex: 'add-time-' + orderId,
        title: '录入时间',
        formType: 'input',
        defaultValue: orderItem.create_time,
        disabled: true,
        readonly: true,
      },
      {
        dataIndex: 'consignee-' + orderId,
        title: '收货地址',
        formType: 'select',
        data: warehouses,
        valueKey: 'id',
        defaultValue: orderItem.consignee_id,
        rules: [{ required: true, message: '请选择收货地址' }],

      },
      {
        title: '订单列表',
        dataIndex: 'order-' + orderId,
        formType: 'children-form',
        type: 'table',
        emptyRow: 1,
        hideLabel: true,
        // showBtn: false,
        dataList: orderGoods,
        formList: [
          {
            dataIndex: 'product_id',
            title: '产品名称',
            formType: 'select',
            placeholder: '请选择',
            data: productSelect,
            rules: [{ required: true, message: '请选择产品' }]
          },
          {
            dataIndex: 'associated_file',
            title: '文件名',
            formType: 'select',
            placeholder: '请选择',
            data: filesSelect,
            rules: [{ required: true, message: '请选择上传文件' }]
          },
          {
            dataIndex: 'product_grade',
            title: '产品级别',
            placeholder: '',
            defaultValue: '',
            disabled: true,
          },
          {
            dataIndex: 'product_picture_type',
            title: '画面类型',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'width',
            title: '宽度',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'height',
            title: '高度',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'count',
            title: '数量',
            placeholder: '请输入',
            rules: [{ required: true, message: '请输入' }]
          },
          {
            dataIndex: 'craft',
            title: '制作选项',
            formType: 'input',
            placeholder: '请选择',
          },
          {
            dataIndex: 'remark',
            title: '备注说明',
            placeholder: '请输入',
          },
          {
            dataIndex: 'pricing_type_id',
            title: '计价方式',
            placeholder: '',
            formType: 'select',
            data: pricingType,
            disabled: true,
          },
          {
            dataIndex: 'pricing_unit_id',
            title: '计量单位',
            placeholder: '',
            formType: 'select',
            data: pricingUnit,
            disabled: true,
          },
          {
            dataIndex: 'unit_price',
            title: '单价',
            placeholder: '',
            disabled: true,
          },
          {
            dataIndex: 'amount',
            title: '金额',
            placeholder: '',
            disabled: true,
          },
        ],
      }
    ],
  }
  return data
};
</script>