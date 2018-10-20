/**
 * @format
 * @flow
 */
import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import Carousel from "react-native-snap-carousel";

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
  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background1, colors.background2]}
        startPoint={{ x: 1, y: 0 }}
        endPoint={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Carousel
          containerCustomStyle={styles.slider}
          data={channels}
          enableSnap
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={channel => (
            <Channel item={channel} isActive={channel.item.isActive} />
          )}
          onSnapToItem={this.onVideoOnScreen}
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
    );
  }
}
