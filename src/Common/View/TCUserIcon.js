import React, {Component,} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Size} from '../../Page/asset/game/themeComponet';

export default class TCUserIcon extends Component {
    // static propTypes = {
    //     style: View.propTypes.style,
    //     textStyle: View.propTypes.style,
    //     text: PropTypes.string,
    // }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: this.props.bgColor}, this.props.style]}>
                <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: TCLineW,
        borderColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: Size.font25,
        fontWeight: 'bold',
        color: 'white'
    },
})
