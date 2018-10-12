import React, { Component } from "react";
import { View, Image, SafeAreaView, StatusBar } from "react-native";
import Carousel from "react-native-snap-carousel";

import {
  sliderWidth,
  slideHeight,
  itemWidth,
  itemHeight
} from "./styles/SliderEntry.style";
import SliderEntry from "./components/SliderEntry";
import styles, { colors } from "./styles/index.style";
import { channels, icons } from "./static/entries";
// import { scrollInterpolators, animatedStyles } from "./utils/animations";
import { Share } from 'react-native';

var redditVideoService = require("./utils/redditVideoService.js");

export default class example extends Component {
  renderCell = ({ item }) => <SliderEntry data={item} even={false} />;

  renderChannel = ({ item }) => {
    return (
      <View>
        <Image source={item.icon} style={styles.channelIcon} />
        <Carousel
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          data={[{}]}
          enableSnap
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={this.renderCell}
          sliderHeight={slideHeight}
          sliderWidth={sliderWidth}
          // useScrollView
          vertical
          shouldOptimizeUpdates
          removeclippedsubviews
          removeClippedSubviews
          initialNumToRender={1}
          windowSize={1}
        // scrollInterpolator={
        //   scrollInterpolators[`scrollInterpolator${refNumber}`]
        // }
        // slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
        />
      </View>
    );
  };

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
    redditVideoService().loadHot("aww", videos => {
      console.warn(videos);
    });

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar hidden />
          {/* {this.gradient} */}
          <Carousel
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            data={channels}
            enableSnap
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            renderItem={this.renderChannel}
            sliderHeight={slideHeight}
            sliderWidth={sliderWidth}
            // useScrollView
            shouldOptimizeUpdates
            initialNumToRender={1}
            windowSize={1}
            removeClippedSubviews
            removeclippedsubviews
          />
        </View>
      </SafeAreaView>
    );
  }
}
