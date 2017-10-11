var _mm = require('util/mm.js');
var _cities = require('util/cities/index.js');
var _address = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {
	show : function(option){
		// option的绑定
		this.option = option;
		this.option.data = option.data || {};
		// modal-wrap会用到多次，先缓存
		this.$modalWrap = $('.modal-wrap');
		// 渲染页面
		this.loadModal();
		// 绑定事件
		this.bindEvent();
	},
	bindEvent : function(){
		var _this = this;
		// 省份和城市的二级联动
		// 当元素的值发生改变时，会发生 change 事件
		// 该事件仅适用于文本域（text field），以及 textarea 和 select 元素
		this.$modalWrap.find('#receiver-province').change(function(){
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		});
		// 提交收货地址
		this.$modalWrap.find('.address-btn').click(function(){
			var receiverInfo = _this.getReceiverInfo(),
			      isUpdate = _this.option.isUpdate;
			// 使用新地址，并且验证通过
			if(!isUpdate && receiverInfo.status){
				_address.save(receiverInfo.data,function(res){
					_mm.successTips('地址添加成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function' 
						&& _this.option.onSuccess(res);
				},function(errMsg){
					_mm.errorTips(errMsg);
				});
			}
			// 更新收件人地址，并且验证通过
			else if(isUpdate && receiverInfo.status){
				_address.update(receiverInfo.data,function(res){
					_mm.successTips('地址修改成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function' 
						&& _this.option.onSuccess(res);
				},function(errMsg){
					_mm.errorTips(errMsg);
				});
			}
			// 验证不通过
			else{
				_mm.errorTips(receiverInfo.errMsg || '好像哪里不对了~');
			}
		});
		// 阻止事件冒泡(点击X的时候，父级元素创建地址的整个div会接收到点击事件，影响体验)
		this.$modalWrap.find('.modal-container').click(function(e){
			// 终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。
			// 调用该方法后，该节点上处理该事件的处理程序将被调用，
			// 事件不再被分派到其他节点。
			e.stopPropagation();
		});
		// 点击X号或者蒙板区域，关闭弹窗
		this.$modalWrap.find('.close').click(function(){
			_this.hide();
		});
	},
	loadModal : function(){
		var addressModalHtml = _mm.renderHtml(templateAddressModal,{
			isUpdate : this.option.isUpdate,
			data : this.option.data
		});
		this.$modalWrap.html(addressModalHtml);
		// 加载省份
		this.loadProvince();
	},
	// 加载省份信息
	loadProvince : function(){
		var provinces = _cities.getProvinces() || [],
		      $provinceSelect = this.$modalWrap.find('#receiver-province');
		$provinceSelect.html(this.getSelectOption(provinces));
		// 如果更新地址并且有省份信息，做省份的回填
		if(this.option.isUpdate && this.option.data.receiverProvince){
			$provinceSelect.val(this.option.data.receiverProvince);
			this.loadCities(this.option.data.receiverProvince);
		}
	},
	// 加载城市信息
	loadCities : function(provinceName){
		var cities = _cities.getCities(provinceName) || [],
		      $citySelect = this.$modalWrap.find('#receiver-city');
		$citySelect.html(this.getSelectOption(cities));
		// 如果更新地址并且有城市信息，做城市的回填
		if(this.option.isUpdate && this.option.data.receiverCity){
			$citySelect.val(this.option.data.receiverCity);
		}
	},
	// 获取表单里收件人信息，并做表单的验证
	getReceiverInfo : function(){
		var receiverInfo = {},
		      result = {
		      	status : false
		      };
		receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
		receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
		receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
		receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
		receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
		receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

		if(this.option.isUpdate){
			receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
		}
		// 表单验证
		if(!receiverInfo.receiverName){
			result.errMsg = '请输入收件人姓名';
		}
		else if(!receiverInfo.receiverProvince){
			result.errMsg = '请选择收件人所在省份';
		}
		else if(!receiverInfo.receiverCity){
			result.errMsg = '请选择收件人所在城市';
		}
		else if(!receiverInfo.receiverAddress){
			result.errMsg = '请输入收件人详细地址';
		}
		else if(!receiverInfo.receiverPhone){
			result.errMsg = '请输入收件人手机号';
		}
		// 所有验证都通过
		else{
			result.status = true;
			result.data = receiverInfo;
		}
		return result;
	},
	// 获取select框的选项，输入：array，输出：HTML
	getSelectOption : function(optionArray){
		var html = '<option value="">请选择</option>';
		// 不使用 i < optionArray.length;而是将optionArray.length存入length
		// 因为如下所示的写法只取了一次optionArray.length就把它缓存住了
		// 每次做循环比较的时候，直接比较i和缓存的length而不会再次去数组里取值
		// 一个优化的小技巧
		for(var i = 0, length = optionArray.length; i < length; i++){
			html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>'
		}
		return html;
	},
	hide : function(){
		this.$modalWrap.empty();
	}
};

module.exports = addressModal;