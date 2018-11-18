/**
 * @format
 * @flow
 */
import React, { Component } from "react";
import { ActivityIndicator, View, SafeAreaView, StatusBar } from "react-native";
import Carousel from "react-native-snap-carousel";
import firebase from "react-native-firebase";

import {
  sliderWidth,
  slideHeight,
  itemWidth,
  itemHeight
} from "./styles/SliderEntry.style";
import Channel from "./components/Channel";
import styles, { colors } from "./styles/index.style";
import { channels } from "./static/entries";
// import { scrollInterpolators, animatedStyles } from "./utils/animations";
// import { Share } from 'react-native';

export default class example extends Component {
  channelRefs = {};
  state = { isLoading: true, channels: null, currentChannel: null };

  componentDidMount() {
    if (__DEV__) firebase.config().enableDeveloperMode();

    // return this.setState({ isLoading: false, channels });

    // Set default values
    firebase.config().setDefaults({ channels: JSON.stringify(channels) });

    firebase
      .config()
      .fetch(60) // 1 hour
      .then(() => firebase.config().activateFetched())
      .then(activated => {
        if (!activated && __DEV__) console.log("Fetched data not activated");
        return firebase.config().getValue("channels");
      })
      .then(snapshot => {
        const channels = JSON.parse(snapshot.val());

        // console.warn(channels);

        if (!__DEV__) firebase.analytics().setCurrentScreen(channels[0].title);
        // console.warn("setCurrentScreen: " + channels[0].title);

        this.setState({
          isLoading: false,
          channels,
          currentChannel: 0
        });
      })
      .catch(console.error);
  }

  onChannelSnap = i => {
    const newChannel = this.state.channels[i].title;
    if (!__DEV__) firebase.analytics().setCurrentScreen(newChannel);
    // console.warn(channels[i].title);
    this.channelRefs[this.state.currentChannel].pauseVideo();
    this.setState({ currentChannel: i });
    this.channelRefs[i].playVideo();
  };

  render() {
    if (this.state.isLoading)
      return (
        <ActivityIndicator
          size="large"
          style={{ flex: 1 }}
          color={colors.gray}
        />
      );

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar hidden />
          <Carousel
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            data={this.state.channels}
            enableSnap
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            renderItem={({ item, index }) => (
              <Channel
                ref={instance => (this.channelRefs[index] = instance)}
                item={item}
                isFirstChannel={index == 0}
              />
            )}
            onSnapToItem={this.onChannelSnap}
            sliderHeight={slideHeight}
            sliderWidth={sliderWidth}
            // useScrollView
            shouldOptimizeUpdates
            removeClippedSubviews
            initialNumToRender={2}
            windowSize={2}
            // loop
            // loopClonesPerSide={1}
          />
        </View>
      </SafeAreaView>
    );
  }
}
