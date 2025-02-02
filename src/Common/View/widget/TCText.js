'use-strict';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {baseColor, Size} from "../../../Page/asset/game/themeComponet";

/**
 * 自定义Text，兼容IOS文本不居中
 * @author: Mason
 */
export default class TCText extends React.Component {

    render() {
        const {text, textStyle, backgroundStyle, borderRadius, onPress} = this.props
        const bgStyle = [styles.defaultBackground, backgroundStyle, {borderRadius}]
        const txtStyle = [styles.defaultText, textStyle]
        if (onPress) {
            return (
                <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                    <View style={bgStyle}>
                        <Text style={txtStyle}>{text}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {

            return (<View style={bgStyle}>
                <Text style={txtStyle}>{text}</Text>
            </View>)
        }
    }
}

TCText.propTypes = {
    text: PropTypes.string.isRequired,
    textStyle: PropTypes.any,
    backgroundStyle: PropTypes.any,
    borderRadius: PropTypes.number,
    onPress: PropTypes.func,
}

const styles = StyleSheet.create({
    defaultText: {
        color: baseColor.tabUnSelectTxt,
        fontSize: Size.default,
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    defaultBackground: {
        //alignItems: 'center',
       // justifyContent: 'center',
        backgroundColor: baseColor.tabBarBg,
    }
})
