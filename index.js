const myTool = {
  // 判断是否为数字，类数字
  isNumber(val) {
    return parseFloat(val).toString() === "NaN";
  },
  // 手机号验证
  checkPhone(str) {
    return /^1[0-9]{10}$/.test(str);
  },
  // 电话验证
  tel(str) {
    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
  },
  // 首尾空格去除
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  // 替换所有空格
  trimAll(str) {
    return str.replace(/\s+/g, "");
  },
  // 获取url参数
  getQueryString(name) {
    let url = location.href.split("?")[1];
    let theRequest = {};
    if (url) {
      let strs = url.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(
          strs[i].split("=")[1]
        );
      }
    }
    return theRequest[name];
  },
  // 设置cookie
  setCookie(name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + "=" + value + ";expires=" + oDate + "; path=/";
  },
  // 获取cookie
  getCookie(name) {
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split("=");
      if (arr2[0] === name) {
        return arr2[1];
      }
    }
    return "";
  },
  // 删除cookie
  removeCookie(name) {
    this.setCookie(name, "", -1);
  },
  // 设置本地存储
  setItem(name, value) {
    localStorage.setItem(
      key,
      JSON.stringify({
        val: value,
        time: new Date().getTime(),
      })
    );
  },
  // 获取本地存储
  getItem(key, day) {
    let text = "";
    let val = localStorage.getItem(key);
    if (val) {
      let item = JSON.parse(val);
      if (
        !item.time ||
        new Date().getTime() - item.time > day * 24 * 60 * 60 * 1e3
      ) {
        localStorage.removeItem(key);
      } else {
        text = item.val;
      }
    }
    return text;
  },
  // 获取文本长度
  getStringLen: function (str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      str.charCodeAt(i) > 255 ? (len += 2) : (len += 1);
    }
    return len;
  },
  // 判断微信浏览器
  isWeiXin: /micromessenger/i.test(navigator.userAgent.toLowerCase()),
  isIos: /iphone|ipad/i.test(navigator.userAgent.toLowerCase()),
  isAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
  // 判断数据类型
  isObject(obj, type) {
    // obj instanceof Array
    // obj.constructor === Array
    // Array.isArray(obj)
    // undefined function boolean number string array object
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type
  },
  // 对象初始化
  setObject(obj, targets, type = "object") {
    targets.forEach(key => {
      obj[key] = this.isObject(obj[key], type) ? obj[key] : (type === "object" ? {} : []);
    });
  },
  // 深拷贝对象
  clone(obj) {
    if ("object" != typeof obj) return obj;
    var copy = obj instanceof Array ? [] : {};
    for (var attr in obj) {
      copy[attr] = clone(obj[attr]);
    }
    return copy;
  },
  // 时间戳转时间
  timeFormat(val, type) {
    // (1602315918, 'Y年M月D') -> '2020年10月10'
    const addNum = (num) => (num < 10 ? `0${num}` : num);
    let formateArr = ["Y", "M", "D", "h", "m", "s"];
    let list = [];

    let date = new Date(val * 1000);
    list.push(date.getFullYear());
    list.push(addNum(date.getMonth() + 1));
    list.push(addNum(date.getDate()));
    list.push(addNum(date.getHours()));
    list.push(addNum(date.getMinutes()));
    list.push(addNum(date.getSeconds()));

    for (let i in formateArr) {
      type = type.replace(formateArr[i], list[i]);
    }
    return type;
  },
  // 数组里字段拼接
  strConcat(arr) {
    // [{name: 'a'}, {name: ''}, {name: 'b'}] -> 'a,b'
    return arr.map((key) => key.name).join(","); // 方法1
    return arr.reduce((a, b) => (`${a.name || a}${b.name && a && ","}${b.name}`), ""); // 方法2
  },
  // 数组根据字段拼接重复的数据
  sameData(list, key) {
    // [{name: 'a', id:1}, {name: 'b', id: 2}, {name: 'a', id: 3}, {name: 'b', id: 4}, {name: 'c', id: 5}] ->
    // [{name: 'a', id:1, long: 'a1'}, {name: 'b', id: 2, long: 'b2'}, {name: 'a', id: 3, long: 'a3'}, {name: 'b', id: 4, long: 'b4'}, {name: 'c', id: 5, long: 'c'}]
    var res = list.reduce((json, next) => {
      json[next[key]] = json[next[key]] ? ++json[next[key]] : 1;
      return json;
    }, {});
    list.forEach((key) => {
      Object.keys(res).forEach((val) => {
        if (key.key === val) {
          key.long = res[val] > 1 ? key.key + key.id : key.key;
        }
      });
    });
    res = null;
    return list;
  },
  // 正则替换标签内的属性
  replaceAttr(str) {
    // element-ui-v1升级到v2,el-dialog 的 v-model 需要换成 :visible.sync
    /*
      let str = '<el-dialog title="在线客服" v-model="dialogVisible" ><a class="btn" @click="dialogVisible = false">确定</a></el-dialog>'
      console.log(str.replace(/\<el-dialog.*?>/gi, (val) => val.replace(/v\-model/, ':visible.sync')))
      // <el-dialog title="在线客服" :visible.sync="dialogVisible" ><a class="btn" @click="dialogVisible = false">确定</a></el-dialog
    */
    return str.replace(/\<el-dialog.*?>/gi, (val) => val.replace(/v\-model/, ':visible.sync'))
  },
  // json扁平化
  formatData = (...res) => {
    // var json = {name: 'xiaoming', child: {age: 22, child: {sex: 'boy'}}}
    // {name: 'xiaoming', age: 22, sex: 'boy'}
    let target = res[0]
    let result = res.length === 2 ? res[1] : {}
    for (let key in target) {
      if (typeof target[key] === "object") {
        formatData(target[key], result)
      } else {
        result[key] = target[key]
      }
    }
    return result
  },
  // 根据字段递归对象查找
  deepData(json, name) {
    if (this.isObject(json, 'object')) {
      Object.keys(json).forEach(key => {
        if (this.isObject(json[key], 'object')) {
          console.log(key)
          deepData(json[key], name)
        } else {
          if (key === name) {
            console.log(json, json[name])
          }
        }
      })
    }
  },
  // includes多个参数匹配
  includeMore(list, target) {
    // ['1a', 'ss', '3'].some(key => '11111222'.includes(key))
    return list.some(key => target.includes(key))
  },
  // 数组里最大的数字
  max(arr) {
    // 方法1
    return Math.max(...arr);
    // 方法2
    return Math.max.apply(Math, arr);
  },
  // 查找类名 html5属性classList
  hasClass(obj, className) {
    // let obj = document.querySelectorAll(obj)
    return obj.classList.contains(className);
  },
  // 添加类名
  addClass(obj, className) {
    obj.classList.add(className);
    return this;
  },
  // 删除类名
  removeClass(obj, className) {
    obj.classList.remove(className);
    return this;
  },
  // 数组去重
  unique(arr, val) {
    const res = new Map();
    return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
  }
};

