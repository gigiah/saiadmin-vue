import { request } from '@/utils/request.js'

/**
 * 客户销售类型 API接口
 */
export default {

  /**
   * 数据列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/clientSalesType/index',
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
      url: '/clientSalesType/recycle',
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
      url: '/clientSalesType/save',
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
      url: '/clientSalesType/read/' + id,
      method: 'get'
    })
  },

  /**
   * 软删除数据
   * @returns
   */
  delete (data) {
    return request({
      url: '/clientSalesType/destroy',
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
      url: '/clientSalesType/recovery',
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
      url: '/clientSalesType/update/' + id,
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
      url: '/clientSalesType/changeStatus',
      method: 'post',
      data
    })
  },

}