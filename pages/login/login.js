//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false
    },

    onLoad: (params) => {
        let that = this;
        // 获取临时code
        // let redirectUrl = params.redirectUrl;
        //
        // if (redirectUrl) {
        //   redirectUrl = redirectUrl.replace(/#/g, "?");
        //   redirectUrl = redirectUrl.replace(/@/g, "=");
        //
        //   that.redirectUrl = redirectUrl;
        // }
      },

    bindGetUserInfo: function(e) {
        var that = this;
        var serverUrl = app.serverUrl;
         //用户按了允许授权按钮
        if (e.detail.userInfo) {
            // 获取到用户的信息了，打印到控制台上看下
            console.log("用户的信息如下：");
            console.log(e.detail.userInfo);
            var NickName = e.detail.userInfo.nickName;
            var FaceImgUrl = e.detail.userInfo.avatarUrl;
            //login
            wx.login({
                success: function(res) {
                    var code = res.code;
                    console.log(code);
                    wx.request({
                    method : "GET", 
                    url: serverUrl + '/login',
                    data : {
                        code : code,
                        NickName : e.detail.userInfo.nickName,
                        FaceImgUrl : e.detail.userInfo.avatarUrl,
                    },
                    success : (res) => {
                        var openId = res.data.OpenId;
                       
                        try {
                            wx.setStorageSync('OpenId', openId);
                          } catch (e) { 
                              console.log(e)
                          }
                        wx.redirectTo({
                          url: '../index/index',
                        });
                    }
                    });
                }
            });
           
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    }
})
