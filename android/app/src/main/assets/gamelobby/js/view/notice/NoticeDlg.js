var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var view;
(function (view) {
    var dlg;
    (function (dlg_1) {
        var NoticeDlg = /** @class */ (function (_super) {
            __extends(NoticeDlg, _super);
            function NoticeDlg() {
                var _this = _super.call(this) || this;
                _this._tabs = [];
                _this.isDrag = false;
                _this.downPos = {
                    "x": 0,
                    "y": 0
                };
                _this.initView();
                return _this;
            }
            NoticeDlg.show = function () {
                var dlg = new NoticeDlg();
                dlg.game_counter.visible = false;
                dlg.notice_counter.visible = false;
                dlg.tab_dummy.visible = false;
                dlg.popup(false, false);
                dlg.pop(dlg);
                dlg.requestData();
            };
            NoticeDlg.prototype.pop = function (dlg) {
                // dlg.alpha = 1;
                // dlg.y = 0
                dlg.anchorX = 0.5;
                dlg.anchorY = 0.5;
                dlg.x = Laya.stage.width / 2;
                dlg.y = Laya.stage.height / 2;
                Laya.Tween.to(dlg, { scaleX: 1.1, scaleY: 1.1 }, 50, Laya.Ease.linearNone, Laya.Handler.create(this, function () {
                    Laya.Tween.to(dlg, { scaleX: 1, scaleY: 1 }, 120);
                }));
            };
            NoticeDlg.prototype.initView = function () {
                var _this = this;
                var w2 = Laya.stage.width - this.width;
                this.x = w2 / 2;
                this.y = (Laya.stage.height - this.width) / 2;
                this.controls.x = this.x + this.width;
                if (Laya.stage.width <= 1334) {
                    var buffer = 50;
                    this.controls.x += buffer - 30;
                    this.label.x += buffer * 2;
                    this.contentList.x = this.label.x + 40;
                    this.contents.x = this.contentList.x + 320 - 10; //Fthis.contentList.width - 10;
                }
                this.contentList.on(Laya.Event.MOUSE_DOWN, this, this.onScroll);
                this.contentList.on(Laya.Event.MOUSE_UP, this, this.onScroll);
                this.on(Laya.Event.MOUSE_UP, this, this.onScroll);
                this.contentList.on(Laya.Event.MOUSE_MOVE, this, this.onScroll);
                this.tab_notice.on(Laya.Event.CLICK, this, this.onTabClick);
                this.tab_game.on(Laya.Event.CLICK, this, this.onTabClick);
                this.tab_game.alpha = 0;
                EventManager.addTouchScaleListener(this.controls, this, function () {
                    SoundPlayer.returnLobbySound();
                    _this.close(null, false);
                });
                this.loopArrow();
                this._currentCategoryTab = 1;
            };
            NoticeDlg.prototype.loopArrow = function () {
                this.arrow.y = 620;
                Laya.Tween.to(this.arrow, { y: 630 }, 500, Laya.Ease.linearNone, new Laya.Handler(this, this.loopArrow));
            };
            NoticeDlg.prototype.requestData = function () {
                var url = ConfObjRead.getConfUrl().url.apihome +
                    ConfObjRead.getConfUrl().cmd.attention_new +
                    "?access_token=" + Common.access_token;
                NetManager.getObj().HttpConnect(url, this, this.responseAttention);
            };
            NoticeDlg.prototype.responseAttention = function (s, stat, hr) {
                if (stat == "complete") {
                    this._data = s;
                    this.update(s);
                }
                else {
                    // LayaMain.getInstance().requestEnd(stat, s);
                    // this.destroy(true);
                    var repon = hr.http.response;
                    try {
                        var jobj = JSON.parse(repon);
                        var err = jobj.message;
                        Toast.showToast(err);
                    }
                    catch (e) { }
                }
            };
            NoticeDlg.prototype.update = function ($data) {
                var dummy = this.content_tabs.getChildByName("tab_dummy");
                for (var _i = 0, _a = this._tabs; _i < _a.length; _i++) {
                    var tab = _a[_i];
                    tab.destroy(true);
                    this.content_tabs.removeChild(tab);
                }
                this._tabs.length = 0;
                this._contentH = 0;
                var data = $data[this._currentCategoryTab];
                var list = data.noticeList;
                for (var i = 0; i < list.length; i++) {
                    var tab = new NoticeSideTab();
                    tab.id = i;
                    tab.init(dummy);
                    tab.setData(list[i]);
                    this.content_tabs.addChild(tab);
                    tab.on(Laya.Event.CLICK, this, this.onSideTabClick);
                    var gap = 10;
                    tab.y = (tab.height + gap) * i;
                    tab.y += dummy.y;
                    this._contentH = tab.y + tab.height;
                    this._tabs.push(tab);
                }
                dummy.visible = false;
                if (this._tabs.length > 0) {
                    this._tabs[0].active();
                    this.loadTab(0);
                }
                this.listLen = list.length;
                this.arrow.visible = list.length > 6;
                this.updateTotalReadCounter();
            };
            NoticeDlg.prototype.updateTotalReadCounter = function () {
                var _this = this;
                this._data.forEach(function (data, idx) {
                    var target = idx === 0 ? _this.game_counter : _this.notice_counter;
                    var counter = 0;
                    if (data.noticeList) {
                        data.noticeList.forEach(function (data) {
                            if (data.bread === false) {
                                counter++;
                            }
                        });
                    }
                    target.visible = counter > 0;
                    var label = target.getChildByName("label");
                    // label.text = counter.toString();
                    label.autoSize = true;
                    label.align = "right";
                    // target.width = label.width + 13;
                });
            };
            NoticeDlg.prototype.onTabClick = function ($e) {
                switch ($e.currentTarget) {
                    case this.tab_notice:
                        this.tab_notice.alpha = 1;
                        this.tab_game.alpha = 0;
                        this.loadCategoryTab(1);
                        break;
                    case this.tab_game:
                        this.tab_notice.alpha = 0;
                        this.tab_game.alpha = 1;
                        this.loadCategoryTab(0);
                        break;
                }
                SoundPlayer.enterPanelSound();
            };
            NoticeDlg.prototype.onSideTabClick = function ($e) {
                if (this.isDrag)
                    return;
                for (var _i = 0, _a = this._tabs; _i < _a.length; _i++) {
                    var tab_1 = _a[_i];
                    tab_1.deactive();
                }
                var tab = $e.currentTarget;
                tab.active();
                tab.updateRead();
                this.updateCurrentTotalReadCounter();
                SoundPlayer.enterPanelSound();
                this.loadTab(tab.id);
            };
            NoticeDlg.prototype.updateCurrentTotalReadCounter = function () {
                var counter = 0;
                for (var _i = 0, _a = this._tabs; _i < _a.length; _i++) {
                    var tab = _a[_i];
                    if (tab.ind.visible) {
                        counter++;
                    }
                }
                var target = this._currentCategoryTab === 0 ? this.game_counter : this.notice_counter;
                target.visible = counter > 0;
                var label = target.getChildByName("label");
                // label.text = counter.toString();
                label.autoSize = true;
                label.align = "right";
                // target.width = label.width + 13;
            };
            NoticeDlg.prototype.loadCategoryTab = function ($id) {
                this._currentCategoryTab = $id;
                this.contents.destroyChildren();
                this.contents.removeChildren();
                this.backActionAll(this.content_tabs, 23);
                this.requestData();
            };
            NoticeDlg.prototype.loadTab = function ($id) {
                this.contents.destroyChildren();
                this.contents.removeChildren();
                var data = this._data[this._currentCategoryTab].noticeList[$id];
                var content;
                switch (data.noticeActivityType) {
                    case "NORMAL":
                        content = new Notice_Message();
                        content.setData(data);
                        break;
                    case "SHARE_DAILY":
                        content = new Notice_Share();
                        content.init(this);
                        content.setData(data);
                        break;
                    case "ROULETTE_DRAW":
                        content = new Notice_Roullette();
                        content.init();
                        content.setData(data);
                        break;
                    default:
                        // 游戏公告全是文本
                        content = new Notice_Message();
                        content.setData(data);
                        break;
                }
                content.x = content.y = 0;
                this.contents.addChild(content);
                this.requestRead(this._data[this._currentCategoryTab].noticeList[$id].noticeid);
            };
            NoticeDlg.prototype.requestRead = function (id) {
                var url = ConfObjRead.getConfUrl().url.apihome +
                    ConfObjRead.getConfUrl().cmd.attention_read + id +
                    "?access_token=" + Common.access_token;
                var header = [
                    "Accept", "application/json"
                ];
                NetManager.getObj().HttpConnect(url, this, this.responseRead, header, //:any=null,
                null, //data:any=null,
                "PUT", //metod:any="get",
                "json" //restype:any="json"
                );
            };
            NoticeDlg.prototype.responseRead = function (s, stat, hr) {
                var _this = this;
                if (stat == "complete") {
                    var list = this._data[this._currentCategoryTab].noticeList;
                    list.forEach(function (data, index) {
                        if (data.noticeid === s.noticeid || data.noticeid === s.noticeId) {
                            _this._tabs[index].updateRead();
                        }
                    });
                }
            };
            NoticeDlg.prototype.onScroll = function ($e) {
                var x = $e.stageX;
                var y = $e.stageY;
                switch ($e.type) {
                    case Laya.Event.MOUSE_DOWN:
                        this.downPos.x = x;
                        this.downPos.y = y;
                        break;
                    case Laya.Event.MOUSE_UP:
                        if (this.isDrag) {
                            Laya.timer.once(10, this, function () {
                                this.isDrag = false;
                            });
                            this.downPos.x = 0;
                            this.downPos.y = 0;
                            this.backAllContent();
                        }
                        break;
                    case Laya.Event.MOUSE_MOVE:
                        this.isDrag = true;
                        if (this.downPos.y > 0) {
                            var sumy = y - this.downPos.y;
                            this.downPos.y = y;
                            this.content_tabs.y += sumy;
                        }
                        break;
                }
            };
            NoticeDlg.prototype.backAllContent = function () {
                var ct = this.content_tabs;
                var yHead = ct.y;
                var miny = 23; //this.conf.btnitem.pos.y;
                var yEnd = miny + this._contentH + Math.abs(ct.y); //ct.y + ct.height;//this.conf.defaultItemConfs[i].size.h;
                var maxy = 642; //this.conf.content.size.h;
                var ctHeight = ct.height; //this.conf.defaultItemConfs[i].size.h;
                var showHeight = this._contentH; //this.conf.content.size.h;
                var toY;
                if (this.listLen <= 6 || ct.y > miny) {
                    this.backActionAll(ct, miny);
                }
                else if (ct.y + this._contentH < maxy) {
                    toY = miny - this._contentH + maxy - 5;
                    this.backActionAll(ct, toY);
                }
                // if(ct.y < miny && )
                // if (yHead <= miny && yEnd >= maxy) {
                // 	console.log("aa", miny)
                // 	// this.backActionAll(ct, miny);
                // }
                // else if (yHead > miny || ctHeight <= showHeight) {
                // 	backY = miny - yHead;
                // 	console.log("bb", backY)
                // 	this.backActionAll(ct, backY);
                // }
                // else if (yEnd < maxy) {
                // 	backY = maxy - yEnd;
                // 	console.log("cc", backY)
                // 	this.backActionAll(ct, backY);
                // }
                // else {
                // 	console.log("dd", maxy - yEnd)
                // }
            };
            NoticeDlg.prototype.backActionAll = function (sp, y) {
                var a = sp;
                var pos = {
                    "x": a.x,
                    // "y": a.y + y
                    "y": y
                };
                this.setAction(a, pos);
            };
            NoticeDlg.prototype.setAction = function (sp, pos) {
                var tween = Laya.Tween.to(sp, {
                    x: pos.x,
                    y: pos.y
                }, 200, Laya.Ease["backIn"]);
            };
            NoticeDlg.prototype.onClosed = function (type) {
                // Laya.SoundManager.playSound("assets/raw/sfx_close.mp3");
                EventManager.removeAllEvents(this);
                this.tab_notice.off(Laya.Event.CLICK, this, this.onTabClick);
                this.tab_game.off(Laya.Event.CLICK, this, this.onTabClick);
                // EventManager.removeEvent(EventType.FLUSH_HEADICON, this, this.setHeadIcon);
                _super.prototype.onClosed.call(this, type);
                this.destroy(true);
            };
            return NoticeDlg;
        }(ui.dlg.NoticeDlgUI));
        dlg_1.NoticeDlg = NoticeDlg;
    })(dlg = view.dlg || (view.dlg = {}));
})(view || (view = {}));
//# sourceMappingURL=NoticeDlg.js.map