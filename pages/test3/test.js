// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    host : "https://www.xiaoyxiao.cn",
    currentIndex: 0,
    lastVideoIndex : 0,
    last2current : 0,
    videos : [{},{},{}],
    _videoContexts : [],
    sinceId : "0",
    uid : "0",
    videoNum : 5,
    newVideos : [],
    upOrDown : 0, //0:down; 1:up
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    let url = this.data.host  + "/getStartVideos";
    wx.request({
      method : "GET", 
      url: url,
      timeout : 500,
      data : {
        uid : this.data.uid
      },
      success : (res) => {
      
        this.setData({
          videos : res.data,
        });
        this.createVideosContext();
        this.playCurrent(this.currentIndex);
      }
    });
  },

  createVideosContext: function() {
    for (let i = 0; i < 3; ++i) {
      let videoId = "video_"+i
      this.data._videoContexts[i] = wx.createVideoContext(videoId, this);
    };
    
   /*
    this.data._videoContexts = [
      wx.createVideoContext('video_0', this), 
      wx.createVideoContext('video_1', this), 
      wx.createVideoContext('video_2', this), 
      wx.createVideoContext('video_3', this), 
      wx.createVideoContext('video_4', this),
      wx.createVideoContext('video_5', this), 
      wx.createVideoContext('video_6', this), 
      wx.createVideoContext('video_7', this), 
      wx.createVideoContext('video_8', this), 
      wx.createVideoContext('video_9', this),
    ];
   */
  },

  playCurrent: function(current) {
    this.data._videoContexts.forEach(function (ctx, index) {
        index !== current ? ctx.pause() : ctx.play();
    });
  },

  finishVideoChange : function(e){
    //确定当前video的index以及前后video的index
    let curIndex = e.detail.current;
    let curVideo = this.data.videos[curIndex]
    let preIndex = 0;
    let nextIndex = 0;
    if (curIndex == 0){
      preIndex = 2;
      nextIndex = 1;
    }else if(curIndex == 1){
      preIndex = 0;
      nextIndex = 2;
    }else if(curIndex == 2){
      preIndex = 1;
      nextIndex = 0;
    }
    //确定是上滑还是下滑
    let upOrDown = 0; //0:up;1:down
    let preCurIndex = this.data.currentIndex;
    if ((curIndex - preCurIndex) == 1){
      upOrDown = 1;
    }else if((preCurIndex - curIndex) == 1){
      upOrDown = 0;
    }else if ((preCurIndex == 2) && (curIndex == 0)){
      upOrDown = 1;
    }else if((preCurIndex == 0) && (curIndex == 2)){
      upOrDown = 0;
    }


    this.data.currentIndex = curIndex;
    this.data.sinceId = curVideo.ID;
  
    this.playCurrent(curIndex);
    
    //加载下一个或者上一个
    if (upOrDown == 0){ //up
       this.getPreVideo(curVideo.ID, preIndex)
    }else { //down
       this.getNextVideo(curVideo.ID, nextIndex)
    }

  },

  getNextVideo : function(sinceVideoId,nextIndex) {
    let url = this.data.host  + "/getNextVideo";
    wx.request({
      method : "GET",
      url: url,
      data : {
        uid : this.data.uid,
        sinceVideoId : sinceVideoId,
      },
      success : (res) => {
        let key = "videos[" + nextIndex + "]"
        this.setData({
          [key] : res.data,
        })
      }
    });
  },

  getPreVideo : function(sinceVideoId,preIndex) {
    console.log('getPreVideo ' + sinceVideoId)
    let url = this.data.host  + "/getPreVideo";
    wx.request({
      method : "GET",
      url: url,
      data : {
        uid : this.data.uid,
        sinceVideoId : sinceVideoId,
      },
      success : (res) => {
        let key = "videos[" + preIndex + "]"
        console.log(res.data)
        this.setData({
          [key] : res.data,
        })
      }
    });
  },
  

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
