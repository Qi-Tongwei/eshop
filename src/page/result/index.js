require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

// 当文档载入完毕就执行
$(function(){
	var type = _mm.getUrlParam('type') || 'default',
	      // 创建一个jq对象要加$符号
	      // 等号右边不用加双引号，里面是个表达式，最后运算的结果就是字符串了
	      $element = $('.' + type + '-success');
	if(type === 'payment'){
		var orderNumber = _mm.getUrlParam('orderNumber');
		// 读取并写入了href用了两次元素，所以将其缓存
		var $orderNumber = $element.find('.order-number');
		$orderNumber.attr('href',$orderNumber.attr('href') + orderNumber);
	}
	// 显示对应的提示元素
	$element.show();
})