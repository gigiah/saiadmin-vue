import { request } from '@/utils/request.js'

/**
 * 订单导入任务 API接口
 */
export default {

  /**
   * 数据列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/orderImportTask/index',
      method: 'get',
      params
    })
  },

  /**
   * 回收站数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/orderImportTask/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save (params = {}) {
    return request({
      url: '/orderImportTask/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read (id) {
    return request({
      url: '/orderImportTask/read/' + id,
      method: 'get'
    })
  },

  /**
   * 软删除数据
   * @returns
   */
  delete (data) {
    return request({
      url: '/orderImportTask/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复回收站数据
   * @returns
   */
  recovery (data) {
    return request({
      url: '/orderImportTask/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: '/orderImportTask/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/orderImportTask/changeStatus',
      method: 'post',
      data
    })
  },

}