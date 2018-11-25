import React, { Component } from "react";
import { AsyncStorage, ActivityIndicator, Animated, View } from "react-native";
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
    removeCurrentVideo: false,
    snapping: false
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

    // let videos = [
    //   {
    //     title: "0",
    //     id: "9wimmn",
    //     redditLink:
    //       "https://www.reddit.com/r/videos/comments/9wimmn/detective_pikachu/",
    //     type: "youtube",
    //     videoUrl: "xU3BiUMUkc4",
    //     color: "yellow"
    //   },
    //   {
    //     title: "1",
    //     id: "9wilg6",
    //     redditLink:
    //       "https://www.reddit.com/r/videos/comments/9wilg6/weird_looking_cat/",
    //     type: "youtube",
    //     videoUrl: "GgWsADYJdpM",
    //     color: "blue"
    //   },
    //   {
    //     title: "2",
    //     id: "9wgwmm",
    //     redditLink:
    //       "https://www.reddit.com/r/videos/comments/9wgwmm/every_stan_lee_cameo/",
    //     type: "youtube",
    //     videoUrl: "6aXfFjvUgzM",
    //     color: "gray"
    //   },

    //   {
    //     title: "3",
    //     id: "9wgwmm",
    //     redditLink:
    //       "https://www.reddit.com/r/videos/comments/9wgwmm/every_stan_lee_cameo/",
    //     type: "youtube",
    //     videoUrl: "BTShgZxiNV8",
    //     color: "orange"
    //   }
    // ];
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
      this.markAsWatched();
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
      markAsWatched={this.markAsWatched}
    />
  );

  pauseVideo = index => {
    const { currentVideo } = this.state;
    const i = index || currentVideo;
    // console.log("pauseVideo", this.children[index].props.data.title);
    clearTimeout(this.timer);
    if (this.children[i]) this.children[i].onPause();
  };

  playVideo = index => {
    const { currentVideo } = this.state;
    const i = index !== null ? index : currentVideo;
    // console.log("playVideo", this.children[i].props.data.title);
    if (this.children[i]) {
      setTimeout(() => {
        this.children[i].onPlay();
      }, 100);
    }
  };

  // we have already switched to the following video
  onVideoOnScreen = async snappingToIndex => {
    const { currentVideo, removeCurrentVideo } = this.state;
    // console.log("snappingTo:", snappingToIndex);

    if (this.state.isSnapping) {
      // console.log("already snapping");
      return;
    }

    this.setState({ isSnapping: true });

    this.pauseVideo(currentVideo);
    let indexToPlay;
    if (removeCurrentVideo) {
      // console.log("removeCurrentVideo");
      await this.removeVideo(currentVideo);
      // console.log("removedIndex:", currentVideo);
      // up
      if (snappingToIndex - currentVideo < 0) {
        // console.log("snapToItem down:", snappingToIndex);
        this._carousel.snapToItem(snappingToIndex);
        indexToPlay = snappingToIndex;
        // this.playVideo(snappingToIndex);
      } else {
        // console.log("snapToItem up:", snappingToIndex - 1);
        this._carousel.snapToItem(snappingToIndex - 1);
        indexToPlay = snappingToIndex - 1;
        // this.playVideo(snappingToIndex - 1);
      }
      // this._carousel.triggerRenderingHack();
    } else {
      indexToPlay = snappingToIndex;
      // this.playVideo(snappingToIndex);
    }
    this.markToRemoveAfter(MARK_AS_WATCHED_AFTER);
    this.playVideo(indexToPlay);
    setTimeout(() => {
      this.setState({
        currentVideo: indexToPlay,
        removeCurrentVideo: false,
        isSnapping: false
      });
    }, 100);
  };

  onPlay = async () => {
    this.setState(
      { removeCurrentVideo: false, fadeAnim: new Animated.Value(1) },
      () =>
        Animated.timing(this.state.fadeAnim, {
          delay: fadeDelay,
          toValue: 0,
          duration: fadeDuration
        }).start()
    );
    this.markToRemoveAfter(MARK_AS_WATCHED_AFTER);
  };

  onPause = () => {
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: fadeDuration
      }).start()
    );
  };

  removeVideo = idx => {
    return new Promise((resolve, reject) => {
      this.children.splice(idx, 1);
      this.setState(prevState => {
        const copy = [...prevState.videos];
        copy.splice(idx, 1);
        resolve();
        return { videos: copy };
      });
    });
  };

  markAsWatched = async () => {
    const { videoUrl } = this.state.videos[this.state.currentVideo];
    const watchedArr = JSON.parse(await AsyncStorage.getItem("watched"));
    const uniqueArr = Array.from(new Set([...(watchedArr || []), videoUrl]));
    AsyncStorage.setItem("watched", JSON.stringify(uniqueArr));
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
        <Carousel
          ref={c => (this._carousel = c)}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          data={videos}
          // enableSnap // default
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={this.renderCell}
          // onScroll={e => console.log("onScroll")}
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
