const app = getApp()

Page({
  data: {
    // 用于分页的属性
    totalPage: 1,
    page:1,
    videoList:[],
    follow:'',

    screenWidth: 350,

    searchContent: ""
  },

  onLoad: function (params) {
    const me = this;
    
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

    me.getVideos();
  },

  getVideos: function () {
    const me = this;
    const serverUrl = app.serverUrl;
    wx.showLoading({
      title: '加载中',
    });

    var videoList = me.data.videoList;
    var uid = app.OpenId;
    //console.log("index page app : ");
    //console.log(app);
    var sinceVideoId;
    if (videoList.length == 0){
      sinceVideoId = '0';
    }else{
      var lastVideo = videoList[videoList.length - 1];
      sinceVideoId = lastVideo.ID;
    }

    //console.log(sinceVideoId);
    
    wx.request({
      method : "GET", 
      url: serverUrl + '/getVideos',
      data : {
        uid : uid,
        sinceVideoId : sinceVideoId,
        num : 5
      },
      success : (res) => {
        //隐藏加载中gif
        wx.hideLoading();
        //console.log(res.data);
        
        me.setData({
          videoList : videoList.concat(res.data)
        });
      }
    });
  },

  getMyFollowList:function (page) {
    var me = this;
    var userId = app.getGlobalUserInfo().id
    console.log("getMyFollowList  userid ", userId)
    console.log("getMyFollowList  page " ,page)
    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyFollow/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log(userId + "<===getMyVideoList===>" + res.data);
        var followVideoList = res.data.data.rows;

        var newVideoList = me.data.videoList;
        me.setData({
          page: page,
          videoList: newVideoList.concat(followVideoList),
          totalPage: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
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
    me.getVideos();
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
