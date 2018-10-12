import React, { Component } from "react";
import { View, ScrollView, Text, SafeAreaView } from "react-native";
import Carousel from "react-native-snap-carousel";

import { sliderWidth, itemWidth } from "./styles/SliderEntry.style";
import SliderEntry from "./components/SliderEntry";
import styles, { colors } from "./styles/index.style";
import { ENTRIES2 } from "./static/entries";
import { scrollInterpolators, animatedStyles } from "./utils/animations";

export default class example extends Component {
  renderCell({ item }) {
    return <SliderEntry data={item} even={false} />;
  }

  renderGrid(refNumber) {
    const channel = "videos";

    // Do not render examples on Android; because of the zIndex bug, they won't work as is
    return (
      <View style={[styles.exampleContainer, styles.exampleContainerDark]}>
        <Text style={styles.title}>{`/r/${channel}`}</Text>
        <Carousel
          data={ENTRIES2}
          renderItem={this.renderCell}
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
            {this.renderGrid(1)}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
