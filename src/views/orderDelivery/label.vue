<template>
    <div ref="printArea">
        <table v-for="item in props.orders" :key="item.id" style="margin-bottom: 30px;">
            <tr>
                <td colspan="5" class="title">{{ item.orderLabelNo }}</td>
            </tr>
            <tr>
                <td colspan="2">{{ item.client }}</td>
                <td>{{ item.store }}</td>
                <td>{{ item.storeArea }}</td>
                <td>{{ item.storePricing }}</td>
            </tr>
            <tr>
                <td colspan="5" style="height: 20px;"></td>
            </tr>
            <tr>
                <td>产品名称</td>
                <td>宽</td>
                <td>高</td>
                <td>数量</td>
                <td>制作选项</td>
            </tr>
            <tr v-for="itemGoods in item.goods" :key="itemGoods.id">
                <td>{{ itemGoods.name }}</td>
                <td>{{ itemGoods.width }}</td>
                <td>{{ itemGoods.height }}</td>
                <td>{{ itemGoods.nums }}</td>
                <td>{{ itemGoods.craftDesc }}</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    component: Object,
    orders: {
        type: Array,
        required: true,
    },
})
</script>

<style scoped>
/* 添加一些样式使打印内容更好看 */
table {
    /* width: 100%; */
    width: 335px;
    border-collapse: collapse;
    font-size: 10px;
}

.title {
    font-weight: bolder;
}

th,
td {
    border: 1px solid #000;
    padding: 2px;
    text-align: center;
}

th {
    background-color: #f2f2f2;
}
</style>