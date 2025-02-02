var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.isAssets = function (a) {
        if (a) {
            return a;
        }
        try {
            throw new Error('Something bad-----shawn');
        }
        catch (e) {
            Debug.log("-------------shawn-----------begin----");
            Debug.log(e);
            Debug.log("-------------shawn-----------end------");
        }
    };
    Tools.splitBetNum = function (num) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var i = 0;
        var last = num;
        var usedCoins = []; // {};
        for (i = (args.length - 1); i >= 0; i--) {
            var ct = Tools.getCountOf(last, args[i]);
            if (i == 0) {
                var u0 = Math.floor(ct);
                usedCoins["" + args[i]] = u0;
            }
            else {
                var use = Math.floor(ct / 2);
                var used = use * args[i];
                last = last - used;
                usedCoins["" + args[i]] = use;
            }
        }
        var arr = [];
        // for(var a in usedCoins)
        for (var a = 0; a < usedCoins.length; a++) {
            var one = usedCoins[a];
            var coins = a;
            var count = one;
            var dd = 0;
            for (dd = 0; dd < count; dd++) {
                arr.push(Number(coins));
            }
        }
        // Debug.log("splitBetNum arr:");
        // Debug.log(arr);
        return arr;
    };
    //总数total，可以被分成多少个single？
    Tools.getCountOf = function (total, single) {
        var ct = total / single;
        // Debug.log("number:"+total+" can be split:"+ct+" single:"+single);
        return ct;
    };
    //切分字符串为单个字符串数组
    Tools.splitString = function (str) {
        // var s = String(str);//'我1234567890';
        // Debug.log("s:"+s);
        // var reg = new RegExp(".{1}","g");
        // var rs = new Array();
        // try{
        //     rs = s.match(reg);
        //     rs.push(s.substring(rs.join('').length));
        // }catch(e){
        //     Debug.log(e);
        // }
        var s = String(str);
        var rs = s.split("");
        return rs;
    };
    //返回当前资源完整路径
    Tools.getSrc = function (src) {
        // return src+"?v="+Common.loadConf.version.value;
        return src;
    };
    //返回当前资源版本地址补充部分
    Tools.getSrcVersion = function () {
        return "?v=" + Common.loadConf.version.value;
    };
    //MyBase64 加解密
    Tools.b64EncodeUnicode = function (str) {
        //1.加密
        var base = new MyBase64();
        var result = base.encode(str);
        return result;
    };
    Tools.b64DecodeUnicode = function (str) {
        var base = new MyBase64();
        //2.解密
        var result2 = base.decode(str);
        return result2;
    };
    //创建html元素
    Tools.newHTMLIframeElement = function (conf) {
        var p = new Laya.HTMLIframeElement(); //无法指定pos及宽高
        p.href = conf.href;
        return p;
        // var p = new Laya.HTMLDivElement();  //无法指定href
        // p.x = conf.pos.x;
        // p.y = conf.pos.y;
        // Debug.log("newHTMLIframeElement conf:");
        // Debug.log(conf);
        // p.pos(conf.pos.x,conf.pos.y);
        // p.size(conf.size.w,conf.size.h);
        // var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        //    '<foreignObject width="100%" height="100%">' +
        //    '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
        //      '<em>I</em> like' + 
        //      '<span style="color:white; text-shadow:0 0 2px blue;">' +
        //      'cheese</span>' +
        //    '</div>' +
        //    '</foreignObject>' +
        //    '</svg>';
        // var DOMURL = window.URL;// || window;//.webkitURL || window;
        // var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        // var url = DOMURL.createObjectURL(svg);
        // Debug.log("svg url:"+url);
        // var p = new Laya.Image();
        // p.pos(conf.pos.x,conf.pos.y);
        // p.size(conf.size.w,conf.size.h);
        // // p.skin = url;
        // // var img = new Image();
        // var img = Laya.HTMLImage.create();
        // img.src = url;
        // img.onload = function(p){
        //     Debug.log("svg img loaded");
        //     var tex = new Laya.Texture();
        // }
    };
    //字符串中间部分用星号替代
    Tools.starString = function (str, rep) {
        var s = str;
        var len = str.length;
        var o1 = Math.floor(len / 3); //从1/3处开始替换为星星
        var o2 = o1 * 2;
        var s1 = s.substr(0, o1);
        // Debug.log("0-"+o1+" s1:"+s1);
        var s3 = s.substr(o2, len);
        // Debug.log(o2+"-"+len+" s3:"+s3);
        return s1 + rep + s3;
    };
    Tools.newImage = function (conf) {
        var img = new Laya.Image(conf.href);
        img.pos(conf.pos.x, conf.pos.y);
        img.size(conf.size.w, conf.size.h);
        return img;
    };
    Tools.addSprite = function (node, conf) {
        if (!conf) {
            return null;
        }
        var sp = Tools.newSprite(conf);
        node.addChild(sp);
        return sp;
    };
    Tools.newSprite = function (conf) {
        var sp = new MySprite();
        if (conf.src) {
            sp.loadImage(conf.src);
            // Tools.addSpriteLoadListener(sp,conf,this,this.spriteLoaded);
        }
        sp.pos(conf.pos.x, conf.pos.y);
        if (conf.size) {
            //如果有设定尺寸，则拉伸一下
            if (!Tools.resizeSprite(sp, conf.size.w, conf.size.h)) {
                Debug.log("newSprite false conf:");
                Debug.log(conf);
            }
        }
        if (conf.pivot) {
            sp.pivot(conf.pivot.x, conf.pivot.y);
        }
        return sp;
    };
    //重设sp宽度高度
    Tools.resizeSprite = function (sp, w, h) {
        var nw = sp.width;
        var nh = sp.height;
        if (nw <= 0 || nh <= 0) {
            // Debug.log("Tools.resizeSprite sprite not loaded width and height == 0 sp=");
            // Debug.log(sp);
            return false;
        }
        var pw = w;
        var ph = h;
        var sx = pw / nw;
        var sy = ph / nh;
        sp.scale(sx, sy);
        return true;
    };
    //检测当前平台
    Tools.platformInfo = function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var p = {};
        if (isAndroid) {
            p.os = "Android";
        }
        else if (isiOS) {
            p.os = "IOS";
        }
        else {
            p.os = "other";
        }
        return p;
    };
    //
    Tools.deviceInfo = function () {
        Debug.log("deviceInfo:");
        Debug.log(window['plus']);
        if (window['plus']) {
            Tools.plusReady();
        }
        else {
            document.addEventListener("plusready", Tools.plusReady, false);
        }
    };
    Tools.plusReady = function () {
        Debug.log("plus:");
        Debug.log(window['plus']);
    };
    //跳转到指定地址
    Tools.jump2url = function (url) {
        try {
            var au = url;
            var enUrl = encodeURI(au);
            au = enUrl;
            PostMHelp.jumpToUrl({ au: au });
        }
        catch (e) {
        }
    };
    //过滤游戏目录前的../
    Tools.filterGameDir = function (url) {
        var dir = url;
        var idx = url.indexOf("../");
        if (idx == 0) {
            //需要过滤
            var s = url.substr(3, url.length);
            dir = s;
        }
        Debug.log("Tools.filterGameDir url:" + url + " idx:" + idx + " dir:" + dir);
        return dir;
    };
    //跳转到游戏
    Tools.jump2game = function (urls) {
        try {
            var url = urls;
            var ginfo = Common.getCurGameInfo();
            var backurl = ConfObjRead.getConfUrl().url.backlobby;
            var mainUrl = Tools.getCurFullPath();
            var hostUrl = Tools.getCurHost(mainUrl);
            //将url前头的../去掉
            var dir = Tools.filterGameDir(urls);
            // var jumpUrl = hostUrl+"/"+dir;
            var jumpUrl = ToolsApp.getGameJumpUrl(hostUrl, dir);
            Debug.log("Tools.jump2game jumpUrl:" + jumpUrl);
            var jobj = {};
            if (ginfo && ginfo.alias) {
                if (ginfo.alias == "zjh") {
                    backurl = backurl + "?gameId=" + Common.gameId + "&alias=" + ginfo.alias;
                }
            }
            else {
                ginfo = {
                    "alias": "",
                    "name": "" //"炸金花"
                };
            }
            var domainUrl = AppData.NATIVE_DATA.gameDomain;
            var wssUrl = "";
            if (domainUrl) {
                wssUrl = domainUrl.replace("http", "wss");
                wssUrl = wssUrl.replace("https", "wss");
            }
            jobj = {
                "token": Common.access_token,
                "httpUrl": ConfObjRead.getConfUrl().url.apihome,
                "gameId": Common.gameId,
                "wsUrl": Common.wsUrl,
                "roomId": Common.roomId,
                "backUrl": backurl,
                "alias": ginfo.alias,
                "name": ginfo.name,
                "clientId": Common.clientId,
                "mainUrl": mainUrl,
                "usergateway": AppData.NATIVE_DATA.loginDomain,
                "gamecenter": domainUrl,
                "wss": wssUrl,
                "openDebug": Debug.httpDebug
            };
            // Debug.log("Tools.jump2game jobj:");
            // Debug.log(jobj);
            var b = new MyBase64();
            var param = b.encode(JSON.stringify(jobj));
            var au = jumpUrl + "?jumpData=" + param;
            var enUrl = encodeURI(au);
            au = enUrl;
            var ne = b.decode(param);
            Debug.log("Tools.jump2game url:" + au);
            //需要关闭声音等暂停操作
            LayaMain.getInstance().onGamePause();
            PostMHelp.jumpToGame({ "payload": au });
        }
        catch (e) {
            Debug.log(e);
        }
    };
    //检查字符串是否存在
    Tools.isHaveString = function (str, instr) {
        var p = instr.indexOf(str);
        if (p >= 0) {
            return true;
        }
        return false;
    };
    //检查头部是否有./字符串
    Tools.isHaveHeadPoint = function (str, instr, len) {
        var ins = instr.substr(0, len);
        var b = Tools.isHaveString(str, ins);
        // Debug.log("Tools.isHaveHeadPoint str:"+str+" instr:"+instr+" len:"+len+" ins:"+ins+" b:"+b);
        // return b;
        if (b) {
            //有，直接返回
            return instr;
        }
        //else{
        //没有，加上再返回
        //}
        return "." + instr;
    };
    Tools.jump2module = function (url, type) {
        try {
            var jobj = {
                "token": Common.access_token,
                "httpUrl": ConfObjRead.getConfUrl().url.apihome,
                "clientId": Common.clientId,
                "backUrl": ConfObjRead.getConfUrl().url.backlobby
            };
            var b = new MyBase64();
            var param = b.encode(JSON.stringify(jobj));
            var au = url;
            if (Tools.isHaveString("?", url)) {
                au = url + "&jumpData=" + param;
            }
            else {
                au = url + "?jumpData=" + param;
            }
            var enUrl = encodeURI(au);
            au = enUrl;
            switch (type) {
                case "account":
                    PostMHelp.game_account(jobj);
                    break;
                case "custom":
                    PostMHelp.game_custom(jobj);
                    break;
                case "recharge":
                    PostMHelp.game_recharge(jobj);
                    break;
                case "redraw":
                    PostMHelp.game_redraw(jobj);
                    break;
                case "share":
                    PostMHelp.game_share(jobj);
                    break;
            }
        }
        catch (e) {
            Debug.log(e);
        }
    };
    Tools.loadJavaScript = function (src) {
        document.write("<scr" + "ipt src='" + src + "' loader='laya'></scr" + 'ipt>');
    };
    Tools.scaleSprite = function (sp, src, conf, wid) {
        if (wid === void 0) { wid = 0; }
        var lw = conf.lw;
        var cw = conf.cw;
        var rw = conf.rw;
        var midw = conf.cwid;
        if (wid != 0) {
            midw = Math.floor(wid) - lw - rw;
        }
        var texture = Laya.loader.getRes(Tools.getSrc(src));
        if (!texture) {
            return;
        }
        var tw = texture.width;
        var th = texture.height;
        var x1, y1, w1, h1;
        x1 = 0;
        y1 = 0;
        w1 = lw;
        h1 = th;
        var texLeft = Laya.Texture.createFromTexture(texture, x1, y1, w1, h1);
        sp.graphics.drawTexture(texLeft, x1, y1, texLeft.width, texLeft.height);
        var x2, y2, w2, h2;
        x2 = tw - rw;
        y2 = 0;
        w2 = rw;
        h2 = th;
        var texRight = Laya.Texture.createFromTexture(texture, x2, y2, w2, h2);
        var drawX, drawY, drawW, drawH;
        drawX = x1 + w1 + midw;
        drawY = y2;
        drawW = texRight.width;
        drawH = texRight.height;
        sp.graphics.drawTexture(texRight, drawX, drawY, drawW, drawH);
        var x_c, y_c, w_c, h_c;
        x_c = lw;
        y_c = 0;
        w_c = tw - lw - rw;
        h_c = th;
        var texCenter = Laya.Texture.createFromTexture(texture, x_c, y_c, w_c, h_c);
        drawX = w1;
        drawY = y_c;
        drawW = midw;
        drawH = texRight.height;
        sp.graphics.drawTexture(texCenter, drawX, drawY, drawW, drawH);
    };
    Tools.scaleSpriteV = function (sp, src, conf, hei) {
        if (hei === void 0) { hei = 0; }
        var th = conf.th;
        var mh = conf.mh;
        var bh = conf.bh;
        var midh = conf.mhei;
        if (hei != 0) {
            midh = Math.floor(hei) - th - bh;
        }
        var texture = Laya.loader.getRes(Tools.getSrc(src));
        if (!texture) {
            return;
        }
        var txw = texture.width;
        var txh = texture.height;
        var x1, y1, w1, h1;
        x1 = 0;
        y1 = 0;
        w1 = txw;
        h1 = th;
        var tex1 = Laya.Texture.createFromTexture(texture, x1, y1, w1, h1);
        sp.graphics.drawTexture(tex1, x1, y1, tex1.width, tex1.height);
        var x2, y2, w2, h2;
        x2 = 0;
        y2 = txh - bh;
        w2 = txw;
        h2 = bh;
        var tex2 = Laya.Texture.createFromTexture(texture, x2, y2, w2, h2);
        var drawX, drawY, drawW, drawH;
        drawX = x1;
        drawY = y1 + h1 + midh;
        drawW = tex2.width;
        drawH = tex2.height;
        sp.graphics.drawTexture(tex2, drawX, drawY, drawW, drawH);
        var x_c, y_c, w_c, h_c;
        x_c = 0;
        y_c = th;
        w_c = txw;
        h_c = mh;
        var texCenter = Laya.Texture.createFromTexture(texture, x_c, y_c, w_c, h_c);
        drawX = x_c;
        drawY = y_c;
        drawW = txw;
        drawH = midh;
        sp.graphics.drawTexture(texCenter, drawX, drawY, drawW, drawH);
    };
    Tools.scaleSpriteHV = function (sp, src, confHV, wid, hei) {
        if (wid === void 0) { wid = 0; }
        if (hei === void 0) { hei = 0; }
        var texture = Laya.loader.getRes(Tools.getSrc(src));
        if (!texture) {
            return;
        }
        var txw = texture.width;
        var txh = texture.height;
        var x0, y0, w0, h0;
        x0 = 0;
        y0 = 0;
        w0 = confHV.lw;
        h0 = confHV.th;
        var tex0 = Laya.Texture.createFromTexture(texture, x0, y0, w0, h0);
        var drawX0, drawY0, drawW0, drawH0;
        drawX0 = 0;
        drawY0 = 0;
        drawW0 = w0;
        drawH0 = h0;
        sp.graphics.drawTexture(tex0, drawX0, drawY0, drawW0, drawH0);
        var x1, y1, w1, h1;
        x1 = confHV.lw + confHV.cw;
        y1 = 0;
        w1 = confHV.rw;
        h1 = confHV.th;
        var tex1 = Laya.Texture.createFromTexture(texture, x1, y1, w1, h1);
        var drawX1, drawY1, drawW1, drawH1;
        drawX1 = confHV.lw + confHV.cwid;
        drawY1 = 0;
        drawW1 = w1;
        drawH1 = h1;
        sp.graphics.drawTexture(tex1, drawX1, drawY1, drawW1, drawH1);
        var x2, y2, w2, h2;
        x2 = 0;
        y2 = confHV.th + confHV.mh;
        w2 = confHV.lw;
        h2 = confHV.bh;
        var tex2 = Laya.Texture.createFromTexture(texture, x2, y2, w2, h2);
        var drawX2, drawY2, drawW2, drawH2;
        drawX2 = 0;
        drawY2 = confHV.th + confHV.mhei;
        drawW2 = confHV.lw;
        drawH2 = confHV.bh;
        sp.graphics.drawTexture(tex2, drawX2, drawY2, drawW2, drawH2);
        var x3, y3, w3, h3;
        x3 = confHV.lw + confHV.cw;
        y3 = confHV.th + confHV.mh;
        w3 = confHV.rw;
        h3 = confHV.bh;
        var tex3 = Laya.Texture.createFromTexture(texture, x3, y3, w3, h3);
        var drawX3, drawY3, drawW3, drawH3;
        drawX3 = confHV.lw + confHV.cwid;
        drawY3 = confHV.th + confHV.mhei;
        drawW3 = confHV.rw;
        drawH3 = confHV.bh;
        sp.graphics.drawTexture(tex3, drawX3, drawY3, drawW3, drawH3);
        var x4, y4, w4, h4;
        x4 = confHV.lw;
        y4 = 0;
        w4 = confHV.cw;
        h4 = confHV.th;
        var tex4 = Laya.Texture.createFromTexture(texture, x4, y4, w4, h4);
        var drawX4, drawY4, drawW4, drawH4;
        drawX4 = confHV.lw;
        drawY4 = 0;
        drawW4 = confHV.cwid;
        drawH4 = confHV.th;
        sp.graphics.drawTexture(tex4, drawX4, drawY4, drawW4, drawH4);
        var x5, y5, w5, h5;
        x5 = confHV.lw;
        y5 = confHV.th + confHV.mh;
        w5 = confHV.cw;
        h5 = confHV.bh;
        var tex5 = Laya.Texture.createFromTexture(texture, x5, y5, w5, h5);
        var drawX5, drawY5, drawW5, drawH5;
        drawX5 = confHV.lw;
        drawY5 = confHV.th + confHV.mhei;
        drawW5 = confHV.cwid;
        drawH5 = confHV.th;
        sp.graphics.drawTexture(tex5, drawX5, drawY5, drawW5, drawH5);
        this.drawMyTexture(sp, texture, 0, confHV.th, confHV.lw, confHV.mh, 0, confHV.th, confHV.lw, confHV.mhei);
        this.drawMyTexture(sp, texture, confHV.lw + confHV.cw, confHV.th, confHV.rw, confHV.mh, confHV.lw + confHV.cwid, confHV.th, confHV.rw, confHV.mhei);
        this.drawMyTexture(sp, texture, confHV.lw, confHV.th, confHV.cw, confHV.mh, confHV.lw, confHV.th, confHV.cwid, confHV.mhei);
    };
    Tools.drawMyTexture = function (sp, texture, x, y, w, h, dx, dy, dw, dh) {
        var tex = Laya.Texture.createFromTexture(texture, x, y, w, h);
        sp.graphics.drawTexture(tex, dx, dy, dw, dh);
    };
    Tools.getHttpName = function (url) {
        var idx = url.indexOf("://");
        if (idx != -1) {
            var h = url.substring(0, idx);
            return h;
        }
        return "http";
    };
    Tools.getFileNameExt = function (str) {
        var lastPoint = str.lastIndexOf(".");
        var name = str.substring(0, lastPoint);
        var ext = str.substring(lastPoint, str.length);
        return { "name": name, "ext": ext };
    };
    Tools.getCurDirPath = function (str) {
        var httpIdx = str.indexOf("http");
        if (httpIdx != -1) {
            return str;
        }
        var url2 = document.URL;
        var lastEnd = url2.lastIndexOf("/");
        var frontStr = url2.substring(0, lastEnd);
        var newurl = "";
        if (!this.isHaveXiegang(frontStr, frontStr.length - 1) && !this.isHaveXiegang(str, 0)) {
            newurl = frontStr + "/" + str;
        }
        else {
            newurl = frontStr + str;
        }
        return newurl;
    };
    Tools.isHaveXiegang = function (str, pos) {
        var cut = str.substring(pos, pos + 1);
        if (cut == "/") {
            return true;
        }
        return false;
    };
    Tools.getCurRootPath = function (str) {
        var httpIdx = str.indexOf("http");
        if (httpIdx != -1) {
            return str;
        }
        var url2 = document.URL;
        Debug.log("url2:" + url2);
        var httpName = Tools.getHttpName(url2);
        Debug.log("httpName:" + httpName);
        var hostname = location.hostname;
        var port = location.port;
        if (port) {
            return httpName + "://" + hostname + ":" + port + "/" + str;
        }
        return httpName + "://" + hostname + "/" + str;
    };
    Tools.getCurHost = function (fullpath) {
        var url4 = window.location.host;
        var idxHttp = fullpath.indexOf("http");
        var idxHttps = fullpath.indexOf("https");
        if (idxHttps == 0) {
            return "https://" + url4;
        }
        else if (idxHttp == 0) {
            return "http://" + url4;
        }
        return url4;
    };
    Tools.getCurFullPath = function () {
        var url2 = document.URL;
        // Debug.log("url2:"+url2);
        // var url3 = window.location;
        // Debug.log("url3:"+url3);
        // var url4 = window.location.host;
        // Debug.log("url4:"+url4);
        return url2;
    };
    Tools.getResRootPath = function (str) {
        var url2 = document.URL;
        Debug.log("url2:" + url2);
        var httpName = Tools.getHttpName(url2);
        Debug.log("httpName:" + httpName);
        var hostname = location.hostname;
        var port = location.port;
        if (port) {
            return httpName + "://" + hostname + ":" + port + "/" + str;
        }
        return httpName + "://" + hostname + "/" + str;
    };
    Tools.substr_cn_2arr = function (str, len) {
        var s = str;
        var reg = new RegExp(".{" + len + "}", "g");
        var rs = new Array();
        try {
            rs = s.match(reg);
            rs.push(s.substring(rs.join('').length));
        }
        catch (e) {
            Debug.log(e);
        }
        return rs;
    };
    Tools.substr_cn = function (str, n) {
        var r = /[^\x00-\xff]/g;
        if (str.replace(r, "mm").length <= n) {
            return str;
        }
        var m = Math.floor(n / 2);
        for (var i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
                return str.substr(0, i); //+"...";
            }
        }
        return str;
    };
    Tools.setSpriteBlurFilter = function (sp, conf) {
        var filter = new Laya.BlurFilter();
        filter.strength = conf.strength;
        sp.filters = [filter];
    };
    Tools.setSpriteGlowFilter = function (sp, conf) {
        var filter = new Laya.GlowFilter(conf.color, conf.blur, conf.offx, conf.offy);
        sp.filters = [filter];
        // Tools.setSpriteWhiteFilter(sp,conf);
    };
    Tools.setSpriteWhiteFilter = function (sp, conf) {
        var grayscaleMat = [
            1, 0, 0, 0, 0,
            1, 0, 0, 0, 0,
            1, 0, 0, 0, 0,
            0, 0, 0, 0, 1
        ];
        var filter = new Laya.ColorFilter(grayscaleMat);
        sp.filters = [filter];
    };
    Tools.setSpriteGrayFilter = function (sp) {
        var grayscaleMat = [
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0, 0, 0, 1, 0
        ];
        var filter = new Laya.ColorFilter(grayscaleMat);
        sp.filters = [filter];
    };
    Tools.clearSpriteFilter = function (sp) {
        sp.filters = null;
    };
    Tools.isNumber = function (v) {
        if (typeof (v) === "number" && v !== Infinity && !isNaN(v)) {
            return true;
        }
        return false;
    };
    /**
     * 变量是否为空
     * @param variable
     */
    Tools.isEmpty = function (data) {
        if (data == null || data.length == 0) {
            return true;
        }
        return false;
    };
    /**
     * 获得请求过来的html参数
     * @param variable
     */
    Tools.getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        // Debug.log('getQueryVariable query:'+query);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        // Debug.log('query variable %s not found', variable);
        return undefined;
    };
    /**
     * 获得字符串的hash值
     * @param str 需要被hash的字符串
     */
    Tools.hash = function (str) {
        var hash = 0, i, chr;
        if (str.length === 0)
            return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    //根据昵称转换头像id
    Tools.transNickname2id = function (str) {
        var hashCode = Tools.hash(str);
        var headerIndex = hashCode % 8; //12;
        if (headerIndex < 0) {
            headerIndex = -headerIndex;
        }
        headerIndex += 1;
        var strHeaderIndex = Tools.FormatNumber(headerIndex, 2);
        // this.setIcon("head/header" + headerIndex + ".png");
        // this.data.headerIndex = headerIndex;
        return strHeaderIndex;
    };
    //是否发生点击判断
    Tools.isClick = function (posDown, posUp) {
        var dis = Tools.distanceBy2Point(posDown.x, posDown.y, posUp.x, posUp.y);
        if (dis >= 20) {
            return false;
        }
        return true;
    };
    //是否发生碰撞
    Tools.isCollision = function (sp, pos) {
        return (pos.x >= sp.x && pos.y <= sp.x + sp.width) && (pos.y >= sp.y && pos.y <= sp.y + sp.height);
    };
    //分析资源类型
    Tools.getLoadingType = function (typename) {
        switch (typename) {
            case "ATLAS":
                return Laya.Loader.ATLAS;
            case "BUFFER":
                return Laya.Loader.BUFFER;
            case "FONT": //位图字体
                return Laya.Loader.FONT;
            case "IMAGE":
                return Laya.Loader.IMAGE;
            case "JSON":
                return Laya.Loader.JSON;
            case "SOUND":
                return Laya.Loader.SOUND;
            case "TEXT":
                return Laya.Loader.TEXT;
            case "XML":
                return Laya.Loader.XML;
            case "TTF": //字体
                return Laya.Loader.TTF;
        }
        return Laya.Loader.IMAGE;
    };
    //计算两点间距离
    Tools.distanceBy2Point = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        // return 0;
    };
    //绘制方块
    Tools.drawRect = function (sp, x, y, w, h, color) {
        sp.graphics.drawRect(x, y, w, h, color); //,"#ff0000",2);
    };
    Tools.drawRectWithAlpha = function (sp, x, y, w, h, color, alpha) {
        if (alpha === void 0) { alpha = 1; }
        if (alpha != 1) {
            // sp.graphics.alpha(alpha);
            sp.graphics.setAlpha(alpha);
        }
        sp.graphics.drawRect(x, y, w, h, color);
        // sp.graphics.drawRect(x,y,w,h,color,"#ff0000",2);
        if (alpha != 1) {
            // sp.graphics.alpha(1);
            sp.graphics.setAlpha(1);
        }
    };
    /**
     * 创建弹窗背景
     * 用于替代drawRectWithAlpha方法
     * @param alp
     */
    Tools.creatDlgBg = function (alp) {
        if (alp === void 0) { alp = 0.6; }
        var sp = new MySprite();
        sp.autoSize = true;
        sp.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        sp.alpha = alp;
        return sp;
    };
    //绘制圆角矩形，自定义路径
    Tools.RoundRect = function (sp, x, y, w, h, r, fillcolor, alpha) {
        // sp.graphics.drawPath(400, 310, [
        //     ["moveTo", 5, 0],
        //     ["lineTo", 105, 0],
        //     ["arcTo", 110, 0, 110, 5, 5],
        //     ["lineTo", 110, 55],
        //     ["arcTo", 110, 60, 105, 60, 5],
        //     ["lineTo", 5, 60],
        //     ["arcTo", 0, 60, 0, 55, 5],
        //     ["lineTo", 0, 5],
        //     ["arcTo", 0, 0, 5, 0, 5],
        //     ["closePath"]
        // ],
        // {
        //     fillStyle: "#00ffff"
        // });
        if (alpha === void 0) { alpha = 1; }
        // sp.graphics.drawPath(
        // 		x, y, 
        // [
        //     ["moveTo", arc, 0],
        //     ["lineTo", w-arc, 0],
        //     ["arcTo", w, 0, w, arc, arc],
        //     ["lineTo", w, h-arc],
        //     ["arcTo", w, h, w-arc, h, arc],
        //     ["lineTo", arc, h],
        //     ["arcTo", 0, h, 0, h-arc, arc],
        //     ["lineTo", 0, arc],
        //     ["arcTo", 0, 0, arc, 0, arc],
        //     ["closePath"]
        // ],
        // {
        //     fillStyle: color//"#00ffff"
        // });
        if (alpha != 1) {
            sp.graphics.setAlpha(alpha);
        }
        sp.graphics.drawPath(x, y, [
            ["moveTo", r, 0],
            ["lineTo", w - r, 0],
            ["arcTo", w + r, 0, w + r, r, r],
            ["lineTo", w + r, h - r],
            ["arcTo", w + r, h + r, w - r, h + r, r],
            ["lineTo", r, h + r],
            ["arcTo", 0, h + r, 0, h - r, r],
            ["lineTo", 0, r],
            ["arcTo", 0, 0, r, 0, r],
            ["closePath"]
        ], {
            fillStyle: fillcolor
        });
        if (alpha != 1) {
            sp.graphics.setAlpha(1);
        }
        sp.size(w, h);
    };
    //当前时间戳
    Tools.getTime = function () {
        var myDate = new Date();
        var MS = myDate.getTime();
        return MS;
    };
    //当前时间
    Tools.nowTime = function () {
        var myDate = new Date();
        // var sY = myDate.getYear();        //获取当前年份(2位)
        var Y = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var M = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var D = myDate.getDate(); //获取当前日(1-31)
        // var DD = myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
        // var MS = myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
        var H = myDate.getHours(); //获取当前小时数(0-23)
        var I = myDate.getMinutes(); //获取当前分钟数(0-59)
        var S = myDate.getSeconds(); //获取当前秒数(0-59)
        var MS = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
        // myDate.toLocaleDateString();     //获取当前日期
        // var mytime=myDate.toLocaleTimeString();     //获取当前时间
        // myDate.toLocaleString( );        //获取日期与时间
        return {
            "Y": Y,
            "M": M,
            "D": D,
            "H": H,
            "I": I,
            "S": S,
            "MS": MS
        };
    };
    //将时间转换为可读字符串
    Tools.getTimeStr = function (times) {
        var s = Math.floor(times / 100);
        var ss = Math.floor(times % 100);
        var m = Math.floor(s / 60);
        var s = Math.floor(s % 60);
        var m_s = m >= 10 ? "" + m : "0" + m;
        var s_s = s >= 10 ? "" + s : "0" + s;
        var ss_s = ss >= 10 ? "" + ss : "0" + ss;
        // return ""+m+":"+s+":"+ss;
        return m_s + ":" + s_s + ":" + ss_s;
    };
    Tools.isRightUserName = function (content, err_key) {
        if (err_key === void 0) { err_key = null; }
        var err = {
            "bRight": false,
            "msg": "username_ck_err"
        };
        if (err_key != null) {
            err.msg = err_key;
        }
        var reg = new RegExp(Tools.getStringByKey("username_regexp"));
        if (reg.test(content)) {
            err.bRight = true;
        }
        return err;
    };
    Tools.isRightUserNameReg = function (content, err_key) {
        if (err_key === void 0) { err_key = null; }
        var err = {
            "bRight": false,
            "msg": "username_ck_err"
        };
        if (err_key != null) {
            err.msg = err_key;
        }
        var reg = new RegExp(Tools.getStringByKey("username_reg_regexp"));
        if (reg.test(content)) {
            err.bRight = true;
        }
        return err;
    };
    Tools.isRightPwd = function (content, err_key) {
        if (err_key === void 0) { err_key = null; }
        var err = {
            "bRight": false,
            "msg": "pwd_ck_err"
        };
        if (err_key != null) {
            err.msg = err_key;
        }
        var reg = new RegExp(Tools.getStringByKey("pwd_regexp"));
        if (reg.test(content)) {
            err.bRight = true;
        }
        return err;
    };
    Tools.isRightYzm = function (content, err_key) {
        if (err_key === void 0) { err_key = null; }
        var err = {
            "bRight": false,
            "msg": "yzm_ck_err"
        };
        if (err_key != null) {
            err.msg = err_key;
        }
        var reg = new RegExp(Tools.getStringByKey("yzm_regexp"));
        if (reg.test(content)) {
            err.bRight = true;
        }
        return err;
    };
    Tools.isRightInput = function (label, content, err_key) {
        if (err_key === void 0) { err_key = null; }
        var err = {
            "bRight": false,
            "msg": "txt_unknowerr"
        };
        if (err_key != null) {
            err.msg = err_key;
        }
        switch (label) {
            case Tools.INPUT_LABEL_USERNAME:
                return Tools.isRightUserName(content, err_key);
            case Tools.INPUT_LABEL_PWD:
                return Tools.isRightPwd(content, err_key);
            case Tools.INPUT_LABEL_YZM:
                return Tools.isRightYzm(content, err_key);
            default:
                return err;
        }
    };
    Tools.regTest = function (content, regexp, msg, nullmsg) {
        var err = {
            "bRight": true,
            "msg": "txt_unknowerr"
        };
        if (content.length <= 0) {
            err.bRight = false;
            err.msg = nullmsg;
            return err;
        }
        if (regexp != null) {
            var reg = new RegExp(Tools.getStringByKey(regexp));
            if (reg.test(content)) {
                err.bRight = true;
            }
            else {
                err.bRight = false;
                err.msg = msg;
            }
        }
        return err;
    };
    Tools.verifyQuickLogin = function (yzm) {
        var err = {
            "bRight": false,
            "msg": "txt_unknowerr"
        };
        err = Tools.regTest(yzm, null, "", "qklogin_err_yzm_null");
        if (!err.bRight) {
            return err;
        }
        return err;
    };
    Tools.verifyLogin = function (name, pwd, yzm) {
        var err = {
            "bRight": false,
            "msg": "txt_unknowerr"
        };
        err = Tools.regTest(name, null, "", "login_err_username_null");
        if (!err.bRight) {
            return err;
        }
        err = Tools.regTest(pwd, null, "", "login_err_pwd_null");
        if (!err.bRight) {
            return err;
        }
        err = Tools.regTest(yzm, null, "", "login_err_yzm_null");
        if (!err.bRight) {
            return err;
        }
        return err;
    };
    Tools.verifyReg = function (name, pwd, cfpwd, yzm) {
        var err = {
            "bRight": false,
            "msg": "txt_unknowerr"
        };
        err = Tools.regTest(name, "regexp_username_reg", "reg_err_username_format", "reg_err_username_null");
        if (!err.bRight) {
            return err;
        }
        err = Tools.regTest(pwd, "regexp_pwd", "reg_err_pwd_format", "reg_err_pwd_null");
        if (!err.bRight) {
            return err;
        }
        if (cfpwd.length <= 0) {
            err.bRight = false;
            err.msg = "reg_err_cfpwd_null";
            return err;
        }
        if (pwd != cfpwd) {
            err.bRight = false;
            err.msg = "reg_err_cfpwd_notsame";
            return err;
        }
        err = Tools.regTest(yzm, null, "", "reg_err_yzm_null");
        if (!err.bRight) {
            return err;
        }
        return err;
    };
    Tools.verifyChangePw = function (oldpwd, newpwd, cfpwd) {
        var err = {
            "bRight": false,
            "msg": "txt_unknowerr"
        };
        err = Tools.regTest(oldpwd, null, "", "changepwd_err_oldpwd_null");
        if (!err.bRight) {
            return err;
        }
        err = Tools.regTest(newpwd, "regexp_pwd", "changepwd_err_newpwd_format", "changepwd_err_newpwd_null");
        if (!err.bRight) {
            return err;
        }
        if (cfpwd.length <= 0) {
            err.bRight = false;
            err.msg = "changepwd_err_cfpwd_null";
            return err;
        }
        if (newpwd != cfpwd) {
            err.bRight = false;
            err.msg = "changepwd_err_cfpwd_notsame";
            return err;
        }
        // err = Tools.regTest(cfpwd,"pwd_regexp","cfpwd_ck_err");
        // if( !err.bRight )
        // {
        //     return err;
        // }
        return err;
    };
    Tools.getStringByKey = function (key) {
        try {
            var language = ConfObjRead.getConfCommon().language;
            var arr = ConfObjRead.getConfText();
            var curLang = arr[language];
            var len = curLang.length;
            // Debug.log("Tools.getStringByKey key:"+key+" lang:"+language+" len:"+len);
            // Debug.log(curLang);
            for (var i = 0; i < len; i++) {
                var obj = curLang[i];
                if (obj.key == key) {
                    return obj.value;
                }
            }
        }
        catch (e) {
        }
        return key;
    };
    //添加一个文本框
    Tools.addText = function (node, conf, caller, callback) {
        var txt = Tools.newText(conf.value, conf.size.w, conf.size.h, conf.font.size, conf.font.color, conf.font.align, conf.font.valign, conf.font.wordWrap, conf.font.leading, conf.font.overflow, caller, callback);
        node.addChild(txt);
        if (conf.pos) {
            txt.pos(conf.pos.x, conf.pos.y);
        }
        if (conf.font.borderColor) {
            txt.borderColor = conf.font.borderColor;
        }
        return txt;
    };
    //新建一个多行文本框
    Tools.newText = function (str, width, height, //x:number,y:number,
    fontsize, color, align, valign, wordWrap, leading, overflow, scrollCaller, scrollCallback) {
        if (color === void 0) { color = "#ffffff"; }
        if (align === void 0) { align = "center"; }
        if (valign === void 0) { valign = "middle"; }
        if (wordWrap === void 0) { wordWrap = true; }
        if (leading === void 0) { leading = 2; }
        if (overflow === void 0) { overflow = Laya.Text.SCROLL; }
        if (scrollCaller === void 0) { scrollCaller = null; }
        if (scrollCallback === void 0) { scrollCallback = null; }
        var txt = new Laya.Text();
        txt.text = Tools.getStringByKey(str);
        // txt.width = width;
        txt.size(width, height);
        txt.fontSize = fontsize;
        txt.font = Common.normalFont; //
        txt.color = color;
        txt.overflow = overflow;
        //设置文本为多行文本
        txt.wordWrap = wordWrap; //true;
        txt.leading = leading;
        txt.align = align;
        txt.valign = valign;
        if (scrollCaller && scrollCallback) {
            txt.on(Laya.Event.MOUSE_DOWN, scrollCaller, scrollCallback);
            txt.on(Laya.Event.MOUSE_UP, scrollCaller, scrollCallback);
            txt.on(Laya.Event.MOUSE_MOVE, scrollCaller, scrollCallback);
            txt.on(Laya.Event.MOUSE_OUT, scrollCaller, scrollCallback);
        }
        return txt;
    };
    //对字符串进行格式化 0% 表示第一个参数 n% 表示第n个参数
    Tools.FormatString = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var str = format;
        //从format中替换掉所有n%
        for (var i = 0; i < args.length; i++) {
            // Debug.log('args i:'+i+" = "+args[i]);
            str = str.replace(i + "%", args[i]);
        }
        return str;
    };
    //固定字符串长度，不足的后面补rep
    Tools.FormatStringLen = function (str, len, rep) {
        // Debug.log("FormatStringLen str:"+str+" len:"+len+" rep:"+rep);
        while (str.length < len) {
            str += rep;
        }
        // Debug.log("FormatStringLen str:"+str);
        return str;
    };
    //数字限定长度 不足在前面补0
    Tools.FormatNumber = function (num, length) {
        return (Array(length).join('0') + num).slice(-length);
    };
    //将数字格式化到小数点后几位
    Tools.FormatFloatNumber = function (num, len) {
        var st = Number(num).toFixed(len);
        return st;
    };
    /**
     * 格式化金币
     * @param num
     * @param len 保留小数位数
     */
    Tools.FormatMoney = function (num, len) {
        if (len === void 0) { len = 2; }
        if (num < 10000)
            return num.toFixed(len);
        var float, dw;
        if (num >= 10000 && num < 100000000) { //万
            float = num / 10000;
            dw = "万";
        }
        else if (num >= 100000000) { //亿
            float = num / 100000000;
            dw = "亿";
        }
        var str = float.toFixed(len + 1);
        var pos = str.indexOf(".");
        var numStr = str.substring(0, pos + len + 1);
        return numStr + dw;
    };
    //计算两点角度
    Tools.getL = function (p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var l = Math.atan(y / x);
        return l;
    };
    //转换弧度为角度
    Tools.getAngle = function (p1, p2) {
        var l = this.getL(p1, p2);
        var a = this.transl2Angle(l);
        var b = this.transAngle2Positive(a, p1, p2);
        return b;
    };
    //弧度转角度
    Tools.transl2Angle = function (l) {
        //180 -- pi
        //x ---- l
        // l = ( x * pi )/180;
        // x = ( 180 * l )/pi
        // return ( angle * Math.PI )/180;	//角度转弧度
        return (180 * l) / Math.PI; //弧度转角度
    };
    //检查角度是否为负，如果为负，则转换为正
    Tools.transAngle2Positive = function (angle, p1, p2) {
        //先检查p2在p1的哪个象限
        /*   	  +-90
                    |	-90
            90-	180	|	0-90
        0  --------------------   -0
            180-270	|	270-360
                    |
                  +-90
        */
        //1
        if (p2.x > p1.x && p2.y > p1.y) {
            if (angle >= 0) {
                angle = 360 - angle;
            }
            else {
                angle = 270 - angle;
            }
        }
        //2
        else if (p2.x < p1.x && p2.y > p1.y) {
            if (angle >= 0) {
                angle = 180 + angle;
            }
            else {
                angle = 180 - angle;
            }
        }
        //3
        else if (p2.x < p1.x && p2.y < p1.y) {
            if (angle >= 0) {
                angle = 180 - angle;
            }
            else {
                angle = angle;
            }
        }
        //4
        else if (p2.x > p1.x && p2.y < p1.y) {
            if (angle >= 0) {
                angle = angle;
            }
            else {
                angle = angle * -1;
            }
        }
        return angle;
    };
    //生成一个Sprite的剪影
    Tools.newSketch = function (sp, x, y, w, h) {
        var sp_mask = new MySprite();
        Tools.drawRect(sp_mask, x, y, w, h, "#000000");
        sp_mask.mask = sp;
        return sp_mask;
    };
    //检测当前平台信息--不能正确获取，废弃
    Tools.platformInfo_0 = function () {
        var platformInfo = {};
        var agent = navigator.userAgent.toLowerCase();
        var sUserAgent = navigator.userAgent;
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        //IE
        if (agent.indexOf("msie") > 0) {
            platformInfo.browser = agent.match(regStr_ie);
        }
        //firefox
        if (agent.indexOf("firefox") > 0) {
            platformInfo.browser = agent.match(regStr_ff);
        }
        //Chrome
        if (agent.indexOf("chrome") > 0) {
            platformInfo.browser = agent.match(regStr_chrome);
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            platformInfo.browser = agent.match(regStr_saf);
        }
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac)
            platformInfo.os = "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix)
            platformInfo.os = "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        // var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
        var bIsAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
        if (isLinux) {
            if (bIsAndroid)
                platformInfo.os = "Android";
            else
                platformInfo.os = "Linux";
        }
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K)
                platformInfo.os = "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP)
                platformInfo.os = "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003)
                platformInfo.os = "Win2003";
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista)
                platformInfo.os = "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7)
                platformInfo.os = "Win7";
            var isWin8 = sUserAgent.indexOf("windows nt6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin8)
                platformInfo.os = "Win8";
        }
        platformInfo.os = "其他";
        var agent = navigator.userAgent.toLowerCase();
        var sUserAgent = navigator.userAgent;
        var sUserAgent = navigator.userAgent;
        var is64 = sUserAgent.indexOf("WOW64") > -1;
        if (is64) {
            platformInfo.digits = "64";
        }
        else {
            platformInfo.digits = "32";
        }
        return platformInfo;
    };
    //全屏
    Tools.addFullScreenListener = function () {
        var c = document.getElementsByTagName("canvas")[0];
        var pf = MyUid.getPlatform();
        if (pf == MyUid.KEY_P_PC || pf == MyUid.KEY_P_MAC) {
            c.addEventListener("click", Tools.screenFull);
        }
        else {
            c.addEventListener("touchend", Tools.screenFull);
        }
    };
    Tools.screenFull = function (e) {
        // Debug.log('screenFull e:');
        if (GameData.bClickFullscreen) {
            //检查当前是否全屏状态
            var bFull = false;
            try {
                bFull = window['screenfull'].isFullscreen;
                // Debug.log('screenFull:'+bFull);
                if (bFull) //已经全屏了，就退出全屏
                 {
                    window['screenfull'].exit();
                }
                else { //尚未全屏，就执行全屏
                    window['screenfull'].request();
                }
            }
            catch (e) {
                Debug.log(e);
            }
            GameData.bClickFullscreen = false;
        }
        //同时要复制字符串内容到剪贴板
        // Debug.log('copy string:'+Tools.copy_content);
        if (Tools.copy_content.length > 0) {
            Tools.Copy2Clip(Tools.copy_content);
            Tools.copy_content = "";
        }
    };
    Tools.doFullscreen = function () {
        GameData.bClickFullscreen = true;
    };
    Tools.Copy2Clip = function (url) {
        Debug.log('document:' + document);
        var lis = function (e) {
            Debug.log('url:' + url);
            e.clipboardData.setData('text/plain', url);
            e.preventDefault();
            document.removeEventListener('copy', lis, false);
        };
        document.addEventListener('copy', lis, false);
        // document.addEventListener('copy', (e: ClipboardEvent) => {
        //     Debug.log('url:'+url);
        //     e.clipboardData.setData('text/plain', url);
        //     e.preventDefault();
        //     document.removeEventListener('copy');
        // });
        var bcopy = document.execCommand('copy');
        Debug.log('bcopy:' + bcopy);
    };
    ;
    //复制消息
    Tools.copyMessage = function (val) {
        var selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        var bcopy = document.execCommand('copy');
        // Debug.log('bcopy:'+bcopy);
        document.body.removeChild(selBox);
    };
    //复制文本内容到剪贴板
    //此方法仅用在用户主动点击dom按钮时，不适合小游戏
    //模拟点击也不行
    Tools.copy2clip1 = function (str) {
        // Debug.log('str len:'+str.length);
        if (str.length <= 0) {
            // Debug.log('no copy content');
            return;
        }
        var input = document.createElement('input'); //.getElementById("input");
        document.body.appendChild(input);
        input.value = str; // 修改文本框的内容
        // input.id = 'copyinput';
        input.focus();
        input.select();
        // var js:any = 
        input.setSelectionRange(0, input.value.length);
        // js=input.createTextRange();
        // Debug.log('input:');
        // Debug.log(input);
        try {
            // if( document.execCommand('copy',false,null) )
            // if( js.execCommand("Copy") )
            if (document.execCommand("Copy")) {
                Debug.log('suc');
            }
            else {
                Debug.log('fail');
            }
        }
        catch (err) {
            // Debug.log('copy err:'+err);
        }
        input.remove();
    };
    Tools.INPUT_LABEL_USERNAME = "username";
    Tools.INPUT_LABEL_PWD = "pwd";
    Tools.INPUT_LABEL_YZM = "yzm";
    //当前要复制到剪贴板的内容
    Tools.copy_content = "";
    return Tools;
}());
//# sourceMappingURL=Tools.js.map