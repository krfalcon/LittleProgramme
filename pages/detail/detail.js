Page({
  data: {
    detail: {},
    pageNo: 0,
    detailID: '',
  },
  onReady () {
    wx.setNavigationBarTitle({
      title: '详情页面'
    });
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      }
    });
  },
  onLoad (options) {
    this.loadList(options.id, false);
  },

  // 滚动加载更多
  onReachBottom () {
    this.loadList();
  },
  // 下拉加载更多
  // loadMore () {
  //   // this.loadList();
  // },

  // 从后台拿取数据
  loadList(id, more) {
    this.loading();

    var that = this;
    wx.request({
      url: 'https://sum.kdcer.com/Own/GetOne',
      data: {
        Id: id,
        pageNo: ++that.data.pageNo,
        pageSize: 5,
      },
      method: 'POST',
      success (res) {
        that.loading('close');

        var _data = res.data.CustomField;
        _data.Count = _data.BrandEventIds['Count'];

        // 商标数据
        var _brand = [];
        for(var i in _data.BrandEventIds) {
          if (i == 'Count') continue;
          _brand.push(_data.BrandEventIds[i]);
        }

        // 新的列表数据
        var _old = that.data.detail.BrandEventIds;
        _data.BrandEventIds = !more ? _brand : _old.concat(_brand);

        // 上传数据
        that.setData({
          detailID: id,
          pageNo: ++that.data.pageNo,
          detail: _data,
        });
      }
    });
  },

  // 加载中
  loading (close) {
    if (!close) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 50000,
      });
    } else {
      wx.hideToast();
    }
  },
})