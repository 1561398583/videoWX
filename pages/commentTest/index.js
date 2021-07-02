//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentList: [
      {UserName:"yx7", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100,  CreatedAt: "2021-07-01"},
      {UserName:"yx8", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
      {UserName:"yx9", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
      {UserName:"yx7", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100,  CreatedAt: "2021-07-01"},
      {UserName:"yx8", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
      {UserName:"yx9", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
      {UserName:"yx7", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100,  CreatedAt: "2021-07-01"},
      {UserName:"yx8", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
      {UserName:"yx9", Comment : "哈哈", likeImg:'/assets/image/like.png', likeNum:100, CreatedAt:"2021-07-01"},
    ],

    noMoreData : true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  commentLike: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let likeImg = this.data.commentList[index].likeImg;
   
    /*
    修改likeImg\likeNum
    */
    //更改逻辑层数据
    if (likeImg == "/assets/image/like.png"){
      that.data.commentList[index].likeImg = "/assets/image/unlike.png";
      that.data.commentList[index].likeNum = that.data.commentList[index].likeNum - 1;
    }else{
      that.data.commentList[index].likeImg = "/assets/image/like.png";
      that.data.commentList[index].likeNum = that.data.commentList[index].likeNum + 1;
    }
    //将逻辑层数据赋值给视图层
    that.setData({
      commentList: that.data.commentList
    });

    //向服务器发送修改信息

  },

  addComment : function(e){
    let cont = e.detail.value;
    console.log(app.OpenId);
    wx.request({
      method : 'POST',
      url: app.serverUrl + "/addL1Comment", 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        videoId: 'videoId1',
        uid: app.OpenId,
        content : cont
      },
      
      success (res) {
        console.log(res.data)
      }
    })
  },

  onScrollLoad: function(){
    console.log("到底了")
  }

})