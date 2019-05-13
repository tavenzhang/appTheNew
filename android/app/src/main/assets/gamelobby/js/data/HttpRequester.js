/*
* 用于请求http数据
*/
var HttpRequester = /** @class */ (function () {
    function HttpRequester() {
    }
    /**
     * 包括轮播图在内的玩家信息
     */
    HttpRequester.getPlayerMaterialInfo = function (caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome;
        var api = "/gamecenter/player/material/info" + "?access_token=" + Common.access_token;
        url += api;
        var header = [
            "Accept", "application/json"
        ];
        this.doRequest(url, header, null, caller, callback, "get");
    };
    /**
     * 修改密码
     * @param pwd
     * @param newpwd
     * @param confirmpwd
     */
    HttpRequester.setPassWord = function (pwd, newpwd, confirmpwd, caller, callback) {
        try {
            var url = ConfObjRead.getConfUrl().url.apihome;
            url += ConfObjRead.getConfUrl().cmd.changepwd;
            url += "?access_token=" + Common.access_token;
            var header = ["Content-Type", "application/json; charset=utf-8", "Accept", "*/*"];
            var ePwd = window['SecretUtils'].rsaEncodePWD(pwd);
            var eNpwd = window['SecretUtils'].rsaEncodePWD(newpwd);
            var data = {
                mode: "PASSWORD",
                password: ePwd,
                newPassword: eNpwd
            };
            var jd = JSON.stringify(data);
            NetManager.getObj().HttpConnect(url, this, function (data, state, hr) {
                var num = hr.http.status;
                var suc; //标记是否修改成功
                if (num == 204)
                    suc = true;
                if (caller && callback)
                    callback.apply(caller, [suc, hr]);
            }, header, jd, "POST", "JSON");
        }
        catch (e) { }
    };
    /**
     * 网关初始化信息
     * todo:后续相关接口收到428错误时需要重新请求这个接口
     * @param caller
     * @param callback
     */
    HttpRequester.getGatewayInfo = function (caller, callback) {
        var header = ["Content-Type", "application/json; charset=utf-8", "Accept", "*/*",
            "device_token", GameUtils.deviceToken,
            "rid", MyUid.getUid(),
            "ts", Laya.Browser.now(),
            "s", "WAP"
        ];
        var url = ConfObjRead.getConfUrl().url.apihome + ConfObjRead.getConfUrl().cmd.gatewayInfo;
        this.doRequest(url, header, null, caller, callback, "get");
    };
    /**
     * 通过token登录
     */
    HttpRequester.loginByToken = function (token, caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome + ConfObjRead.getConfUrl().cmd.userinfobalance + "?access_token=" + token;
        this.doRequest(url, null, null, caller, callback, "get");
    };
    /**
     * 获取快捷登录用户名和密码信息
     * 用于首次登录本地无缓存的情况
     * @param caller
     * @param callback
     */
    HttpRequester.getFastUserInfo = function (caller, callback) {
        var header = ["Content-Type", "application/json; charset=utf-8", "Accept", "*/*", "device_token", GameUtils.deviceToken];
        var url = ConfObjRead.getConfUrl().url.apihome + ConfObjRead.getConfUrl().cmd.prequicklogin;
        this.doRequest(url, header, null, caller, callback, "post");
    };
    /**
     * 快速登录
     * @param userName 用户名
     * @param passWord 密码
     * @param caller 上下文
     * @param callback 回调函数
     */
    HttpRequester.fastLogin = function (userName, passWord, caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome;
        if (GameUtils.isNativeApp)
            url += ConfObjRead.getConfUrl().cmd.quicklogin_app;
        else
            url += ConfObjRead.getConfUrl().cmd.quicklogin;
        if (!Common.gatewayInfo) {
            Toast.showToast("请稍后再试");
            return;
        }
        var header = this.getEncryHeader();
        var ePwd = window['SecretUtils'].rsaEncodePWD(passWord);
        var data = {
            username: userName,
            password: ePwd,
            affCode: AppData.NATIVE_DATA.affCode
        };
        var dataStr = JSON.stringify(data);
        this.doRequest(url, header, dataStr, caller, callback, "post");
    };
    /**
     * 快速登录之验证码登录
     * @param userName
     * @param passWord
     * @param code
     * @param random
     * @param caller
     * @param callback
     */
    HttpRequester.fastLoginWithVC = function (userName, passWord, code, random, caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome;
        if (GameUtils.isNativeApp)
            url += ConfObjRead.getConfUrl().cmd.quickloginWithVC_app;
        else
            url += ConfObjRead.getConfUrl().cmd.quickloginWithVC;
        var header = this.getEncryHeader();
        var ePwd = window['SecretUtils'].rsaEncodePWD(passWord);
        var data = {
            username: userName,
            password: ePwd,
            validateCode: code,
            webUniqueCode: random,
            affCode: AppData.NATIVE_DATA.affCode
        };
        var dataStr = JSON.stringify(data);
        this.doRequest(url, header, dataStr, caller, callback, "post");
    };
    /**
     * 账户登录
     * @param userName
     * @param passWord
     * @param caller
     * @param callback
     */
    HttpRequester.accountLogin = function (userName, passWord, caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome;
        if (GameUtils.isNativeApp)
            url += ConfObjRead.getConfUrl().cmd.userlogin_app;
        else
            url += ConfObjRead.getConfUrl().cmd.userlogin;
        var header = this.getEncryHeader();
        var ePwd = window['SecretUtils'].rsaEncodePWD(passWord);
        var data = {
            username: userName,
            password: ePwd
        };
        var dataStr = JSON.stringify(data);
        this.doRequest(url, header, dataStr, caller, callback, "post");
    };
    /**
     * 账户登录-带验证码
     * @param userName
     * @param passWord
     * @param code
     * @param random
     * @param caller
     * @param callback
     */
    HttpRequester.accountLoginWithVC = function (userName, passWord, code, random, caller, callback) {
        var url = ConfObjRead.getConfUrl().url.apihome;
        if (GameUtils.isNativeApp)
            url += ConfObjRead.getConfUrl().cmd.userloginWithVC_app;
        else
            url += ConfObjRead.getConfUrl().cmd.userloginWithVC;
        var header = this.getEncryHeader();
        var ePwd = window['SecretUtils'].rsaEncodePWD(passWord);
        var data = {
            username: userName,
            password: ePwd,
            validateCode: code,
            webUniqueCode: random
        };
        var dataStr = JSON.stringify(data);
        this.doRequest(url, header, dataStr, caller, callback, "post");
    };
    /**
     * 注册账号
     * @param pwd
     * @param code
     * @param rand
     * @param caller
     * @param callback
     */
    HttpRequester.registerAccount = function (uname, pwd, code, rand, caller, callback) {
        var _this = this;
        var ePwd = window['SecretUtils'].rsaEncodePWD(pwd);
        var data = {
            username: uname,
            password: ePwd,
            hash: '',
            validateCode: code,
            webUniqueCode: rand,
            affCode: AppData.NATIVE_DATA.affCode
        };
        window['SecretUtils'].encode(name, pwd, function (hash) {
            data.hash = hash;
            var jsonStr = JSON.stringify(data);
            var url = ConfObjRead.getConfUrl().url.apihome + ConfObjRead.getConfUrl().cmd.userreg;
            var header = ["Content-Type", "application/json; charset=utf-8", "Accept", "*/*"];
            _this.doRequest(url, header, jsonStr, caller, callback);
        });
    };
    /**
     * 开始请求
     * @param url
     * @param header
     * @param jsonStr
     * @param caller
     * @param callback
     * @param method
     */
    HttpRequester.doRequest = function (url, header, jsonStr, caller, callback, method) {
        if (method === void 0) { method = "post"; }
        NetManager.getObj().HttpConnect(url, this, function (s, stat, hr) {
            var suc;
            var jobj;
            if (stat == "complete") {
                try {
                    jobj = JSON.parse(s);
                }
                catch (e) {
                    jobj = s;
                }
                suc = true;
            }
            else {
                var err = hr.http.response;
                jobj = hr;
                if (err) {
                    var obj = JSON.parse(err);
                    Toast.showToast(obj.message);
                }
                else {
                    Toast.showToast(Tools.getStringByKey(ConfObjRead.getConfCommon().unknow_err));
                }
            }
            if (caller && callback)
                callback.apply(caller, [suc, jobj]);
        }, header, jsonStr, method, "json");
    };
    //获取加密相关的头部信息
    HttpRequester.getEncryHeader = function () {
        var tsValue = Laya.Browser.now() + Common.gatewayInfo.tsDiff;
        //按字典排序拼接数据
        var value = "device_token=" + GameUtils.deviceToken;
        value += "rid=" + MyUid.getUid();
        value += "s=" + "WAP";
        value += "ts=" + tsValue;
        var sign = value + Common.gatewayInfo.sid;
        if (window["_0x78550"]) {
            sign += window["_0x78550"]();
        }
        else {
            Toast.showToast("sec失效,请杀掉进程重启游戏");
        }
        var header = ["Content-Type", "application/json; charset=utf-8", "Accept", "*/*",
            "device_token", GameUtils.deviceToken,
            "rid", MyUid.getUid(),
            "ts", tsValue,
            "s", "WAP",
            "sign", sign
        ];
        return header;
    };
    return HttpRequester;
}());
//# sourceMappingURL=HttpRequester.js.map