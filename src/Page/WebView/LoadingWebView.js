import React, {Component} from 'react';

import {
    StyleSheet,
    View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {observer} from "mobx-react";

@observer
export default class LoadingWebView extends Component {

    constructor(state) {
        super(state)
        let {url} = this.props;
        this.state = {
            isHide: false,
            uri: url,
        }
        TW_LoaderOnValueJS = this.onLoadEvalueJS;
    }

    static defaultProps = {
        title: ''
    };

    componentWillMount() {

    }

    componentDidMount(): void {

    }


    render() {
        let newUrl = TW_Store.dataStore.targetAppDir + "/loading/loading.html";
        let myParam = "";

        let source = {
            file: newUrl,
            allowingReadAccessToURL: TW_Store.dataStore.targetAppDir,
            allowFileAccessFromFileURLs: TW_Store.dataStore.targetAppDir,
            param: myParam
        };
        if (!G_IS_IOS) {
            source = {
                uri: newUrl + `${myParam}`,
            };
        }

       /// let visible = TW_Store.gameUpateStore.isNeedUpdate||TW_Store.gameUpateStore.isAppDownIng
        let visible = TW_Store.gameUpateStore.isNeedUpdate
        if(!visible){
            return null;
        }
        let injectJs = `window.appData=${JSON.stringify({
            isApp: true,
        })},(function() {
          window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(data);
          };
        })()`
        TW_Log("targetAppDir----LoadingWebView-source=="+source);
        return (
            <View style={[styles.container,{width: TW_Store.appStore.screenW}]}>
                <WebView
                    ref="myWebView"
                    useWebKit={true}
                    automaticallyAdjustContentInsets={true}
                    allowsInlineMediaPlayback={true}
                    style={[styles.webView,{width: TW_Store.appStore.screenW}]}
                    source={source}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    // renderLoading={this.onRenderLoadingView}
                    startInLoadingState={false}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    onNavigationStateChange={this.onNavigationStateChange}
                    allowFileAccess={true}
                    injectedJavaScript={injectJs}
                    onError={this.onError}
                    onMessage={this.onMessage}
                    onLoadEnd={this.onLoadEnd}
                />
            </View>
        );
    }


    onMessage = (event) => {

        let message = null;
        try {
            message = JSON.parse(event.nativeEvent.data);
            if (message) {
                this.onMsgHandle(message);
            }
        } catch (err) {
            TW_Log("onMessage==========6=erro==" + err, event.nativeEvent);
        }
    }

    onMsgHandle = (message) => {
        TW_Log("onMessage====LoadingWebView=======" + this.constructor.name, message);
        let url = "";
        if (message && message.action) {
            switch (message.action) {
                case "Log":
                    // TW_Log("game---ct=="+message.ct,message.data);
                    break;
                case  "game_custom":
                    TW_Log("onMessage====LoadingWebView======TW_Store.gameUIStroe.showGusetView=", message);
                    TW_Store.gameUIStroe.showGusetView();
                    // TW_Store.gameUIStroe.isShowShare=!TW_Store.gameUIStroe.isShowShare
                    break;
            }
        }
    }

    handleUrl = (url) => {
        if (url && url.indexOf("../") > -1) {
            url = url.replace("../", "");
        }
        //  url = TW_Store.bblStore.homeDomain + "/" + url;
        return url
    }

    onLoadEnd=()=>{
        if(G_IS_IOS) {
            TW_SplashScreen_HIDE();
        }else{
            setTimeout(()=>{TW_SplashScreen_HIDE()},800);
        }
    }

    onError = (error) => {
        if (TW_Store.gameUpateStore.isNeedUpdate) {
            TW_Store.gameUpateStore.isNeedUpdate=false;
        }
    }

    onShouldStartLoadWithRequest = (event) => {
        return true;
    };

    onLoadEvalueJS = (data) => {
        let dataStr = JSON.stringify(data);
        dataStr = dataStr ? dataStr : "";

        if(this.refs.myWebView){
            TW_Log("downloadFile---onLoadEvalueJS--versionBBL---progress-TW_Store.gameUpateStore.isNeedUpdate=-",data);
            this.refs.myWebView.postMessage(dataStr, "*");
        }

        //this.refs.myWebView.evaluateJavaScript(`receivedMessageFromRN(${dataStr})`);
    }

    onNavigationStateChange = (navState) => {


    };


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
         zIndex:10002,
        height: SCREEN_H,
        width: SCREEN_W,
        backgroundColor: "black",
    },
    webView: {
        marginTop: 0,
        flex: 1,
        backgroundColor: "black",
    }
});