// 不常用
const comFunction = {
  // 设置html的font-size
  setFontSize(_client) {
    // _client 设计稿的宽度
    let docEl = document.documentElement,
      resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize",
      countSize = function () {
        // 方法1
        let devieWidth = Math.min(
          _client,
          docEl.clientWidth,
          docEl.clientHeight
        );
        let fonSize = devieWidth > 1080 ? 144 : (devieWidth / _client) * 100;
        docEl.style.fontSize = fonSize + "px";

        // 方法2 根据vw ios兼容最低7 android兼容最低4.4
        docEl.style.fontSize = (100 / _client) * 100 + "vw";
      };
    window.addEventListener(resizeEvt, countSize, false);
    countSize();
  },
  // 动画
  animate(obj, josn, fn) {
    function css(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr];
      }
      return getComputedStyle(obj, false)[attr];
    }
    clearInterval(obj.iTimer);
    var iSpeed = 0;
    var iCur = 0;
    obj.iTimer = setInterval(function () {
      var iEnd = true;
      for (var attr in json) {
        iCur = parseInt(css(obj, attr));
        iSpeed = (json[attr] - iCur) / 8;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if (iCur !== json[attr]) {
          iEnd = false;
          obj.style[attr] = iSpeed + iCur + "px";
        }
        if (iEnd) {
          clearInterval(obj.iTimer);
          fn && fn.call(obj);
        }
      }
    }, 30);
  },
  // 拖拽移动
  drag(block) {
    var oW;
    var oH;
    var maxWidth = document.documentElement.clientWidth - block.offsetWidth;
    var maxHeight = document.documentElement.clientHeight - block.offsetHeight;
    block.addEventListener(
      "touchstart",
      function (e) {
        var touches = e.touches[0];
        oW = touches.clientX - block.offsetLeft;
        oH = touches.clientY - block.offsetTop;
        document.addEventListener("touchmove", defaultEvent, false);
      },
      false
    );

    block.addEventListener(
      "touchmove",
      function (e) {
        var touches = e.touches[0];
        var oLeft = touches.clientX - oW;
        var oTop = touches.clientY - oH;
        oLeft = oLeft < 0 ? 0 : oLeft;
        oLeft = oLeft > maxWidth ? maxWidth : oLeft;
        oTop = oTop < 0 ? 0 : oTop;
        oTop = oTop > maxHeight ? maxHeight : oTop;
        block.style.left = oLeft + "px";
        block.style.top = oTop + "px";
        e.preventDefault();
      },
      false
    );

    block.addEventListener(
      "touchend",
      function () {
        document.removeEventListener("touchmove", defaultEvent, false);
      },
      false
    );
  },
  // ajax封装
  ajax(opt) {
    /*
      opt：参数
      method: 请求方式
      url： 请求url
      data: 请求参数
      callback：请求成功回调
      async: 请求异步同步，默认异步
    */
    let oAjax = null;
    let j = {};
    if (window.XMLHttpRequest) {
      oAjax = new XMLHttpRequest();
    } else {
      oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    j.method = opt.method || "get";
    j.url = opt.url || "";
    j.data = opt.data || "";
    j.callback = opt.callback || function () {};

    if (j.method == "get" && j.data) {
      let data_send = "?";
      Object.keys(j.data).forEach((key) => {
        data_send += `${key}=${j.data[key]}`;
      });
      j.url += data_send.slice(0, -1);
    }

    oAjax.open(j.method, j.url, opt.async || true);

    if (j.method == "get") {
      oAjax.send();
    } else {
      let data = j.data;
      let header = "application/x-www-form-urlencoded";
      if (typeof j.data !== "string") {
        header = "application/json";
        data = JSON.stringify(data);
      }
      xhr.setRequestHeader("Content-type", header);
      xhr.send(data);
    }

    oAjax.onreadystatechange = function () {
      if (oAjax.readyState == 4) {
        if (oAjax.status == 200) {
          j.callback(oAjax.responseText);
        }
      }
    };
  },
}
