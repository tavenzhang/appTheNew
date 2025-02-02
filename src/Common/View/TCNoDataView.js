import React, {Component,} from 'react'

import {View, StyleSheet, Text, TouchableOpacity,ScrollView, Image} from 'react-native'
import {common} from '../../Page/asset/images'
import {Size, width, height, indexBgColor, listViewTxtColor, buttonStyle} from '../../Page/asset/game/themeComponet'
import PropTypes from 'prop-types';
/**
 * 提示对话框
 */
export default class TCNoDataView extends Component {

    static propTypes = {
        titleTip:PropTypes.string,
        unNetwork:PropTypes.any,
        contentTip:PropTypes.any,
        gotoDoing:PropTypes.any,
        btnTxt:PropTypes.any
    }

    // 构造函数
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.titleTip
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.mainView}>
                    {/*{*/}
                        {/*this.props.unNetwork ? (<Image*/}
                            {/*source={common.noNet}*/}
                            {/*style={styles.imageStyle}/>) :*/}
                            {/*(<Image*/}
                                {/*source={common.noData}*/}
                                {/*style={styles.imageStyle}/>)*/}
                    {/*}*/}

                    <Text style={styles.txtTitleStyle}>{this.state.title}</Text>
                    <Text style={styles.txtContentStyle}>{this.props.contentTip}</Text>
                    {this.props.btnTxt ? (  <TouchableOpacity
                        style={styles.bottomBarButtonStyle}
                        onPress={()=> {
                            this.props.gotoDoing()
                        }}
                    >
                        <Text style={{color:buttonStyle.btnTxtColor, fontWeight: 'bold', fontSize: Size.default}}>
                            {this.props.btnTxt}
                        </Text>
                    </TouchableOpacity>) : null}
                </View>

            </ScrollView>
        )
    }

    _setTitle(title) {
        this.setState({
            title: title
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    }, imageStyle: {
        // marginTop: height * 0.2,
        marginTop:10,
        width: width * 0.3,
        height: height * 0.2,
        backgroundColor: "transparent",
    }, mainView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
    },
    bottomBarButtonStyle: {
        backgroundColor: "transparent",
        justifyContent: 'center',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderRadius: 4,
        padding: 10,
        width: width * 0.6,
        marginTop: 20
    }, txtTitleStyle: {
        fontSize: Size.large,
        color: '#ff002a',
        fontWeight: 'bold',
        marginTop: height*0.2
    }, txtContentStyle: {
        color: listViewTxtColor.content,
        fontSize: Size.default,
        marginTop: 5
    }
})