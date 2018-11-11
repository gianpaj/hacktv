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
import PropTypes from "prop-types";

const redditVideoService = require("../utils/redditVideoService.js");

export default class Channel extends Component {
  _carousel;
  children = {};
  state = {
    isLoading: true,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    videos: [],
    prevVideo: null,
    currentVideo: null
  };

  static propTypes = {
    item: PropTypes.object.isRequired,
    isFirstChannel: PropTypes.bool.isRequired
    // parallax: PropTypes.bool
  };

  async componentDidMount() {
    const { item } = this.props.item;

    const videos = await redditVideoService().loadHot(
      item.subreddit,
      item.minNumOfVotes
    );
    // console.warn(item.subreddit);
    // console.warn(videos.map(v => v.title));

    // if (item.title == "general") {
    //   console.log(videos.map(v => ({ title: v.title, videoUrl: v.videoUrl })));
    // }

    if (__DEV__) console.log({ title: item.title, videos });

    const firstVideo = videos[0].videoUrl;

    this.setState({
      videos,
      isLoading: false,
      currentVideo: firstVideo
    });
  }

  onNext = () => this._carousel.snapToNext();

  renderCell = ({ item }) => {
    const { videos } = this.state;

    return (
      <SliderEntry
        ref={instance => (this.children[item.videoUrl] = instance)}
        onPause={this.onPause}
        onPlay={this.onPlay}
        onNext={this.onNext}
        data={item}
        isFirstVideo={item.videoUrl == videos[0].videoUrl}
        isFirstChannel={this.props.isFirstChannel}
      />
    );
  };

  pauseCurrentVideo = () => {
    const { currentVideo } = this.state;
    this.children[currentVideo] && this.children[currentVideo].onPause();
  };

  playCurrentVideo = () => {
    const { currentVideo } = this.state;
    this.children[currentVideo] && this.children[currentVideo].onPlay();
  };

  onVideoOnScreen = i => {
    const currentVideo = this.state.videos[i].videoUrl;

    this.setState(prevState => {
      const prevVideo = prevState.currentVideo;
      this.children[prevVideo] && this.children[prevVideo].onPause();
      this.children[currentVideo] && this.children[currentVideo].onPlay();
      return { prevVideo, currentVideo };
    });
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
    const { videos, isLoading } = this.state;

    if (isLoading)
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
          ref={c => (this._carousel = c)}
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
          style={[
            styles.channelText,
            {
              opacity: this.state.fadeAnim,
              // backgroundColor: item.bgColor || "red",
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
