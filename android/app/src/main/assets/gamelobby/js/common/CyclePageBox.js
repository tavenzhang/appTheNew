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
/*
* 轮播图控件
*/
var CyclePageBox = /** @class */ (function (_super) {
    __extends(CyclePageBox, _super);
    /**
     *
     * @param viewWidth 轮播视图的宽
     * @param viewHeight
     */
    function CyclePageBox(viewWidth, viewHeight) {
        var _this = _super.call(this) || this;
        _this.itemBox = new Laya.Sprite();
        _this.imgList = [];
        _this.tweenTime = 400; //缓动时间
        _this.width = viewWidth;
        _this.height = viewHeight;
        _this.viewWidth = viewWidth;
        _this.viewHeight = viewHeight;
        _this.scrollRect = new Laya.Rectangle(0, 0, viewWidth, viewHeight);
        _this.addChild(_this.itemBox);
        return _this;
    }
    Object.defineProperty(CyclePageBox.prototype, "curIndex", {
        //当前实际索引
        get: function () {
            return Math.abs(this.moveIndex % this.total);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化数据
     * @param itemList
     * @param spaceTime
     */
    CyclePageBox.prototype.init = function (itemList, spaceTime) {
        var _this = this;
        this.itemList = itemList;
        this.spaceTime = spaceTime;
        this.total = itemList.length;
        this.moveIndex = 0;
        itemList.forEach(function (vo) {
            var img = new Laya.Image();
            img.width = _this.viewWidth;
            img.height = _this.viewHeight;
            img.skin = vo.carouselUrl;
            _this.imgList.push(img);
        });
        if (this.total > 0)
            this.itemBox.addChild(this.imgList[0]);
        if (this.total > 1) {
            this.addListener();
        }
        else if (this.total == 1) {
            this.on(Laya.Event.CLICK, this, this.singleHandler);
        }
    };
    CyclePageBox.prototype.singleHandler = function () {
        var vo = this.itemList[0];
        this.openLink(vo);
    };
    CyclePageBox.prototype.openLink = function (vo) {
        if (vo && vo.carouselHref) {
            if (vo.jumpInner) {
                if (vo.jumpGame)
                    EventManager.dispath(EventType.JUMP_GAME, vo.carouselHref);
                else
                    InnerJumpUtil.doJump(DlgCmd[vo.carouselHref]);
            }
            else {
                if (GameUtils.isNativeApp)
                    PostMHelp.game_common({ name: "openWeb", param: vo.carouselHref });
                else
                    window.open(vo.carouselHref);
            }
        }
    };
    /**
     * 刷新数据
     * @param itemList
     */
    CyclePageBox.prototype.flushData = function (itemList) {
        if (!itemList || itemList.length == 0)
            return;
        this.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        this.off(Laya.Event.CLICK, this, this.singleHandler);
        this.stopTimer();
        this.imgList.forEach(function (img) {
            img.destroy(true);
        });
        this.imgList.length = 0;
        this.itemBox.x = 0;
        this.itemBox.removeChildren();
        //
        this.init(itemList, this.spaceTime);
    };
    /**
     * 销毁
     */
    CyclePageBox.prototype.destroy = function (bl) {
        if (bl === void 0) { bl = true; }
        this.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        this.off(Laya.Event.CLICK, this, this.singleHandler);
        this.stopTimer();
        _super.prototype.destroy.call(this, true);
    };
    CyclePageBox.prototype.addListener = function () {
        this.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        this.addTimer();
    };
    CyclePageBox.prototype.addTimer = function () {
        if (this.total > 1)
            Laya.timer.loop(this.spaceTime, this, this.doTimer);
    };
    CyclePageBox.prototype.stopTimer = function () {
        Laya.timer.clear(this, this.doTimer);
    };
    CyclePageBox.prototype.touchBeginHandler = function (evt) {
        this.downPos = this.itemBox.x;
        this.downStageX = evt.stageX;
        this.downTime = Laya.Browser.now();
        this.stopTimer();
        this.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveHandler);
        this.on(Laya.Event.MOUSE_OUT, this, this.touchEndHandler);
        this.on(Laya.Event.MOUSE_UP, this, this.touchEndHandler);
    };
    CyclePageBox.prototype.touchMoveHandler = function (evt) {
        this.moveNum = evt.stageX - this.downStageX;
        var abs = this.moveNum < 0 ? -this.moveNum : this.moveNum;
        if (abs > 10) {
            Laya.Tween.clearTween(this.itemBox);
            this.itemBox.x = this.downPos + this.moveNum;
            var index = this.moveIndex % this.total;
            var dex = this.moveNum > 0 ? index - 1 : index + 1;
            if (dex < 0)
                dex = this.total + dex;
            if (dex >= this.total)
                dex = 0;
            var pic = this.imgList[dex];
            if (!this.itemBox.contains(pic)) {
                this.itemBox.addChild(pic);
            }
            pic.x = this.itemBox.getChildAt(0).x;
            this.moveNum > 0 ? pic.x -= this.viewWidth : pic.x += this.viewWidth;
        }
    };
    CyclePageBox.prototype.touchEndHandler = function () {
        this.off(Laya.Event.MOUSE_MOVE, this, this.touchMoveHandler);
        this.off(Laya.Event.MOUSE_OUT, this, this.touchEndHandler);
        this.off(Laya.Event.MOUSE_UP, this, this.touchEndHandler);
        this.addTimer();
        if (Math.abs(this.moveNum) > 10) {
            var next = Boolean(this.moveNum < 0);
            var dex = next ? this.moveIndex + 1 : this.moveIndex - 1;
            var toPos = -dex * this.viewWidth;
            if (this.itemBox.numChildren > 2) {
                var temp = this.itemBox.getChildAt(2);
                var temp2 = this.itemBox.getChildAt(1);
                if (next) {
                    if (temp.x < temp2.x)
                        this.itemBox.removeChild(temp);
                    else
                        this.itemBox.removeChild(temp2);
                }
                else {
                    if (temp.x > temp2.x)
                        this.itemBox.removeChild(temp);
                    else
                        this.itemBox.removeChild(temp2);
                }
            }
            this.doScroll(toPos, 250, next);
        }
        else {
            var time = Laya.Browser.now() - this.downTime;
            if (time < 350) { //点击处理
                var vo = this.itemList[this.curIndex];
                this.openLink(vo);
            }
        }
        this.moveNum = 0;
    };
    //定时滚动
    CyclePageBox.prototype.doTimer = function () {
        var index = this.moveIndex + 1;
        var toPos = -index * this.viewWidth;
        var dex = this.moveIndex % this.total + 1;
        if (dex < 0)
            dex = this.total + dex;
        if (dex >= this.total)
            dex = 0;
        var pic = this.imgList[dex];
        this.itemBox.addChild(pic);
        pic.x = this.itemBox.getChildAt(0).x + this.viewWidth;
        this.doScroll(toPos, 0, true);
    };
    CyclePageBox.prototype.doScroll = function (tPos, time, next) {
        var _this = this;
        var t = time ? time : this.tweenTime;
        Laya.Tween.clearTween(this.itemBox);
        Laya.Tween.to(this.itemBox, { x: tPos }, t, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
            if (_this.itemBox.numChildren > 1)
                _this.itemBox.removeChildAt(0);
            next ? _this.moveIndex++ : _this.moveIndex--;
            _this.changeIndex();
        }));
    };
    CyclePageBox.prototype.changeIndex = function () {
        //改变点点状态
    };
    return CyclePageBox;
}(Laya.Sprite));
//# sourceMappingURL=CyclePageBox.js.map