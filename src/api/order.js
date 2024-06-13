import { request } from '@/utils/request.js'

/**
 * 订单 API接口
 */
export default {

  //树形数据
  orderTree (params = {}) {
    return request({
      url: '/order/orderTree',
      method: 'get',
      params
    })
  },

  //树形数据
  orderTree4Delivery (params = {}) {
    return request({
      url: '/order/orderTree4Delivery',
      method: 'get',
      params
    })
  },

  //树形数据
  orderTree4Print (params = {}) {
    return request({
      url: '/order/orderTree4Print',
      method: 'get',
      params
    })
  },

  /**
   * 数据列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/order/index',
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
      url: '/order/recycle',
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
      url: '/order/save',
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
      url: '/order/read/' + id,
      method: 'get'
    })
  },

  /**
	 * 真实删除数据
	 * @returns
	 */
	realDestroy(data) {
		return request({
			url: '/order/realDestroy',
			method: 'delete',
			data,
		})
	},

  /**
   * 软删除数据
   * @returns
   */
  delete (data) {
    return request({
      url: '/order/destroy',
      method: 'delete',
      data
    })
  },

  /**
	 * 真实删除数据
	 * @returns
	 */
	handleDelete(data) {
		return request({
			url: '/order/handleDelete',
			method: 'post',
			data,
		})
	},

  /**
   * 恢复回收站数据
   * @returns
   */
  recovery (data) {
    return request({
      url: '/order/recovery',
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
      url: '/order/update/' + id,
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
      url: '/order/changeStatus',
      method: 'post',
      data
    })
  },

  /**
   * 根据parentId获得原ID
   * @returns
   */
  getByParentId (params = {}) {
    return request({
      url: '/order/getByParentId',
      method: 'get',
      params,
    })
  },

  /**
   * 处理订单变更
   * @returns
   */
  handleOrderChange(data = {}) {
    return request({
      url: '/order/handleOrderChange',
      method: 'post',
      data
    })
  },

  /**
   * 提交订单
   * @returns
   */
  handleCreateOrder(data = {}) {
    return request({
      url: '/order/handleCreateOrder',
      method: 'post',
      data
    })
  },

  /**
	 * 更改状态
	 * @returns
	 */
	changeDeliveryStatus(data = {}) {
		return request({
			url: '/order/changeDeliveryStatus',
			method: 'post',
			data,
		})
	},

  /**
	 * 批量发货
	 * @returns
	 */
	handleDeliveryBatch(data) {
		return request({
			url: '/order/handleDeliveryBatch',
			method: 'post',
			data,
		})
	},


}