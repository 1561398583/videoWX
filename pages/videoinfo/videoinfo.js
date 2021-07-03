// 视频信息页
const app = getApp();


Page({
    data: {
        cover: "cover", // 对视频进行拉伸
        videoId: "", // 视频id
        videoTitle : "",
        src: "https://www.xiaoyxiao.cn/assets/videos/OyMknRIJlx07GiO1TGDS010412002mUw0E010.mp4", // 视频播放地址
        videoInfo: {}, // 视频信息

        isLike : false,

        likePic : "../../assets/image/unlike.png",

        likeNum : 0,

        userLikeVideo: false, // 用户视频喜欢该视频

        talksDisplay : 'none',

        isTalksInit : false,

        commentList: [],    // 评论列表

        noMoreComment : false,
        inputValue : '',
        commentNum : 0,
        getCommentNum : 0,
        videoId : '4549895140939768',
        userId : '0',
    },
    // 视频播放组件
    videoCtx: {},
    // 页面加载
    onLoad: function (params) {
        const that = this;

        // 创建视频播放组件
        that.videoCtx = wx.createVideoContext('myVideo', that);

        // 获取上一个页面传入的参数
        var videoInfo = JSON.parse(params.videoInfo);

        console.log(videoInfo);

        var likePicPath = '';

        if (videoInfo.IsLike == true) {
          likePicPath = '../../assets/image/like.png';
        }else{
          likePicPath = '../../assets/image/unlike.png';
        }

        //console.log("video page app : ");
        //console.log(app);

        that.setData({
            src: videoInfo.VideoUrl,
            isLike : videoInfo.IsLike,
            likeNum: videoInfo.LikeNum,
            commentNum : videoInfo.CommentNum,
            likePic : likePicPath,
            videoId : videoInfo.ID,
            videoTitle : videoInfo.VideoTitle,
            userId : app.OpenId,
        });

        //const serverUrl = app.serverUrl;
        // 获取全局用户信息
        //const userInfo = app.getGlobalUserInfo();

      
    },
    // 页面展示时
    onShow: function () {
        const that = this;
        // 启动视频播放
        that.videoCtx.play();
    },
    // 页面隐藏时
    onHide: function () {
        const that = this;
        // 暂停视频播放
        that.videoCtx.pause();
    },
   
    
    // 返回到首页
    showIndex: function () {
        wx.navigateBack({
          delta: 1,
        })
    },
    // 显示我的页面
    showMine: function () {
        // 获取全局用户信息
        const userInfo = app.getGlobalUserInfo();

        if (!userInfo) {
            // 未登录时跳转到登录页
            wx.navigateTo({
                url: '../userLogin/login'
            });
        } else {
            // 已登录时，跳转到我的页面
            wx.navigateTo({
                url: '../mine/mine'
            })
        }
    },
    // 是否给该视频点赞
    likeVideoOrNot: function () {
        const that = this;

        const videoId = that.data.videoId;
        //console.log('videoId : ' + videoId);
        // 获取全局用户信息
        const uid = app.OpenId;
        //console.log('uid : ' + uid)

        if (that.data.isLike == false) {
          that.setData({
            likePic : "../../assets/image/like.png",
            isLike : true,
            likeNum : that.data.likeNum + 1,
          })

          //更新服务器信息
          wx.request({
            method : 'GET',
            url: app.serverUrl + '/addLike?',
            data : {
              uid : uid,
              videoId : videoId,
            },
            success : (res) => {
              
            }
          })
        }else{
          that.setData({
            likePic : "../../assets/image/unlike.png",
            isLike : false,
            likeNum : that.data.likeNum - 1,
          })
           //更新服务器信息
           wx.request({
            method : 'GET',
            url: app.serverUrl + '/deleteLike?',
            data : {
              uid : uid,
              videoId : videoId,
            },
            success : (res) => {
              
            }
          })
        }

    },


    // 分享视频
    shareMe: function () {
        const that = this;

        // 获取全局用户信息
        const userInfo = app.getGlobalUserInfo();

        // 展示选项列表
        wx.showActionSheet({
            itemList: ['下载到本地', '举报用户', '分享到朋友圈', '分享到QQ空间', '分享到微博'],
            success(res) {
                console.log(res.tapIndex);

                // 用户点赞选项的下标
                const tapIndex = res.tapIndex;

                if (tapIndex === 0) {
                    // 下载
                    wx.showLoading({
                        title: '下载中…'
                    });

                    // 下载文件
                    wx.downloadFile({
                        url: app.serverUrl + that.data.videoInfo.videoPath,
                        success(res) {
                            // 只要服务器有数据响应，就会把响应内容写入文件，并进行success回调
                            if (res.statusCode === 200) {
                                console.log(res.tempFilePath);

                                // 保存视频到相册
                                wx.saveVideoToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success(errMsg) {
                                        console.log(errMsg);
                                        // 隐藏进度加载条
                                        wx.hideLoading();
                                    }
                                })
                            }
                        }
                    })
                } else if (tapIndex === 1) {
                    // 举报
                    const videoInfo = JSON.stringify(that.data.videoInfo);
                    const realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

                    if (!userInfo) {
                        // 未登录时跳转到登录页
                        wx.navigateTo({
                            url: '../userLogin/login?redirectUrl=' + realUrl
                        });
                    } else {
                        // 已登录时，传递参数，并跳转到举报页面

                        // 视频发布者id
                        const publishUserId = that.data.videoInfo.userId;
                        // 视频id
                        const videoId = that.data.videoInfo.id;

                        wx.navigateTo({
                            url: `../report/report?videoId=${videoId}&publishUserId=${publishUserId}`
                        })
                    }
                } else {
                    // 其他选项
                    wx.showToast({
                        title: '官方暂未开放…'
                    })
                }
            }
        })
    },
    // 分享App消息
    onShareAppMessage: function (res) {
        var that = this;
        var videoInfo = that.data.videoInfo;

        return {
            title: '短视频内容分析',
            path: "pages/videoinfo/videoinfo?videoInfo=" + JSON.stringify(videoInfo)
        }
    },
    

    /**
     *  评论部分
     */
    showTalks : function() {
        let that = this;
        that.setData({
            talksDisplay : "block"
        });
        if (that.data.isTalksInit == false) {
            that.getComments();
            that.data.isTalksInit = true;
        }
    },

    hideTalks : function(){
        this.setData({
            talksDisplay : "none"
        });
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
          wx.showLoading({
            title: '加载评论...',
          })
        }
        
        wx.request({
          method : 'GET',
          url: serverUrl + "/getLevel1Comments",
          data : {
            videoId : that.data.videoId,
            userId : that.data.userId,
            num : that.data.getCommentNum,
          },
          success(res) {
            wx.hideLoading();
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
            that.data.getCommentNum = that.data.getCommentNum + data.length;
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
      
});
