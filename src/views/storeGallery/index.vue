<template>
  <div class="justify-between p-4 ma-content-block lg:flex">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini">
            <a-link @click="viewItems(record)"><icon-menu /> 查看内容</a-link>
        </a-space>
      </template>
    </ma-crud>
    <store-gallery-item ref="itemRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/storeGallery'
  import storeGalleryItem from '@/views/storeGalleryItem/index.vue'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const itemRef = ref()

  const viewItems = (record) => {
    itemRef.value.open(record)
  }

  const crud = reactive({
    api: api.getPageList,
    recycleApi: api.getRecyclePageList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 160,
    add: { show: true, api: api.save, auth: ['/storeGallery/save'] },
    edit: { show: true, api: api.update, auth: ['/storeGallery/update'] },
    delete: { show: true, api: api.delete, auth: ['/storeGallery/destroy'] },
    recovery: { show: true, api: api.recovery, auth: ['/storeGallery/recovery']},
    formOption: { width: 800 },
  })

  const columns = reactive([
    {
      title: '主键',
      dataIndex: 'id',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: true, message: '主键必填' }],
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'input',
      commonRules: [{ required: true, message: '名称必填' }],
    },
    {
      title: '营销区域',
      dataIndex: 'area_type_id',
      width: 100,
      search: true,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      dict: { url: '/storeAreaType/index?type=all', props: { label: 'name', value: 'id' }, translation: true },
      formType: 'select',
      commonRules: [{ required: true, message: '营销区域必填' }],
    },
    {
      title: '相册封面',
      dataIndex: 'cover_url',
      width: 180,
      search: false,
      addDisplay: true, 
      editDisplay: true,
      hide: false,
      formType: 'upload',
      type: 'image',
      returnType: 'url',
      multiple: false,
      commonRules: [{ required: false, message: '相册封面必填' }],
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '备注必填' }],
    },
    {
      title: '创建者',
      dataIndex: 'created_by',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '创建者必填' }],
    },
    {
      title: '更新者',
      dataIndex: 'updated_by',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      formType: 'input',
      commonRules: [{ required: false, message: '更新者必填' }],
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 180,
      search: true,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      searchFormType: 'range',
      showTime: true,
      formType: 'date',
      commonRules: [{ required: false, message: '创建时间必填' }],
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      width: 180,
      search: false,
      addDisplay: false, 
      editDisplay: false,
      hide: true,
      searchFormType: 'range',
      showTime: true,
      formType: 'date',
      commonRules: [{ required: false, message: '修改时间必填' }],
    },
  ])
</script>
