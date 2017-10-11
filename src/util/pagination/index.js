require('./index.css');
var _mm = require('util/mm.js');
var templatePagination = require('./index.string');

var Pagination = function(){
	var _this = this;
	// 定义Pagination类的属性
	this.defaultOption = {
		container : null,
		pageNum : 1,
		// 页面左右浮动的范围
		pageRange : 3,
		onSelectPage : null
	}; 
	// 事件的处理
	$(document).on('click', '.pg-item', function(){
		var $this = $(this);
		//对于active和disabled按钮点击，不作处理
		if($this.hasClass('active') || $this.hasClass('disabled')){
			return;
		}
		typeof _this.option.onSelectPage === 'function'
			? _this.option.onSelectPage($this.data('value')) : null;
	});
}
// 渲染分页组件，prototype 属性使您有能力向对象添加属性和方法。
Pagination.prototype.render = function(userOption){
	// jQuery.extend() 函数用于将一个或多个对象的内容合并到目标对象。
	this.option = $.extend({}, this.defaultOption, userOption);
	// 判断容器是否为合法的JQ对象
	if(!(this.option.container instanceof jQuery)){
		return;
	}
	// 判断是否只有1页
	if(this.option.pages <= 1){
		return;
	}
	// 渲染分页内容
	this.option.container.html(this.getPaginationHtml());
};
// 获取分页的html，|上一页| 1 2 3  =4= 5 |下一页|  4/5 
Pagination.prototype.getPaginationHtml = function(){
	var html = '',
	      option = this.option,
	      pageArray = [],
	      start = option.pageNum - option.pageRange > 0
	      	? option.pageNum - option.pageRange : 1,
	      end = option.pageNum + option.pageRange < option.pages
	      	? option.pageNum + option.pageRange : option.pages;
	// 上一页按钮的数据
	pageArray.push({
		name : '上一页',
		value : this.option.prePage,
		disabled : !this.option.hasPreviousPage
	});
	// 数字按钮的处理
	for(var i = start; i <= end; i++){
		pageArray.push({
		name : i,
		value : i,
		active : (i === option.pageNum)
		});
	}
	// 下一页按钮的数据
	pageArray.push({
		name : '下一页',
		value : this.option.nextPage,
		disabled : !this.option.hasNextPage
	});
	html = _mm.renderHtml(templatePagination,{
		pageArray : pageArray,
		pageNum : option.pageNum,
		pages : option.pages
	});
	return html;
};

module.exports = Pagination;