/**
 * @format
 * @flow
 */
import React, { Component } from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import Carousel from "react-native-snap-carousel";
import firebase from "react-native-firebase";

import {
  sliderWidth,
  slideHeight,
  itemWidth,
  itemHeight
} from "./styles/SliderEntry.style";
import Channel from "./components/Channel";
import styles, { colors } from "./styles/index.style";
import { channels } from "./static/entries";
// import { scrollInterpolators, animatedStyles } from "./utils/animations";
// import { Share } from 'react-native';

export default class example extends Component {
  componentDidMount() {
    firebase.analytics().setCurrentScreen(channels[0].title);
    // console.warn("setCurrentScreen: " + channels[0].title);
  }

  onChannelSnap = i => {
    firebase.analytics().setCurrentScreen(channels[i].title);
    // console.warn(channels[i].title);
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar hidden />
          <Carousel
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            data={channels}
            enableSnap
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            renderItem={channel => <Channel item={channel} />}
            onSnapToItem={this.onChannelSnap}
            sliderHeight={slideHeight}
            sliderWidth={sliderWidth}
            // useScrollView
            shouldOptimizeUpdates
            removeClippedSubviews
            removeclippedsubviews
            initialNumToRender={2}
            windowSize={2}
          />
        </View>
      </SafeAreaView>
    );
  }
}
