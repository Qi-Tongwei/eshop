require('./index.css');
var _mm = require('util/mm.js');

// 通用页面头部
var header= {
	init : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		var keyword = _mm.getUrlParam('keyword');
		// .val方法返回或设置被选元素的值。 keyword存在，则回填输入框
		if(keyword){
			$('#search-input').val(keyword);
		};
	},
	bindEvent : function(){
		var _this = this;
		// 点击搜索按钮后，做搜索提交
		$('#search-btn').click(function(){
			_this.searchSubmit();
		});
		// 输入回车后，做搜索提交
		$('#search-input').keyup(function(e){
			// keyCode获取按下的键盘按键Unicode值，13是回车键的keyCode
			if(e.keyCode === 13){
				_this.searchSubmit();
			}
		});
	},
	// 搜索的提交
	searchSubmit : function(){
		// 如果.val方法未设置参数，则返回被选元素的当前值。
		// .trim方法用于删除字符串开始和末尾的空格
		var keyword = $.trim($('#search-input').val());
		// 提交的时候有keyword正常跳转到list页面
		if(keyword){
			window.location.href = './list.html?keyword=' + keyword;
		}
		// 如果keyword为空返回首页
		else{
			_mm.goHome();
		}
	}
};

header.init();