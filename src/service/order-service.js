var _mm = require('util/mm.js');

var _order= {
	// 获取商品列表
	getProductList : function(resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/order/get_order_cart_product.do'),  // 后端接口地址
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	createOrder : function(orderInfo, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/order/create.do'),
			data : orderInfo,
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 获取订单列表
	getOrderList : function(listParam, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/order/list.do'),
			data : listParam,
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 获取订单详情
	getOrderDetail : function(orderNumber, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/order/detail.do'),
			data : {
				orderNo : orderNumber
			},
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 取消订单
	cancelOrder : function(orderNumber, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/order/cancel.do'),
			data : {
				orderNo : orderNumber
			},
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
};

module.exports = _order;