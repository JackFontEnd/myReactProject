var IndexModule =  React.createClass({
    init : function(){
        this.rootHost = "http://auth.touzibaomu.net/";
        this.getCouponUrl = "api/receiveCoupon";
        this.source = $.getUrlParam("source");
        this.introducer = this.introducer = $.getUrlParam("introducer")? $.getUrlParam("introducer"): "";
        this.groupId = $.getUrlParam("groupId");
        this.openId = $.getUrlParam("openid");
    },

    initPage: function() {
        var mobile = $.cookie("mobile_" + this.groupId);
        if(mobile) {
            $("#phone").val(mobile);
            $(".btn").trigger("click");
        }
    },

    bindEvent: function () {
        var that = this;
        $(".btn").delegate("", "click", function () {
            var phone = $("#phone").val().trim();
            if ($("#cb-input:checked").length) {
                if(phone.length) {
                    that._checkPhone(phone, that);
                } else {
                    $('.tel-error .text').text("请输入手机号");
                    $('.tel-error').show();
                }
            } else {
                $(".noCheck-error").show();
            }
        });

        $(document).delegate(".pop-btn", "click", function () {
            $('.tel-error').hide();
            $(".noCheck-error").hide();
        });

        //????ť
        $(".download_btn").delegate("","click", function () {
            var u = navigator.userAgent,
                isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios???
            if (isiOS) {
                location.href = "https://itunes.apple.com/us/app/tou-zi-bao-mu/id1095930933?l=zh&ls=1&mt=8";
            } else {
                location.href = "http://app.qq.com/#id=detail&appid=1105129569";
            }
        });

        //?˵?
        $(".manual").delegate("","click", function () {
            location.href = "manual.html?groupId="+ that.groupId + "&introducer=" + that.introducer;
        })
    },

    _checkPhone: function (value, that) {
        var mobile = value;

        if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
            $('.tel-error .text').text("手机号填写错误哦！");
            $('.tel-error').show();
            return false;
        } else {
            $.ajax({
                type: "get",
                url: that.rootHost + that.getCouponUrl,
                dataType: "json",
                cache: false,
                async: true,
                data:  {
                    mobile: mobile,
                    from: that.source,
                    group_id: that.groupId,
                    introducer: decodeBase64(that.introducer),
                    openid: that.openId
                },
                success: function (response) {
                    if ("success" === response.status) {
                        $.cookie("mobile_" + that.groupId, mobile);
                        location.href = "result.html?mobile=" + mobile + "&groupId=" + that.groupId + "&source=" + that.source;
                    } else {
                        //401.活动不存在或者已结束； 402.您已经参与过活动了
                        if(402 == response.data.errCode) {
                            $('.tel-error .text').text("您已经参与过活动了");
                            $('.tel-error').show();
                            setTimeout(function () {
                                $('.tel-error').hide();
                                location.href = "result.html?mobile=" + mobile + "&groupId=" + that.groupId + "&source=" + that.source + "&introducer=" + BASE64.encoder(mobile);
                            }, 1000);
                        } else if(401 == response.data.errCode ){
                            $('.tel-error .text').text(response.msg);
                            $('.tel-error').show();
                        } else{
                            $('.tel-error .text').text(response.msg);
                            $('.tel-error').show();
                        }
                    }
                }
            });
        }
    },
    _getRecommendGroupId: function () {
        var that = this;
        if (!that.groupId) {
            $.ajax({
                type: "get",
                url: "http://auth.touzibaomu.net/api/getRecommendActGroupId",
                cache: false,
                async: true,
                success: function (response) {
                    var groupId = "";
                    if ("success" === response.status) {
                        groupId = response.data.group_id
                    }
                    that.groupId = groupId;
                }
            })
        }
    },
    _isWeiXin: function () {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },

    render : function(){
        this.init();
        this._getRecommendGroupId();
        this.bindEvent();
        this.initPage();
        return null;
    }.bind(this)
});




$(function () {

});