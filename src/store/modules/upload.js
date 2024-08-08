import {defineStore} from "pinia";

let defaultConfig = [{

}]

const useUploadStore = defineStore('upload', {
    state: () => ({...defaultConfig}),
    getters: {
        appCurrentConfig(state) {
            return {...state}
        },
    },
    actions: {
        updateSettings(partial) {
            this.$patch(partial)
        },
    },
})
