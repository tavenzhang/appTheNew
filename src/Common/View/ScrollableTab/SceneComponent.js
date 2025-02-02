const React = require('react');
const ReactNative = require('react-native');
const {Component, } = React;
const {View, StyleSheet, } = ReactNative;

const StaticContainer = require('react-static-container');

const SceneComponent = (Props) => {
  const {shouldUpdated, ...props} = Props;
  return <View {...props}>
      <StaticContainer shouldUpdate={shouldUpdated}>
        {props.children}
      </StaticContainer>
  </View>;
};

module.exports = SceneComponent;
