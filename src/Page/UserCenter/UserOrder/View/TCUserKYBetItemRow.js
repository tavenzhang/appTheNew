'use strict';
/**
 * Created by Allen on 2016/12/10.
 */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {indexBgColor, Size, width} from '../../../resouce/theme';

export default class TCUserKYBetItemRow extends Component {

    render() {
        let {gameName, serverName, profit, gameEndTime} = this.props.orderData;
        return (
            <View>
                <View style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: indexBgColor.itemBg,
                }}>
                    <Text style={[styles.headerTitle, {width: width * 0.3}]}>{gameName}</Text>
                    <Text style={[styles.headerTitle, {width: width * 0.2}]}>{serverName}</Text>
                    <Text style={[styles.headerTitle, {width: width * 0.2}]}>{profit}</Text>
                    <Text style={[styles.headerTitle, {width: width * 0.3}]}>{gameEndTime.replace('T', '\n')}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: Size.font14,
        textAlign: 'center'
    }
});
