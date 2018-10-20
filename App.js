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
import styles from "./styles/index.style";
import { channels } from "./static/entries";
// import { scrollInterpolators, animatedStyles } from "./utils/animations";
// import { Share } from 'react-native';

export default class example extends Component {
  constructor(props) {
    super(props);
    this.state = { channels };
  }

  onChannelChange = slideIndex => {
    this.setState(prevState => {
      const channels = prevState.channels.map(channel => {
        return { ...channel, isActive: false };
      });
      channels[slideIndex].isActive = true;
      return { channels };
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Carousel
          containerCustomStyle={styles.slider}
          data={this.state.channels}
          enableSnap
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={channel => (
            <Channel item={channel} isActive={channel.item.isActive} />
          )}
          onSnapToItem={this.onChannelChange}
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
