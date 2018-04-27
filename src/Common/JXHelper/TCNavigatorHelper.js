/**
 * Created by Sam on 2017/1/5.
 * Copyright © 2016年 JX. All rights reserved.
 */
import Toast from '../JXHelper/JXToast'
import  InitHelper from './TCInitHelper'
import JXHelper from  './JXHelper'
import NavigationService from '../../Page/Route/NavigationService'
let initHelper = new InitHelper()
export default class Helper {
}

var navigator = null;

Helper.setNavigator = (args) => {
    navigator = args;
}

Helper.checkUserWhetherLogin = () => {
    if (TCUSER_DATA.username && TCUSER_DATA.islogin) return true
    return false
}

Helper.pushToBetHome = (rowData) => {
    NavigationService.pushToBetHome(rowData)
}

Helper.pushToBetBill = (title, gameName, cpInfoData, gameUniqueId) => {
    if (cpInfoData.rightData == null) {
        Toast.showShortCenter('网络连接似乎异常,稍后再试试')
        return
    }
    NavigationService.navigate("TCBetBill", {
        title: title,
        gameName: gameName,
        cpInfoData: cpInfoData,
        gameUniqueId: gameUniqueId
    });
}

Helper.pushToBetSucceed = ((data)=>{
    NavigationService.navigate("TCBillSucceedPage", {...data});
})

Helper.pushToIntelligenceBet = ((data)=>{
    NavigationService.navigate("IntelligenceBet", {...data});
})

Helper.pushToOrderRecord = (orderType) => {
    NavigationService.navigate("UserOderRecord", {initPage: orderType});
}

Helper.pushToLotteryHistoryList = (data) => {
    NavigationService.navigate("TCLotteryHistory", {...data});
}

//用户账户明细
Helper.pushToUserAccount = (accountType) => {
    NavigationService.navigate("UserAcount", {initPage: accountType});
}

Helper.pushToUserAcountDetail = (params) => {
    NavigationService.navigate("UserAcountDetail", params);
}

//用户充值提现
Helper.pushToUserPayAndWithDraw = (accountType) => {
    NavigationService.navigate("UserAcountPay", {accountType: accountType});
}

Helper.pushToPay = () => {
    if (initHelper.isGuestUser()) {
        Toast.showShortCenter('对不起，试玩账号不能进行存取款操作!')
        return
    }
    NavigationService.navigate("UserPay");
}

Helper.pushtoPromotion = () => {
    NavigationService.navigate("TCPromotionList");
}
Helper.pushToTopUp = () => {
    NavigationService.navigate("UserPay");
}

Helper.pushToUserLogin = (gotoCenter, userName, shouldReplace, isFromRegister) => {
    NavigationService.navigate("UserLogin", {
        gotoCenter: gotoCenter,
        userName: userName,
        isFromRegister: isFromRegister
    });
    TCPUSH_TO_LOGIN = true
    // if (navigator) {
    //     if (shouldReplace) {
    //         navigator.replace({
    //             name: 'userLogin',
    //             component: page,
    //             passProps: {gotoCenter: gotoCenter, userName: userName, isFromRegister: isFromRegister}
    //         });
    //     } else {
    //         if (routInStack('userLogin', navigator)) {
    //             navigator.pop();
    //         } else {
    //             navigator.push({
    //                 name: 'userLogin',
    //                 component: page,
    //                 passProps: {gotoCenter: gotoCenter, userName: userName}
    //             });
    //         }
    //     }
    // }
}

Helper.pushToUserRegister = (fromLoginToRegister) => {
    let registerURL = JXHelper.getWebUserRegister();
    if (registerURL && registerURL.length > 0 && navigator) {
        NavigationService.navigate("UserRegisterWeb", {fromLoginToRegister});
    } else {
        NavigationService.navigate("UserRegister")
    }
}

Helper.pushToForgetPwd = () => {
    NavigationService.navigate("UserForgotPassword");
}

Helper.pushToUserFreePlay = () => {
    let registerURL = JXHelper.getWebUserRegister()
    if (registerURL && registerURL.length > 0 && navigator) {
        NavigationService.navigate("UserRegisterWeb", {isGuest: true});
    } else {
        NavigationService.navigate("UserFreePlay", {gotoCenter: true});
    }
}


Helper.pushToAgentInroduce = () => {
    let res = JXHelper.getAgentInstruction()
    if (res) {
        Helper.pushToWebView(res, '代理说明')
    } else {
        Toast.showShortCenter("服务器异常，请稍后再试!")
    }
}

