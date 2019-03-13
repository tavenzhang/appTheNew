import { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, StyleSheet, View } from 'react-native';

import { ASSET_Images } from '../../../asset';
import { TCButtonImg } from '../../../../Common/View/button/TCButtonView';
import React from 'react';
import TCImage from '../../../../Common/View/image/TCImage';
import { MyAppName } from '../../../../config/appConfig';

export default class ShareBox extends Component {
    constructor(state) {
        super(state);
        this.onClickWechatShare = this.onClickWechatShare.bind(this);
        this.onClickWechatPyqShare = this.onClickWechatPyqShare.bind(this);
        this.state = {
            isWechatEnabled: false
        };
    }

    static propTypes = {
        isSelect: PropTypes.bool,
        onClose: PropTypes.func,
        data: PropTypes.any,
        isShow: PropTypes.any
    };

    static defaultProps = {
        isSelect: false,
        isShow: false
    };

    componentDidMount() {
        TN_IsWechatEnabled((isWechatEnabled) => {
            this.setState({ isWechatEnabled });
        });
    }

    onClickWechatShare() {
        TN_WechatShare('Wechat Share','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','Wechat Content');
    };

    onClickWechatPyqShare() {
        TN_WechatShareBoard('Wechat Shareboard','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','Wechat Content');
    };

    render() {
        let { onClose } = this.props;
        return this.state.isWechatEnabled ? (
            <View style={styles.container}>
                <TCImage source={ASSET_Images.gameShare.boxBg} />
                <TCButtonImg
                    imgSource={ASSET_Images.gameUI.btnClose}
                    onClick={onClose}
                    btnStyle={{ position: 'absolute', right: 0, top: 0 }}
                />
                <View
                    style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        left: 50,
                        top: 55
                    }}>
                    <TCButtonImg
                        imgSource={ASSET_Images.gameShare.btnWX}
                        onClick={this.onClickWechatShare}
                    />
                    <TCButtonImg
                        imgSource={ASSET_Images.gameShare.btPYQ}
                        onClick={this.onClickPYQSHare}
                        btnStyle={{ marginLeft: 20 }}
                    />
                </View>
            </View>
        ) : null;
    }

    // onSimpleShare = () => {
    //     Share.share({
    //         title: MyAppName,
    //         message: '快乐一起分享，大家一起来!'
    //     })
    //         .then(this.showResult)
    //         .catch((error) => this.setState({ result: 'error: ' + error.message }));
    // };

    showResult = (result) => {
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                this.setState({ result: 'shared with an activityType: ' + result.activityType });
            } else {
                this.setState({ result: 'shared' });
            }
        } else if (result.action === Share.dismissedAction) {
            this.setState({ result: 'dismissed' });
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    inputStyle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#efe8cd'
    },
    webView: {
        marginTop: 18,
        height: 250,
        width: 485,
        backgroundColor: 'transparent'
    }
});
