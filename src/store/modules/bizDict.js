import { defineStore } from 'pinia'
import {request} from "@/utils/request";

const useBizDictStore = defineStore('bizDict', {
    state: () => ({}),
    actions: {
        flushDict(...dictName) {
            dictName.forEach(name => {
                this.fetchDict(name);
            })
        },
        fetchDict(name) {
            request({
                url: `${name}/index?type=all`,
                method: 'get'
            }).then(resp => {
                if (resp.code === 200) {
                    const data = resp.data.map(item => {
                        return { label: item.name, value: item.id }
                    });
                    this.$patch({
                        [name]: data,
                    })
                } else {
                    console.log(`fetch ${name} dict failed`);
                }
            });
        },
        fetchPricingProduct4Search(range = '', role = '') {
            request({
                url: `/pricingProduct/index4Search?range=${range}&role=${role}`,
                method: 'get'
            }).then(resp => {
                if (resp.code === 200) {
                    const data = resp.data.map(item => {
                        return { label: item.name, value: item.product_id }
                    })
                    this.$patch({
                        pricingProduct4Search: data
                    })
                } else {
                    console.error(`fetch pricingProduct4Search dict failed`);
                }
            });
        },
        fetchPricingCraft4Search(product_id = '', range = '') {
            request({
                url: `/pricingCraft/index4Search?range=${range}&product_id=${product_id}`,
                method: 'get'
            }).then(resp => {
                if (resp.code === 200) {
                    const data = resp.data.map(item => {
                        return { label: item.name, value: item.craft_id }
                    })
                    if (product_id) {
                        this.$patch({
                            [product_id + '_pricingCraft4Search']: data
                        })
                    }
                    this.$patch({
                        pricingCraft4Search: data
                    })
                    console.log(this.$state)
                } else {
                    console.error(`fetch pricingCraft4Search dict failed`);
                }
            });

        }
    }
})

export default useBizDictStore;