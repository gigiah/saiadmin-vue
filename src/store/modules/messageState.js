import {defineStore} from 'pinia';


const useMessageStateStore = defineStore('messageState', {
    state: () => ({
        isShow: false,
    }),
    actions: {
        setIsShow(isShow) {
            this.isShow = isShow;
        },
    },
});

export default useMessageStateStore;