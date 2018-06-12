import React, {Component,} from 'react'
import {
    View,
    StyleSheet,
    Linking,
    NativeModules,
    Text
} from 'react-native'

import {observer} from 'mobx-react/native'
import GamePage from "./GamePage";
import {indexBgColor, shoppingTxtColor, baseColor, Size} from "../../resouce/theme";
import TCNavigationBar from "../../../Common/View/TCNavigationBar";

import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import {config} from "../../../Common/Network/TCRequestConfig";
import NetUitls from "../../../Common/Network/TCRequestUitls";
import JDToast from "../../../Common/JXHelper/JXToast";

/**
 *电子游戏
 */
@observer
export default class DZGameListView extends Component {

    constructor(props){
        super(props);
        this.isReuesting=false ; //防止快速点击 产生多次请求
    }

    render() {
        return (
            <View style={JX_ThemeViewStyle.containView}>
                <TCNavigationBar
                    title={'游戏列表'}
                    needBackButton={true}
                    backButtonCall={JX_NavHelp.popToBack}
                />
                <ScrollableTabView
                    initialPage={0}
                    style={{backgroundColor: indexBgColor.itemBg, flex: 1}}
                    removeClippedSubviews={false}
                    tabBarUnderlineStyle={{backgroundColor: shoppingTxtColor.tabLine, height: 2}}
                    locked={false}
                    tabBarActiveTextColor={shoppingTxtColor.tabTitlePressed}
                    tabBarInactiveTextColor={shoppingTxtColor.tabTitleNormal}
                    tabBarTextStyle={{fontSize: Size.font15, fontWeight: 'normal'}}
                    renderTabBar={this.onTabBar}
                >
                    {
                        JX_Store.gameDZStore.gameData.map(item => {
                            return <GamePage tabLabel={item.name} onClickItem={this.onClickItem}
                                             datas={item.games}/>})
                    }
                </ScrollableTabView>
            </View>
        )
    }

    onTabBar = () => {
        return <ScrollableTabBar/>
    }

    componentWillMount() {
        let {gameData} = this.props.navigation.state.params
        JX_Store.gameDZStore.loadGames(gameData.gamePlatform)
    }

    onClickItem = (dataItem) => {
        //JX_NavHelp.pushView(JX_Compones.TCWebGameView,{gameId:dataItem.gameId,gameData,isDZ:true,title:dataItem.name})
        let {gameData} = this.props.navigation.state.params
        let bodyParam = {
            gameId: dataItem.gameId,
            access_token: TCUSER_DATA.oauthToken.access_token,
        }
        let url = config.api.gamesDZ_start + "/" + dataItem.gameId;
        if(!this.isReuesting)
        {
            this.isReuesting = true;
            NetUitls.getUrlAndParamsAndPlatformAndCallback(url, gameData.gamePlatform, bodyParam, (ret) => {
                this.isReuesting=false
                JXLog("DZGameListView-------getUrlAndParamsAndPlatformAndCallback--platForm==" + ret.content, ret)
                if (ret.rs) {
                    if (JX_PLAT_INFO.IS_IOS) {
                        Linking.openURL(ret.content.gameUrl);
                    } else {
                        NativeModules.JXHelper.openGameWebViewFromJs(ret.content.gameUrl, dataItem.name);
                    }
                } else {
                    JDToast.showLongCenter("游戏参数错误，请稍后再尝试!")
                }
            })
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: baseColor.mainBg
    },
})