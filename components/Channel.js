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
    // console.log(videos.map(v => v.type));

    if (item.subreddit === "videos") videos[0].isPlaying = true;

    if (__DEV__) console.log({ channelName: item.subreddit, videos });

    this.setState({ videos, loading: false });
  }

  renderCell = ({ item }) => (
    <SliderEntry
      ref={instance => (this.child = instance)}
      onPause={this.onPause}
      onPlay={this.onPlay}
      data={item}
      isActive={this.props.isActive}
    />
  );

  onVideoOnScreen = slideIndex => {
    this.setState(prevState => {
      const videos = prevState.videos.map(video => {
        return { ...video, isPlaying: false };
      });
      videos[slideIndex].isPlaying = true;
      return { videos };
    });
    // this.child && this.child.onPlay();
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
          data={videos}
          enableSnap
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={this.renderCell}
          sliderHeight={slideHeight}
          sliderWidth={sliderWidth}
          useScrollView
          onSnapToItem={this.onVideoOnScreen}
          vertical
          shouldOptimizeUpdates
          removeclippedsubviews
          removeClippedSubviews
          initialNumToRender={2}
          windowSize={2}
        />
        <Animated.Text
          style={[
            styles.channelText,
            {
              opacity: this.state.fadeAnim,
              backgroundColor: item.bgColor || "red",
              color: item.textColor || "white"
            }
          ]}
        >
          #{item.title}
        </Animated.Text>
      </View>
    );
  }
}
