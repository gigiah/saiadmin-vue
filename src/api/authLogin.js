import { request } from '@/utils/request.js'

/**
 * 登录授权码 API接口
 */
export default {
  
	/**
	 * 用户登录
	 * @param {object} params
	 * @returns
	 */
	login(params = {}) {
		return request({
			url: '/authLogin/login',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/authLogin/index',
			method: 'get',
			params,
		})
	},

	/**
	 * 回收站数据列表
	 * @returns
	 */
	getRecyclePageList(params = {}) {
		return request({
			url: '/authLogin/recycle',
			method: 'get',
			params,
		})
	},

	/**
	 * 添加数据
	 * @returns
	 */
	save(params = {}) {
		return request({
			url: '/authLogin/save',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 读取数据
	 * @returns
	 */
	read(id) {
		return request({
			url: '/authLogin/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/authLogin/destroy',
			method: 'delete',
			data,
		})
	},

	/**
	 * 恢复回收站数据
	 * @returns
	 */
	recovery(data) {
		return request({
			url: '/authLogin/recovery',
			method: 'post',
			data,
		})
	},

	/**
	 * 更新数据
	 * @returns
	 */
	update(id, data = {}) {
		return request({
			url: '/authLogin/update/' + id,
			method: 'put',
			data,
		})
	},

	/**
	 * 更改状态
	 * @returns
	 */
	changeStatus(data = {}) {
		return request({
			url: '/authLogin/changeStatus',
			method: 'post',
			data,
		})
	},
}