Helper.pushToUserTeamManager = (wantPopToN) => {
    NavigationService.navigate("AgentTeamList", {wantPopToN});
}

// 跳转到代理佣金页面
Helper.pushToAgentCommission = () => {
    NavigationService.navigate("AgentCommissionList");
}

Helper.pushToUserSheet = (isUserSheet, username, prizeGroup) => {
    NavigationService.navigate("AgentSheet", {
        isUserSheet,
        username,
        prizeGroup,
    });
}

// 跳转到反馈页面
Helper.pushToFeedback = () => {
    NavigationService.navigate("Feedback");
}

// 跳转到代理中心
Helper.pushToAgentCenter = () => {
    NavigationService.navigate("AgentCenter");
}

// 跳转到收藏界面
Helper.pushToUserCollect = () => {
    NavigationService.navigate("UserCollects");
}

// 跳转到消息列表界面
Helper.pushToMessagelist = () => {
    NavigationService.navigate("MessageList");
}

// 跳转到用户详情界面
Helper.pushToUserDetail = () => {
    NavigationService.navigate("UserDetailMsg");
}

// 跳转到安全中心
Helper.pushToUserSecurityCenter = () => {
    NavigationService.navigate("UserSecurityCenter");
}

Helper.pushToAddBank = () => {
    NavigationService.navigate("UserInfo");
}

// 跳转到修改用户登录密码页面
Helper.pushToModifyPassword = () => {
  NavigationService.navigate("ModifyPassword");
}

// 跳转到修改取款密码页面
Helper.pushToModifySecurityPwd = () => {
  NavigationService.navigate("ModifySecurityPwd");
}

// 跳转到银行卡管理页面
Helper.pushToUserBankManager = () => {
  if (!TCUSER_DATA.realname) {
    NavigationService.navigate("UserInfo");
  } else {
    NavigationService.navigate("UserBankManager");
  }
}

// 跳转到取款界面
Helper.pushToWithdraw = () => {
    if (initHelper.isGuestUser()) {
        Toast.showShortCenter('对不起，试玩账号不能进行存取款操作!')
        return
    }
    if (!TCUSER_DATA.realname) {
        NavigationService.navigate("UserInfo");
    } else {
        NavigationService.navigate("UserWithdraw");
    }
}

// 跳转到交易明细
Helper.pushToUserAccountCenter = () => {
    NavigationService.navigate("UserAccountCenter");
}

Helper.pushToWebView = (url, title) => {
    if (url && url.length > 0) {
        NavigationService.loadingWebViewWithUrl(url, title);
    }
}


Helper.gotoSetting = () => {
    NavigationService.navigate("UserSetting");
}

Helper.pushToFeedBack = () => {
    NavigationService.navigate("FeedbackList");
}


Helper.gotoProtocol = () => {
    NavigationService.navigate("UserProtocol");
}

Helper.gotoPCDD = (cpArray) => {
    NavigationService.navigate("PCDDShopping", {cpArray: cpArray});
}

Helper.pushToNotice = (announcement) => {
    NavigationService.navigate("TCNoticeDetail", {announcement: announcement});
}

Helper.pushToTopWinnerDetail = (target) => {
    NavigationService.navigate("TCTopWinnerDetail", {winnerTarget: target});
}

//代理
Helper.pushToAgentAddAccount = (fromTeamManager) => {
    NavigationService.navigate("AgentAddAccount", {isFromTeamManager: fromTeamManager});
}

// 红包相关
Helper.pushToRedPacket = () => {
    NavigationService.navigate("RedPacket");
}

Helper.pushToRedPacketMine = () => {
    NavigationService.navigate("RedPacketMine");
}

Helper.pushToRedPacketWinList = () => {
    NavigationService.navigate("RedPacketWinList");
}

Helper.pushToRedPacketRules = () => {
    NavigationService.navigate("RedPacketRules");
}

Helper.isTopPage = () => {
    return NavigationService.getRoutes().length === 1
}

Helper.popToBack = () => {
    NavigationService.goBack();
}

Helper.popToTop = () => {
    NavigationService.popToTop();
}

Helper.popN = (n) => {
    Helper.popToTop()
}

Helper.popToN = (n) => {
    Helper.popToTop()
}

function routInStack(routeName, navigator) {
    let routes = navigator.getCurrentRoutes()
    if (routes.length >= 2) {
        let lastRoute = routes[routes.length - 2]
        if (lastRoute.name === routeName) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }

}

module.exports = Helper

