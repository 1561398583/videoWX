//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据<image 
      src=''></image>
   */
  data: {
    commentList: [],

    noMoreComment : false,
    inputValue : '',
    commentNum : 0,
    videoId : '4549895140939768',
    userId : '0',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getComments();
  },

  getComments : function(){
    let that = this;
    let serverUrl = app.serverUrl;
    if(that.data.noMoreComment == true){
      wx.showToast({
        title: '没有更多评论了',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      wx.showToast({
        title: '加载评论...',
        icon: 'loading',
        duration: 1000
      })
    }
    
    wx.request({
      method : 'GET',
      url: serverUrl + "/getLevel1Comments",
      data : {
        videoId : that.data.videoId,
        userId : that.data.userId,
        num : that.data.commentNum,
      },
      success(res) {
        console.log(res);
        let data = res.data;
        if(data.length < 10){
          that.data.noMoreComment = true;
        }
        for(let i = 0; i < data.length; i++){
          if(data[i].IsLike == true) {
            data[i].LikeImg = '/assets/image/like.png'
          }else{
            data[i].LikeImg = '/assets/image/unlike.png'
          }
        }
        //console.log('after');
        //console.log(data);
        that.data.commentList = that.data.commentList.concat(data);
        that.data.commentNum = that.data.commentNum + data.length;
        //更新视图层
        that.setData({
          commentList : that.data.commentList,
        });
      }
    });
  },

  commentLike: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let likeImg = this.data.commentList[index].LikeImg;
    let userId = app.OpenId;
    let commentId = this.data.commentList[index].ID;
    let url = '';
   
    /*
    修改likeImg\likeNum
    */
    //更改逻辑层数据
    if (likeImg == "/assets/image/like.png"){
      that.data.commentList[index].LikeImg = "/assets/image/unlike.png";
      that.data.commentList[index].LikeNum = that.data.commentList[index].LikeNum - 1;
      url = app.serverUrl + '/deleteUserLikeComment';
    }else{
      that.data.commentList[index].LikeImg = "/assets/image/like.png";
      that.data.commentList[index].LikeNum = that.data.commentList[index].LikeNum + 1;
      url = app.serverUrl + '/addUserLikeComment';
    }
    //将逻辑层数据赋值给视图层
    that.setData({
      commentList: that.data.commentList
    });

    //向服务器发送修改信息
    wx.request({
      method : 'GET',
      url: url,
      data : {
        userId : userId,
        commentId : commentId,
      },
      success(res) {

      }
    })

  },

  addComment : function(e){
    let that = this;
    let cont = e.detail.value;
    console.log(app.OpenId);
    wx.request({
      method : 'POST',
      url: app.serverUrl + "/addL1Comment", 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        videoId: that.data.videoId,
        uid: app.OpenId,
        content : cont
      },
      
      success (res) {
        console.log(res.data);
        let d = res.data;

        d.LikeImg = '/assets/image/unlike.png';
       
        that.data.commentList = that.data.commentList.concat(d);
        that.setData({
          commentList : that.data.commentList,
        });
      }
    })


    wx.showToast({
      title: '评论成功',
      icon: 'success',
      duration: 2000
    })
   
    //清空框中的值
    that.setData({
      inputValue : '',
    });
    
  },

  onScrollLoad: function(){
    let that = this;
    if (that.data.noMoreComment == true){
      wx.showToast({
        title: '没有更多评论了',
        icon: 'none',
        duration: 2000
      })
    }else{
      that.getComments();
    }
    }
  

})