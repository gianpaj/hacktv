import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Video } from "expo";
import PropTypes from "prop-types";
import { ParallaxImage } from "react-native-snap-carousel";

import styles from "../styles/SliderEntry.style";

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object
  };

  get image() {
    const {
      data: { illustration },
      parallax,
      parallaxProps
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{ uri: illustration }}
        containerStyle={[styles.imageContainer]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor="rgba(0, 0, 0, 0.25)"
        {...parallaxProps}
      />
    ) : (
      <Video
        source={{
          uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
        }}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay={true}
        isLooping
        style={{ flex: 1 }}
        onLoadStart={() => console.log("onLoadStart")}
      />
    );
  }

  render() {
    const {
      data: { title, subtitle }
    } = this.props;

    const uppercaseTitle = title ? (
      <Text style={[styles.title]} numberOfLines={2}>
        {title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <View style={styles.slideInnerContainer}>
        {/* <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          alert(`You've clicked '${title}'`);
        }}
      > */}
        <View style={styles.shadow} />
        <View style={styles.imageContainer}>
          {this.image}
          <View style={styles.radiusMask} />
        </View>
        <View style={styles.textContainer}>
          {uppercaseTitle}
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        {/* </TouchableOpacity> */}
      </View>
    );
  }
}
