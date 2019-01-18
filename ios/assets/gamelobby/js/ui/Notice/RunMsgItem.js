var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RunMsgItem = /** @class */ (function (_super) {
    __extends(RunMsgItem, _super);
    function RunMsgItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //重设到准备状态,到右侧
        // public resetReady():void
        // {
        //     //请求父级，改变我的消息
        //     var msg = this.rmp.getNewMsg(this.getId());
        //     if( msg )
        //     {
        //         this.lb_msg.text = msg;
        //     }
        // }
        //跟随 哪个标签？
        // public follow(id:number):void
        // {
        //     this.followId = id;
        // }
        //是否死掉的消息对象
        _this.bDie = false;
        return _this;
    }
    //我跟随的id
    // public followId:number = -1;
    RunMsgItem.prototype.init = function (p, conf, text) {
        this.rmp = p;
        this.lb_msg = Tools.newLabel(text, conf.size.w, conf.size.h, conf.font.size, conf.font.color, conf.font.align, conf.font.valign, conf.font.name, conf.font.wrap);
        // Debug.trace("RunMsgItem init wid:"+this.lb_msg.width);
        this.addChild(this.lb_msg);
    };
    //如果消息长度不足，那么就在后面加空格,直到宽度超过指定宽度
    // public resetWidth2(needWid:number,replaceStr:string):void
    // {
    //     var msg = this.lb_msg.text;
    //     while( this.lb_msg.width < needWid )
    //     {
    //         msg += ""+replaceStr;
    //         this.lb_msg.text  = msg;
    //     }
    // }
    //设定id
    RunMsgItem.prototype.setId = function (id) {
        this.id = id;
    };
    RunMsgItem.prototype.getId = function () {
        return this.id;
    };
    RunMsgItem.prototype.getWidth = function () {
        return this.lb_msg.width;
    };
    //消息对象移动
    RunMsgItem.prototype.run = function (spd) {
        if (this.bDie) {
            return;
        }
        //检查我当前跟随谁？
        // if( this.followId < 0 )
        // {
        //没有跟随谁，我是头，那么直接x移动
        this.x -= spd;
        // }else{
        //有跟随对象，那么我的坐标就是前一个的坐标+宽度
        // this.x = this.rmp.getRightOf(this.followId);
        // }
        //如果我的右侧坐标小于0了，那么要通知父级，重新调整跟随状态
        var rx = this.x + this.getWidth();
        if (rx <= 0) {
            // this.rmp.resetFollow(this.id);
            // this.destroy(true);
            // this.rmp.removeMsg(this);
            this.bDie = true;
        }
    };
    return RunMsgItem;
}(Laya.Sprite));
//# sourceMappingURL=RunMsgItem.js.map