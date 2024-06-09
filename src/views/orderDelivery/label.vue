<template>
    <div ref="printArea">
        <table v-for="item in props.orders" :key="item.id" style="margin-bottom: 30px;">
            <tr>
                <td colspan="4" class="title">{{ item.orderLabelNo }}</td>
            </tr>
            <tr>
                <td>{{ item.client }}</td>
                <td>{{ item.store }}</td>
                <td>{{ item.storeArea }}</td>
                <td>{{ item.storePricing }}</td>
            </tr>
            <tr>
                <td colspan="4" style="height: 20px;"></td>
            </tr>
            <tr v-for="itemGoods in item.goods" :key="itemGoods.id">
                <td>{{ itemGoods.name }}</td>
                <td>{{ itemGoods.width }}</td>
                <td>{{ itemGoods.height }}</td>
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
    width: 100%;
    border-collapse: collapse;
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