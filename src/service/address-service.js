var _mm = require('util/mm.js');

var _address= {
	// 获取收件人信息列表
	getAddressList : function(resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/shipping/list.do'), 
			data : {
				pageSize: 50,
			},
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 新建收件人地址
	save : function(addressInfo, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/shipping/add.do'), 
			data : addressInfo,
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 更新收件人信息
	update : function(addressInfo, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/shipping/update.do'), 
			data : addressInfo,
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 
	deleteAddress : function(shippingId, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/shipping/del.do'), 
			data : {
				shippingId : shippingId
			},
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
	// 获取单条收件人信息
	getAddress : function(shippingId, resolve, reject){
		_mm.request({
			url : _mm.getServerUrl('/shipping/select.do'), 
			data : {
				shippingId : shippingId
			},
			method : 'POST',
			success : resolve,
			error : reject
		});
	},
};

module.exports = _address;