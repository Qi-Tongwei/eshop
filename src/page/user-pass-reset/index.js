require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
//表单里的错误提示
var formError = {
	show : function(errMsg){
		$('.error-item').show().find('.err-msg').text(errMsg);
	},
	hide : function(){
		$('.error-item').hide().find('.err-msg').text('');
	}
};
// page 逻辑部分
var page = {
	data : {
		username : '',
		question : '',
		answer : '',
		token : '',
	},
	init : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		this.loadStepUsername();
	},
	bindEvent : function(){
		var _this = this;
		// 验证username
		$('#username').blur(function(){
			// 注意$(this)与this的不同，$(this)指向当前jq的引用，this指代js的dom引用
			var username = $.trim($(this).val());
			// 若用户名为空则不做验证
			if(!username){
				return;
			}
			// 异步验证用户名是否存在
			_user.checkUsername(username, function(res){
				formError.hide();
			},function(errMsg){
				formError.show(errMsg);
			});
		});
		// 输入用户名下一步的按钮点击
		$('#submit-username').click(function(){
			var username = $.trim($('#username').val());
			// 用户名存在
			if(username){
				_user.getQuestion(username,function(res){
					_this.data.username = username;
					_this.data.question= res;
					_this.loadStepQuestion();
				},function(){
					formError.show(errMsg);	
				});
			}
			// 用户名不存在
			else{
				formError.show('请输入用户名')
			}
		});
		// 输入密码提示问题答案的按钮点击
		$('#submit-question').click(function(){
			var answer = $.trim($('#answer').val());
			// 用户名存在
			if(answer){
				// 检查密码提示问题答案
				_user.checkAnswer({
					username : _this.data.username,
					question : _this.data.question,
					answer : answer
				},function(res){
					_this.data.answer = answer;
					_this.data.token= res;
					_this.loadStepPassword();
				},function(){
					formError.show(errMsg);	
				});
			}
			// 未输入密码提示问题答案
			else{
				formError.show('请输入密码提示问题的答案')
			}
		});
		// 输入新密码的按钮点击
		$('#submit-password').click(function(){
			var password = $.trim($('#password').val());
			// 密码是否为空
			if(password && password.length >= 6){
				// 检查密码提示问题答案
				_user.resetPassord({
					username : _this.data.username,
					passwordNew :password,
					forgetToken : _this.data.token
				},function(res){
					window.location.href = './result.html?type=pass-reset';
				},function(){
					formError.show(errMsg);	
				});
			}
			// 密码为空
			else{
				formError.show('请输入不少于6位数的新密码')
			}
		});
	},
	// 加载输入用户名的一步
	loadStepUsername : function(){
		$('.step-username').show();
	},
	// 加载输入密码提示问题的一步
	loadStepQuestion : function(){
		// 清除错误提示
		formError.hide();
		$('.step-username').hide()
		.siblings('.step-question').show()
		.find('.question').text(this.data.question);
	},
	// 加载输入password的一步
	loadStepPassword : function(){
		// 清除错误提示
		formError.hide();
		$('.step-question').hide()
		.siblings('.step-question').show();
	}
	
};
$(function(){
	page.init();
});