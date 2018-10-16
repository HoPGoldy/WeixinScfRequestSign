const app = getApp()
var CryptoJS = require('../modules/encryption.js')
var wxPromisify = require('../modules/wxPromisify.js')

Page({
  // 请求SCF
  requestSCF: function () {
    // id及key
    var secretId = "your secretId here"
    var secretKey = "your secretKey here"
    // 函数名及参数
    var functionName = 'call function here'
    var param = {
      key1: 'str1',
      key2: 'str2'
    }

    var randomNum = 11886
    var requestUrl = 'scf.tencentcloudapi.com'
    
    // 此处应进行排序
    var data = {
      Action: 'Invoke',
      ClientContext: JSON.stringify(param),
      FunctionName: functionName,
      Nonce: randomNum,
      Region: 'ap-beijing',
      SecretId: secretId,
      Timestamp: Math.round(new Date().getTime() / 1000),
      Version: '2018-04-16'
    }

    var targetStr = this.getStrToSign('GET', requestUrl, data)
    data.Signature = this.signStr(secretKey, targetStr)
    // console.log(data.Signature)

    wxPromisify(wx.request)({
      url: 'https://' + requestUrl,
      data: data,
    })
    .then(res => {
      console.log(res)
    })

    // wx.request({
    //   url: 'https://' + requestUrl,
    //   data: data,
    //   complete: function(event) {
    //     console.log(event.data.Response)
    //   }      
    // })
  },

  // 拼接请求字符串
  getStrToSign: function (method, requestUrl, params) {
    var strHead = method + requestUrl + '/?'
    var queryStr = ''
    for (var key in params) {
      queryStr += key + '=' + params[key] + '&'
    }

    return strHead + queryStr.substr(0, queryStr.length - 1)
  },

  // 字符串签名
  signStr: function (key, targetStr) {
    var hmacStr = CryptoJS.HmacSHA1(CryptoJS.enc.Utf8.parse(targetStr), key);
    return CryptoJS.enc.Base64.stringify(hmacStr).toString()
  },
})
