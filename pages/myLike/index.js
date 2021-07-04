const app = getApp()

Page({
  data: {
    videoList:[],

    screenWidth: 350,

    userId : "oEn2F4k7H8npoA2LjydjhCE7UUsY",

    getNum : 0
  },

  onLoad: function (params) {
    const me = this;

    wx.setNavigationBarTitle({
      title: '我喜欢的视频',
    })
    
    const screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });

    //获取用户id，若没有，则跳转到登录界面
    try {
      var openId = wx.getStorageSync('OpenId')
      //console.log("openId : " + openId);
      if (openId == "") {
        wx.navigateTo({
          url: '../login/login',
        })
      }else{
        app.OpenId = openId;
      }
    } catch (e) {
      console.log(e);
    }

    //console.log("app.openId : " + openId);

    me.getMyLikeVideos();
  },

  getMyLikeVideos: function () {
    const me = this;
    const serverUrl = app.serverUrl;
    wx.showLoading({
      title: '加载中',
    });

    var videoList = me.data.videoList;
    var uid = app.OpenId;
    //console.log("index page app : ");
    //console.log(app);
  

    //console.log(sinceVideoId);
    
    wx.request({
      method : "GET", 
      url: serverUrl + '/getMyLikeVideos',
      data : {
        uid : uid,
        offset : me.data.getNum,
      },
      success : (res) => {
        //隐藏加载中gif
        wx.hideLoading();
        //console.log(res.data);
        if(res.data.length == 0){
          wx.showToast({
            title: '没有更多视频了',
            icon: 'none',
            duration: 2000
          })
        }else{
          me.setData({
            videoList : videoList.concat(res.data),
            getNum : me.data.getNum + res.data.length,
          });
        }
       
      }
    });
  },


  onPullDownRefresh: function() {
    wx.showLoading({
      title: '已经到达第一个视频',
    });

    //2秒后隐藏加载中gif
    setTimeout(() => {
      wx.hideLoading();
    }, 2000);
  },

  onReachBottom:function() {
    var me = this;
    me.getMyLikeVideos();
  },

  showVideoInfo: function(e) {
    const me = this;
    //console.log(e)
    var videoList = me.data.videoList;
    //获取传入的arrindex
    var arrindex = e.target.dataset.arrindex;
    //对象转为string
    var videoInfo = JSON.stringify(videoList[arrindex]);
    
    wx.navigateTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo,
    })
  },

  formatUrl: function (redirectUrl) {

    if (redirectUrl != undefined && redirectUrl != null && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/\?/g, "#");
      redirectUrl = redirectUrl.replace(/=/g, "@");
      redirectUrl = redirectUrl.replace(/&/g, "*");

      return redirectUrl;
    }
  },

})
