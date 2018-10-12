import React, { Component } from "react";
import { View, ScrollView, Text, SafeAreaView } from "react-native";
import Carousel from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "./styles/SliderEntry.style";
import SliderEntry from "./components/SliderEntry";
import styles, { colors } from "./styles/index.style";
import { ENTRIES2 } from "./static/entries";
import { scrollInterpolators, animatedStyles } from "./utils/animations";

var redditVideoService = require('./utils/redditVideoService.js');


export default class example extends Component {
  _renderLightItem({ item, index }) {
    return <SliderEntry data={item} even={false} />;
  }

  customExample(refNumber, renderItemFunc) {
    const channel = "videos";

    // Do not render examples on Android; because of the zIndex bug, they won't work as is
    return (
      <View style={[styles.exampleContainer, styles.exampleContainerDark]}>
        <Text style={styles.title}>{`/r/${channel}`}</Text>
        <Carousel
          data={ENTRIES2}
          renderItem={renderItemFunc}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          scrollInterpolator={
            scrollInterpolators[`scrollInterpolator${refNumber}`]
          }
          slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
          useScrollView
        />
      </View>
    );
  }

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
    redditVideoService.loadHot("aww");

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* <StatusBar hidden /> */}
          {/* {this.gradient} */}
          <ScrollView
            style={styles.scrollview}
            scrollEventThrottle={200}
            directionalLockEnabled
          >
            {this.customExample(1, this._renderLightItem)}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
