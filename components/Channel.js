import React, { Component } from "react";
import {
  AsyncStorage,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import Carousel from "react-native-snap-carousel";

import SliderEntry from "./SliderEntry";
import {
  sliderWidth,
  slideHeight,
  itemWidth,
  itemHeight,
  fadeDuration,
  fadeDelay
} from "../styles/SliderEntry.style";
import styles, { colors } from "../styles/index.style";
import PropTypes from "prop-types";

const redditVideoService = require("../utils/redditVideoService.js");

const MARK_AS_WATCHED_AFTER = 3 * 1000;

export default class Channel extends Component {
  _carousel;
  timer;
  children = [];
  state = {
    currentVideo: 0,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    isLoading: true,
    videos: [],
    removeCurrentVideo: false
  };

  static propTypes = {
    item: PropTypes.object.isRequired,
    isFirstChannel: PropTypes.bool.isRequired
  };

  async componentDidMount() {
    const { item } = this.props;

    let videos = await redditVideoService().loadHot(
      item.subreddit,
      item.minNumOfVotes
    );
    // await AsyncStorage.clear();

    // console.warn(item.subreddit);
    // console.warn(videos.map(v => v.title));

    // if (item.title == "general") {
    //   console.log(videos.map(v => ({ title: v.title, videoUrl: v.videoUrl })));
    // }

    const watchedArr = JSON.parse(await AsyncStorage.getItem("watched"));
    if (watchedArr && watchedArr.length)
      videos = videos.filter(v => watchedArr.indexOf(v.videoUrl) < 0);

    if (__DEV__) console.log({ title: item.title, videos });

    this.setState({
      videos,
      isLoading: false
    });
  }

  markToRemoveAfter(millis) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // console.log("markToRemoveAfter");
      this.setState({ removeCurrentVideo: true });
      // this.markAsWatched();
    }, millis);
  }

  // when video ended
  onNext = () => {
    this.removeVideo(this.state.currentVideo);
    this._carousel.snapToNext();
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderCell = ({ item, index }) => (
    <SliderEntry
      ref={instance => (this.children[index] = instance)}
      onPause={this.onPause}
      onPlay={this.onPlay}
      onNext={this.onNext}
      data={item}
      isFirstVideo={index == 0}
      isFirstChannel={this.props.isFirstChannel}
    />
  );

  pauseCurrentVideo = () => {
    const { currentVideo } = this.state;
    this.children[currentVideo] && this.children[currentVideo].onPause();
  };

  playCurrentVideo = () => {
    const { currentVideo } = this.state;
    this.children[currentVideo] && this.children[currentVideo].onPlay();
  };

  // we have already switched to the following video
  onVideoOnScreen = async snappingToIndex => {
    const { currentVideo, removeCurrentVideo } = this.state;
    // console.log("snappingTo:", snappingToIndex);

    this.children[currentVideo] && this.children[currentVideo].onPause();
    if (removeCurrentVideo) {
      this.removeVideo(currentVideo);
      // console.log("removedIndex:", currentVideo);
      // up
      if (snappingToIndex - currentVideo < 0) {
        // console.log("snapToItem down:", snappingToIndex);
        this._carousel.snapToItem(snappingToIndex);
        this.children[snappingToIndex] &&
          this.children[snappingToIndex].onPlay();
      } else {
        // console.log("snapToItem up:", snappingToIndex - 1);
        this._carousel.snapToItem(snappingToIndex - 1);
        this.children[snappingToIndex - 1] &&
          this.children[snappingToIndex - 1].onPlay();
      }
      // this._carousel.triggerRenderingHack();
    } else {
      this.children[snappingToIndex].onPlay();
    }
    this.markToRemoveAfter(MARK_AS_WATCHED_AFTER);
    this.setState({ currentVideo: snappingToIndex, removeCurrentVideo: false });
  };

  onPlay = async () => {
    this.setState({ removeCurrentVideo: false });
    this.setState({ fadeAnim: new Animated.Value(1) }, () =>
      Animated.timing(this.state.fadeAnim, {
        delay: fadeDelay,
        toValue: 0,
        duration: fadeDuration
      }).start()
    );
    this.markToRemoveAfter(MARK_AS_WATCHED_AFTER);
  };

  removeVideo = idx => {
    this.children.splice(idx, 1);

    this.setState(prevState => {
      const copy = [...prevState.videos];
      copy.splice(idx, 1);
      return { videos: copy };
    });
  };

  markAsWatched = async () => {
    const { videoUrl } = this.state.videos[this.state.currentVideo];
    const watchedArr = JSON.parse(await AsyncStorage.getItem("watched"));
    const uniqueArr = Array.from(new Set([...(watchedArr || []), videoUrl]));
    AsyncStorage.setItem("watched", JSON.stringify(uniqueArr));
  };

  onPause = () => {
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: fadeDuration
      }).start()
    );
    // clearTimeout(this.timer);
  };

  render() {
    const { item } = this.props;
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
          // enableSnap // default
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={this.renderCell}
          sliderHeight={slideHeight}
          sliderWidth={sliderWidth}
          // useScrollView
          onSnapToItem={this.onVideoOnScreen}
          vertical
          // shouldOptimizeUpdates // default
          removeClippedSubviews
          initialNumToRender={2}
          windowSize={2}
        />
        <Animated.Text
          style={[
            styles.channelText,
            {
              opacity: this.state.fadeAnim,
              backgroundColor: item.bgColor || colors.black,
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
