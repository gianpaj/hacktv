import React, { Component } from "react";
import { ActivityIndicator, Animated, View, Text } from "react-native";
import Carousel from "react-native-snap-carousel";

import SliderEntry from "./SliderEntry";
import {
  sliderWidth,
  slideHeight,
  itemWidth,
  itemHeight
} from "../styles/SliderEntry.style";
import styles, { colors } from "../styles/index.style";

const redditVideoService = require("../utils/redditVideoService.js");

export default class Channel extends Component {
  state = {
    loading: true,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    videos: []
  };

  async componentDidMount() {
    const { item } = this.props.item;
    const videos = await redditVideoService().loadHot(item.subreddit);
    this.setState({ videos, loading: false });
  }

  renderCell = ({ item }) => (
    <SliderEntry
      onPause={this.onPause}
      onPlay={this.onPlay}
      data={item}
    />
  );


  onPlay = () => {
    this.setState({ fadeAnim: new Animated.Value(1) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: 2000
      }).start()
    );
  };

  onPause = () => {
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 2000
      }).start()
    );
  };

  render() {
    const { item } = this.props.item;
    const { videos, loading } = this.state;

    if (loading)
      return (
        <ActivityIndicator
          size="large"
          style={{ flex: 1 }}
          color={colors.gray}
        />
      );

    return (
      <View>
        {/* <Image source={item.icon} style={styles.channelIcon} /> */}
        {/* <Text style={styles.channelText}>{item.title}</Text> */}
        <Animated.Text
          style={[styles.channelText, { opacity: this.state.fadeAnim }]}
        >
          {item.title}
        </Animated.Text>
        <Carousel
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          data={videos}
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
          initialNumToRender={2}
          windowSize={2}
          // scrollInterpolator={
          //   scrollInterpolators[`scrollInterpolator${refNumber}`]
          // }
          // slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
        />
      </View>
    );
  }
}
