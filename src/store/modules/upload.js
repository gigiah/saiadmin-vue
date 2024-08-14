import {defineStore} from "pinia";
import {Message} from "@arco-design/web-vue";
import OSS from 'ali-oss';
import {request} from "@/utils/request";
import {useMessageStore} from "@/store";

const useUploadStore = defineStore('upload', {
    state: () => ({}),
    getters: {
        hasTask() {
            if (Object.keys(this.$state).length === 0) {
                return false;
            }
            for (let key in this.$state) {
                if (this.$state[key].status !== 'success' || this.$state[key].status === 'error') {
                    return true;
                }
            }
            return false;
        }
    },
    actions: {
        async createTask(form) {
            if (form.sourceFiles.length === 0) {
                Message.error('请上传源文件');
                return;
            }
            console.log('保存文件', form);
            const count = form.sourceFiles.length + form.previewImages.length + form.linkFiles.length;
            const messageId = new Date().getTime();
            this.$state[messageId] = {
                count,
                status: 'pending',
                current: 0,
                currentFileName: '',
            }
            const firstSourceFile = form.sourceFiles[0];
            try {
                this.$patch({
                    [messageId]: {
                        count,
                        status: 'uploading',
                        currentFileName: firstSourceFile.name,
                        current: 1,
                    }
                })
                const res = await createOssClient('source', [firstSourceFile]);
                const firstRes = res[0];
                await uploadFile(firstRes);
                let allRes = [];
                if (form.sourceFiles.length > 1) {
                    const otherFiles = form.sourceFiles.slice(1);
                    const otherRes = await createOssClient('source', otherFiles, firstRes.batchId);
                    allRes = [...otherRes];
                }
                const previewRes = await createOssClient('preview', form.previewImages, firstRes.batchId);
                const linkRes = await createOssClient('link', form.linkFiles, firstRes.batchId);
                allRes = [...allRes, ...previewRes, ...linkRes];
                // await uploadFileBatch(allRes);
                const allRequest = allRes.map((item) => uploadFile(item));
                allRequest.forEach(item => {
                    item.then(() => {
                        this.$patch({
                            [messageId]: {
                                count,
                                status: 'uploading',
                                current: this.$state[messageId].current + 1,
                                currentFileName: item.name,
                            }
                        })
                    })
                })
                await Promise.all(allRequest);
                this.$patch({
                    [messageId]: {
                        status: 'success',
                    }
                })
                Message.success("上传成功");
            } catch (error) {
                Message.error(error.message);
                console.error(error);
                this.$patch({
                    [messageId]: {
                        status: 'error',
                    }
                })
            }
        },
        removeTask(messageId) {
            this.$patch((state) => {
                delete state[messageId];
            })
        },

        startDebug() {
            const messageId = new Date().getTime();
            this.$patch({
                [messageId]: {
                    count: 1,
                    status: 'pending',
                    current: 0,
                    currentFileName: '',
                }
            });
            const timer = setInterval(() => {
                this.$patch({
                    [messageId]: {
                        count: 100,
                        status: 'uploading',
                        current: this.$state[messageId].current + 1,
                        currentFileName: 'debug',
                    }
                })
                if (this.$state[messageId].current === 100) {
                    clearInterval(timer);
                    this.$patch({
                        [messageId]: {
                            status: 'success',
                        }
                    })
                }
            }, 2000);
        }
    }
});

async function createOssClient(target, files, batchId = 0) {
    if (files.length === 0) {
        return [];
    }
    let requestFiles = files.map((file) => {
        return {
            fileName: file.name,
            fileSize: file.file?.size,
        }
    });
    let res = await request({
        url: '/upload/batchOssPreParams',
        method: 'post',
        data: {
            target,
            batchId,
            files: requestFiles,
        }
    });
    if (res.code !== 200) {
        throw new Error(res.message);
    }
    return res.data.files.map((file) => {
        let result = {
            batchId: res.data.batchId,
            target,
            requestId: file.requestId,
            path: file.path,
            exist: file.exist,
        }
        if (file.exist) {
            return result;
        }
        const originFile = files.find((item) => item.name === file.fileName);
        const client = new OSS({
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            endpoint: file.endpoint,
            stsToken: res.data.securityToken,
            bucket: file.bucket,
        });
        return {
            ...result,
            ossClient: client,
            name: file.fileName,
            originFile,
        }
    });
}

// async function uploadFileBatch(state) {
//     return Promise.all(state.map((item) => uploadFile(item)));
// }

async function uploadFile(state) {
    if (state.exist) {
        console.log('完成请求--已存在', state);
        await finishRequest(state.requestId);
        return true;
    }
    const options = {
        parallel: 4,
        partSize: 1024 * 1024,
        progress: (p, cpt, res) => {
            console.log('Progress: ', p);
        }
    }
    let res = await state.ossClient.multipartUpload(state.path, state.originFile.file, options);
    if (res.res.status !== 200) {
        throw new Error('上传失败');
    }
    console.log('上传成功', res);
    console.log('完成请求', state);
    await finishRequest(state.requestId);
    return true;
}

async function finishRequest(requestId) {
    let res = await request({
        url: '/upload/batchOssNotice',
        method: 'post',
        data: [requestId]
    });
    if (res.code !== 200) {
        throw new Error(res.message);
    }
    return true;
}

export default useUploadStore;