require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm = require('util/mm.js');
var _product = require('service/product-service.js');
var Pagination = require('util/pagination/index.js');
var templateIndex = require('./index.string');

var page = {
	data : {
		listParam : {
			keyword : _mm.getUrlParam('keyword') || '',
			categoryId : _mm.getUrlParam('categoryId') || '',
			// 排序方法
			orderBy : _mm.getUrlParam('orderBy') || 'default',
			// 直接跳转到的页数
			pageNum : _mm.getUrlParam('pageNum') || 1,
			pageSize : _mm.getUrlParam('pageSize') || 10
		}
	},
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		this.loadList();
	},
	bindEvent : function(){
		var _this = this;
		$('.sort-item').click(function(){
			// $(this)会用到多次所以用一个变量将其缓存起来
			var $this = $(this);
			_this.data.listParam.pageNum = 1;
			// 点击默认排序
			if($this.data('type') === 'default'){
				// 已经是active样式
				if($this.hasClass('active')){
					return;
				}
				// 其他
				else{
					$this.addClass('active').siblings('.sort-item')
					// removeClass要去除多个类时可通过空格来增加类的数量
					        .removeClass('active asc desc');
					_this.data.listParam.orderBy = 'default';
				}
			}
			// 点击价格排序
			else if($this.data('type') === 'price'){
				// active类的处理
				$this.addClass('active').siblings('.sort-item')
					        .removeClass('active asc desc');
				// 升序，降序的处理
				if(!$this.hasClass('asc')){
					$this.addClass('asc').removeClass('desc');
					// =右边的'price_asc'写法是后台接口定义的写法
					_this.data.listParam.orderBy = 'price_asc';
				}else{
					$this.addClass('desc').removeClass('asc');
					// =右边的'price_desc'写法是后台接口定义的写法
					_this.data.listParam.orderBy = 'price_desc';
				}
			}
			// 重新加载列表
			_this.loadList();
		});
	},
	// 加载list数据
	loadList : function(){
		var _this = this,
		      listHtml = '',
		      listParam = this.data.listParam,
		      // 缓存jq对象$('.p-list-con')
		      $pListCon = $('.p-list-con');
		$pListCon.html('<div class="loading"></div>');
		// 删除参数中不必要的字段
		listParam.categoryId
			?  (delete listParam.keyword) :(delete listParam.categoryId);
		// 请求接口
		_product.getProductList(listParam,function(res){ 
			listHtml = _mm.renderHtml(templateIndex,{
				list : res.list
			});
			$('.p-list-con').html(listHtml);
			_this.loadPagination({
				// 请求后端接口成功后返回的字段
				hasPreviousPage : res.hasPreviousPage,
				prePage : res.prePage,
				hasNextPage : res.hasNextPage,
				nextPage : res.nextPage,
				pageNum : res.pageNum,
				pages : res.pages
			});
		},function(errMsg){
			_mm.errorTips(errMsg);
		});
	},
	// 加载分页信息
	loadPagination : function(pageInfo){
		var _this = this;
		this.pagination ? '' : (this.pagination = new Pagination());
		this.pagination.render($.extend({}, pageInfo, {
			container : $('.pagination'),
			onSelectPage : function(pageNum){
				_this.data.listParam.pageNum = pageNum;
				_this.loadList();
			}
		}));
	}
};
$(function(){
	page.init();
})