// pages/comment/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '',
    rate: 5,
    images: [],
    fileIDs: [],
    movieid: -1
  },
  uploadImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },
  submitComment(event) {
    wx.showLoading({
      title: '评论中',
    })
    const promiseArr = []
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((resolve, reject) => {
        const item = this.data.images[i]
        const suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: item,
        }).then(res => {
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          resolve()
        }).catch((e) => {
          reject(e)
        })
      }))
    }
    Promise.all(promiseArr).then(() => {
      db.collection('comment').add({
        data: {
          content: this.data.content,
          rate: this.data.rate,
          movieid: this.data.movieid,
          fileIDs: this.data.fileIDs
        }
      }).then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '评价成功',
        })
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '评价失败',
        })
      })
    }).catch(e => console.log(e))
  },
  onCommentChange(event) {
    this.setData({
      content: event.detail
    })
  },
  onRateChange(event) {
    this.setData({
      rate: event.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieid: options.movieid
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      this.setData({
        detail: JSON.parse(res.result)
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})