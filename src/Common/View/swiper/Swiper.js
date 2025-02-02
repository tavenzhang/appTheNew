/**
 * react-native-ezswiper
 * @author Zhu yangjun<zhuyangjun@gmail.com>
 * @url https://github.com/easyui/react-native-ezswiper
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableWithoutFeedback,
    ScrollView,
    Animated,
    InteractionManager,
    StyleSheet
} from 'react-native'

import DefaultViewPageIndicator  from"./DefaultViewPageIndicator"

export default class Swiper extends Component {
    /**
     | -------------------------------------------------------
     | EZSwiper component life
     | -------------------------------------------------------
     */
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        index: PropTypes.number,
        horizontal: PropTypes.bool,
        loop: PropTypes.bool,
        autoplayTimeout: PropTypes.number,
        autoplayDirection: PropTypes.bool,

        renderRow: PropTypes.func.isRequired,
        onPress: PropTypes.func,
        onWillChange: PropTypes.func,
        onDidChange: PropTypes.func,
    };

    static defaultProps = {
        index: 0,
        horizontal: true,
        loop: true,
        autoplayTimeout: 5,
        autoplayDirection: true,
    };

    constructor(props) {
        super(props);

        this.refScrollView = this.refScrollView.bind(this)
        this.getRenderRowViews = this.getRenderRowViews.bind(this)
        this.updateAnimated = this.updateAnimated.bind(this)
        this.autoPlay = this.autoPlay.bind(this)
        this.stopAutoPlay = this.stopAutoPlay.bind(this)

        const {dataSource, width, height, horizontal, index, loop, autoplayTimeout, autoplayDirection} = this.props;

        const side = horizontal ? width : height

        this.ezswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: side,
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
        }

        this.scrollIndex = (this.ezswiper.loop ? this.ezswiper.currentIndex + 1 : this.ezswiper.currentIndex)

        const scaleArray = [];
        const translateArray = [];
        for (let i = 0; i < this.ezswiper.count + 2; i++) {
            scaleArray.push(new Animated.Value(1));
            translateArray.push(new Animated.Value(0));
        }
        this.state = {scaleArray, translateArray, scrollValue: new Animated.Value(0), currentIndex: index};

        this.events = {
            renderRow: this.renderRow.bind(this),
            onPress: this.onPress.bind(this),
            onWillChange: this.onWillChange.bind(this),
            onDidChange: this.onDidChange.bind(this),
        };
    }

    componentWillUnmount() {
        this.stopAutoPlay()
    }

    componentWillReceiveProps(nextProps) {
        this.stopAutoPlay()
        const {dataSource, width, height, horizontal, index, loop, autoplayTimeout, autoplayDirection} = nextProps;

        const side = horizontal ? width : height
        this.ezswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: side,
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
        }

        this.scrollIndex = (this.ezswiper.loop ? this.ezswiper.currentIndex + 1 : this.ezswiper.currentIndex)

        if (this.props.dataSource.length !== dataSource.length) {
            const scaleArray = [];
            const translateArray = [];
            for (let i = 0; i < this.ezswiper.count + 4; i++) {
                scaleArray.push(new Animated.Value(1));
                translateArray.push(new Animated.Value(0));
            }
            this.setState({scaleArray, translateArray, currentIndex: index});
        }

    }

    componentDidMount() {
        setTimeout(() => {
            // InteractionManager.runAfterInteractions(() => {
                this.scrollView && this.scrollView.scrollTo({
                    [this.ezswiper.scrollToDirection]: (this.ezswiper.side * this.scrollIndex),
                    animated: false
                });
                this.updateAnimated(this.scrollIndex, this.scrollIndex)
                this.autoPlay()
                this.setState({initialized: true});
            // });
        }, 100);

    }


    /**
     | -------------------------------------------------------
     | public api
     | -------------------------------------------------------
     */
    scrollTo(index, animated = true) {
        this.scrollView && this.scrollView.scrollTo({
            [this.ezswiper.scrollToDirection]: this.ezswiper.side * index,
            animated: animated
        });
    }

    /**
     | -------------------------------------------------------
     | private api
     | -------------------------------------------------------
     */
    updateAnimated(currentPageFloat, scrollIndex) {
        const {scaleArray, translateArray} = this.state;
        for (let i = 0; i < this.ezswiper.count + 2; i++) {
            if (i === scrollIndex) {
                scaleArray[i].setValue(1);
                translateArray[i].setValue(0);
            } else if (i === scrollIndex - 1 || i === scrollIndex + 1) {
                scaleArray[i].setValue(1);
                translateArray[i].setValue(0);
            } else {
                scaleArray[i].setValue(1);
                translateArray[i].setValue(0);
            }
        }
    }

    refScrollView(view) {
        this.scrollView = view;
    }

    autoPlay() {
        this.stopAutoPlay()
        if (!this.ezswiper.loop || !this.ezswiper.autoplayTimeout) {
            return
        }

        this.autoPlayTimer = setTimeout(() => {
            this.scrollTo(this.scrollIndex + (this.ezswiper.autoplayDirection ? 1 : -1))
        }, this.ezswiper.autoplayTimeout * 1000)

    }

    scrollIndicator(scrollIndex) {
        let index = 0
        if (scrollIndex < this.ezswiper.count) {
            index = scrollIndex
        }
        this.setState({
            currentIndex: index
        })
    }

    stopAutoPlay() {
        this.autoPlayTimer && clearTimeout(this.autoPlayTimer)
    }

    /**
     | -------------------------------------------------------
     | EZSwiper events
     | -------------------------------------------------------
     */
    renderRow(obj, index) {
        if (typeof this.props.renderRow === 'function') {
            return this.props.renderRow(...arguments);
        }
    }

    onPress(obj, index) {
        if (typeof this.props.onPress === 'function') {
            return this.props.onPress(...arguments);
        }
    }

    onWillChange(obj, index) {
        if (typeof this.props.onWillChange === 'function') {
            return this.props.onWillChange(...arguments);
        }
    }

    onDidChange(obj, index) {
        if (typeof this.props.onDidChange === 'function') {
            return this.props.onDidChange(...arguments);
        }
    }

    /**
     | -------------------------------------------------------
     | ScrollView delegate
     | -------------------------------------------------------
     */
    onScroll(e) {
        if (this.scrollView) {
            this.stopAutoPlay()
            let offset = e.nativeEvent.contentOffset[this.ezswiper.scrollToDirection];
            if (this.ezswiper.loop) {
                if (Math.abs(offset - ((this.ezswiper.count + 1) * this.ezswiper.side)) < 20.1) {
                    offset = this.ezswiper.side
                    this.scrollView.scrollTo({[this.ezswiper.scrollToDirection]: offset, animated: false});
                } else if (Math.abs(offset) < 20.1) {
                    offset = this.ezswiper.side * this.ezswiper.count
                    this.scrollView.scrollTo({[this.ezswiper.scrollToDirection]: offset, animated: false});
                }
            }

            let currentPageFloat = offset / this.ezswiper.side;
            const currentPageInt = currentPageFloat % 1
            if (currentPageInt === 0 || currentPageInt >= 0.9) {
                currentPageFloat = Math.ceil(currentPageFloat)
                this.willIndex = undefined
                this.scrollIndex = currentPageFloat
                this.autoPlay()
            }


            const willIndex = Math.round(currentPageFloat);
            if (this.willIndex === undefined && willIndex !== this.scrollIndex) {
                this.willIndex = willIndex
                const dataSourceIndex = this.ezswiper.loop ? (this.willIndex + this.ezswiper.count - 1) % this.ezswiper.count : this.willIndex
                this.onWillChange(this.ezswiper.dataSource[dataSourceIndex], dataSourceIndex)
            }

            const oldIndex = this.ezswiper.currentIndex
            this.ezswiper.currentIndex = this.ezswiper.loop ? (this.scrollIndex + this.ezswiper.count - 1) % this.ezswiper.count : this.scrollIndex
            if (oldIndex !== this.ezswiper.currentIndex) {
                this.onDidChange(this.ezswiper.dataSource[this.ezswiper.currentIndex], this.ezswiper.currentIndex)
            }
            this.scrollIndicator(this.scrollIndex - 1)
            this.updateAnimated(currentPageFloat, this.scrollIndex);
        }
    }

    /**
     | -------------------------------------------------------
     | Render
     | -------------------------------------------------------
     */
    getRenderRowViews() {
        const {scaleArray, translateArray} = this.state;
        const {width, height} = this.props;

        const count = this.ezswiper.count + (this.ezswiper.loop ? 2 : 0);
        const margin = 0;
        const views = [];
        const maxIndex = this.ezswiper.count - 1

        for (let i = 0; i < count; i++) {
            const dataSourceIndex = this.ezswiper.loop ? (i + maxIndex) % this.ezswiper.count : i
            const currentItem = this.ezswiper.dataSource[dataSourceIndex]
            views.push(
                <View key={i} style={{flexDirection: this.ezswiper.horizontal ? 'row' : 'column'}}>
                    <View style={{
                        [this.ezswiper.horizontal ? 'width' : 'height']: margin,
                        backgroundColor: 'transparent'
                    }}/>
                    <TouchableWithoutFeedback onPress={() => this.events.onPress(currentItem, dataSourceIndex)}>
                        <Animated.View style={{
                            backgroundColor: 'transparent',
                            width: this.ezswiper.horizontal ? this.ezswiper.side : width,
                            height: this.ezswiper.horizontal ? height : this.ezswiper.side,
                            transform: [{[this.ezswiper.horizontal ? 'scaleY' : 'scaleX']: scaleArray[i]}, {[this.ezswiper.horizontal ? 'translateX' : 'translateY']: translateArray[i]}]
                        }}>
                            {this.events.renderRow(currentItem, dataSourceIndex)}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <View style={{
                        [this.ezswiper.horizontal ? 'width' : 'height']: margin,
                        backgroundColor: 'transparent'
                    }}/>
                </View>
            );
        }
        return views;
    }

    render() {
        return (
            <View style={[this.props.style, {overflow: 'hidden'}]}>
                <ScrollView
                    style={{backgroundColor: 'transparent', opacity: this.state.initialized ? 1 : 0}}
                    horizontal={this.ezswiper.horizontal}
                    pagingEnabled
                    ref={this.refScrollView}
                    onScroll={e => this.onScroll(e)}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onLayout={event => {
                        // event.nativeEvent.layout.width
                    }}
                >
                    {this.getRenderRowViews()}
                </ScrollView>
                <View style={styles.indicators}>
                    <DefaultViewPageIndicator pageCount={this.ezswiper.count} activePage={this.state.currentIndex}/>
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    indicators: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        height: 60
    },
});