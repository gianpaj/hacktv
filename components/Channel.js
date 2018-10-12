import React, { Component } from "react";
import { ActivityIndicator, View, Text, Image } from "react-native";
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
    videos: []
  };

  async componentDidMount() {
    const { item } = this.props.item;
    const videos = await redditVideoService().loadHot(item.title);
    this.setState({ videos, loading: false });
  }

  renderCell = ({ item }) => <SliderEntry data={item} even={false} />;

  render() {
    const { item } = this.props.item;
    const { videos, loading } = this.state;

    if (!videos.length) return null;
    else if (loading)
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
        <Text style={styles.channelText}>{item.index + 1}</Text>
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
