var Hogan = require('hogan.js');

var conf = {
	severHost : ''
};

var _mm = {
	// 网络请求
	request : function(param){
		var _this = this;

		$.ajax({
			type : param.method || 'get',
			url : param.url || '',
			// dataType规定预计的服务器响应的数据类型。
			dataType : param.type || 'json',
			// 规定连同请求发送到服务器的数据。
			data : param.data || '',
			// 规定当请求成功时运行的函数。
			success : function(res){
				// 请求成功
				if(0 === res.status){
					typeof param.success === 'function' && param.success(res.data , res.msg);
				}
				// 没有登录状态需要强制登录
				else if(10 === res.status){
					 _this.doLogin();
				}
				// 请求数据错误
				else if(1 === res.status){
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			// 请求错误比如404,503
			error : function(err){
				typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},
	// 获取后端接口地址
	getServerUrl : function(path){
		return conf.severHost + path;
	},
	// 获取url参数
	// http://www.happymmall.com/detail.html?productId=32使用正则匹配问号后面的url路径
	// 比如product=32，那么为product，value为32
	getUrlParam : function(name){
		var reg = new RegExp('(^|&)' + name +'=([^&]*)(&|$)');
		// search设置或返回从问号 (?) 开始的 URL（查询部分）。
		var result = window.location.search.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]) : null;
	},
	// 渲染html模板(数据绑定，插值表达式等)
	renderHtml : function(htmlTemplate,data){
		var template = Hogan.compile(htmlTemplate),
		      result = template.render (data);
		return  result;
	},
	// 成功提示
	successTips : function(msg){
		alert(msg || '操作成功');
	},
	// 错误提示
	errorTips : function(msg){
		alert(msg || '哪里不对了');
	},
	// 字段校验，支持非空，手机，邮箱的判断
	validate : function(value,type){
		// $.trim() 函数用于去除字符串两端的空白字符。
		var value = $.trim(value);
		// 非空验证
		if('require' === type){
			// value强制转换为boolean类型
			// 由于对null与undefined用!操作符时都会产生true的结果，
			// 所以用两个感叹号的作用就在于，会得到与原值相同的Boolean型结果
			return !!value;
		}
		// 手机号验证
		if('phone' === type){
			return /^1\d{10}$/.test(value);
		}
		// 邮箱格式验证
		if('email' === type){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
	},
	// 统一登录处理
	doLogin : function(){
		window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	goHome : function(){
		window.location.href = './index.html';
	}
};

module.exports = _mm;