function decodeBase64(base64Str){
	var unicode= BASE64.decoder(base64Str)
	var str = '';
	for(var i = 0 , len =  unicode.length ; i < len ;++i){
		str += String.fromCharCode(unicode[i]);

	}
	return str;
}

function clone(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		var copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		var copy = [];
		for (var i = 0, len = obj.length; i < len; ++i) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		var copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

$(function(){

//克隆 深拷贝


function weixinSdkInit() {
    var appId = "wx61306031432c1789",
        getWeixinSdkAuthParamUrl = "http://agent.touzibaomu.net/h5/weixinSdkAuthParam/getJssdk.html",
		introducer = $.getUrlParam("introducer"),
		groupId = $.getUrlParam("groupId"),
        shareOptions = {
            shareTitle : "我在用大策略的VIP特权功能，轻松抓住牛股买卖点",
            shareImgUrl : "http://js.touzibaomu.com/images/vipCoupon/dcl-big-logo.png",
            shareDesc : "我在用大策略的VIP特权功能，轻松抓住牛股买卖点，现在和你分享此特权。",
			shareUrl : "http://agent.touzibaomu.net/H5Coupon/Index/index?introducer=" + introducer + "&groupId=" + groupId
        };

	$.ajax({
		type: "GET",
		url: getWeixinSdkAuthParamUrl,
		dataType: "jsonp",
		data: {
			appid: appId,
			url: location.href.split("#")[0]
		},
		cache: false,
		async: true,
		jsonp: "callback",
		jsonpCallback: "callback_" + new Date().getTime() + Math.floor(Math.random() * 1000),
		success: function(response) {
			if ("success" === response.status) {
				var data = response.data;

				initWeixinSdk($.extend(shareOptions, {
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature
				}));
			}
		}
	});
}

function initWeixinSdk(options){

	var shareOption = {
		title: options.shareTitle, // 分享标题
		desc: options.shareDesc, //分享描述
		link: options.shareUrl, // 分享链接,将当前登录用户转为puid,以便于发展下线
		imgUrl: options.shareImgUrl, // 分享图标

		// 用户确认分享后执行的回调函数
		success: function() {
		},
		cancel: function() {
			// 用户取消分享后执行的回调函数
		}
	}

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: options.appId, // 必填，公众号的唯一标识
        timestamp: options.timestamp, // 必填，生成签名的时间戳
        nonceStr: options.nonceStr, // 必填，生成签名的随机串
        signature: options.signature, // 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function() {
        var recommender = $.getUrlParam("recommender");

        //分享到朋友圈
        wx.onMenuShareTimeline(clone(shareOption));
        //分享给朋友
        wx.onMenuShareAppMessage(clone(shareOption));
        //分享到QQ
        wx.onMenuShareWeibo(clone(shareOption));
        //分享到腾讯微博
        wx.onMenuShareQQ(clone(shareOption));
        //分享到QQ空间
        wx.onMenuShareQZone(clone(shareOption));

    });
    wx.showOptionMenu();
}

weixinSdkInit();

});



