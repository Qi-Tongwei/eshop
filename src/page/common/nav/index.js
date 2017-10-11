require('./index.css');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var _cart = require('service/cart-service.js');
// 导航
var nav = {
	init : function(){
		this.bindEvent();
		this.loadUserInfo();
		this.loadCartCount();
		// 在链式调用中能够支持链式操作就是因为返回了this，this指向其调用者，
		// 这里的调用者就是nav，nav调用了init，返回值又把nav返回去模块输出时还是没变化
		return this;
	},
	bindEvent : function(){
		// 登录点击事件
		$('.js-login').click(function(){
			_mm.doLogin();
		});
		// 注册点击事件
		$('.js-register').click(function(){
			window.location.href = './register.html';
		});
		// 退出点击事件
		$('.js-logout').click(function(){
			_user.logout(function(res){
				window.location.reload();
			},function(errMsg){
				_mm.errorTips(errMsg);
			});
		});
	},
	// 加载用户信息
	loadUserInfo : function(){
		_user.checkLogin(function(res){
			// 有登录状态时把模板上登录元素隐藏
			$('.user.not-login').hide().siblings('.user.login').show()
				.find('.username').text(res.username);
		},function(errMsg){
			// donothing
		});
	},
	// 加载购物车数量
	loadCartCount : function(){
		_cart.getCartCount(function(res){
			$('.nav .cart-count').text(res || 0);
		},function(errMsg){
			$('.nav .cart-count').text(0);
		});
	},
};

// 如果在其他模块中，要调用被引入模块的内部方法则需要将被引入的模块暴露出去
// 如果不需要调用被引用模块的内部方法，则直接使用require引用让被引用的模块自我执行就可以了
// 此时被引用的模块不需要被暴露出去
// 举例common下的header模块与nav模块在cart模块中的引用
module.exports = nav.init();