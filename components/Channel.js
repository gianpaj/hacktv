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
  child;
  state = {
    loading: true,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    videos: []
  };

  async componentDidMount() {
    const { item } = this.props.item;
    const videos = await redditVideoService().loadHot(item.subreddit);

    if (__DEV__) console.log({ channelName: item.subreddit, videos: videos });

    this.setState({ videos, loading: false });
  }

  renderCell = ({ item }) => (
    <SliderEntry
      ref={instance => (this.child = instance)}
      onPause={this.onPause}
      onPlay={this.onPlay}
      data={item}
    />
  );

  onVideoOnScreen = () => {
    this.child && this.child.onPlay();
  };

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
        {/* <Text style={styles.channelText}>{item.title}</Text> */}
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
          onSnapToItem={this.onVideoOnScreen}
          vertical
          shouldOptimizeUpdates
          removeclippedsubviews
          removeClippedSubviews
          initialNumToRender={2}
          windowSize={2}
        />
        <Animated.Text
          style={[styles.channelText, { opacity: this.state.fadeAnim }]}
        >
          {item.title}
        </Animated.Text>
      </View>
    );
  }
}
