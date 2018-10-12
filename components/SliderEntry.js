import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Video } from "expo";
import PropTypes from "prop-types";
import { ParallaxImage } from "react-native-snap-carousel";

import styles from "../styles/SliderEntry.style";

export default class SliderEntry extends PureComponent {
  videoRef;

  static propTypes = {
    data: PropTypes.object.isRequired,
    parallax: PropTypes.bool
  };

  componentWillUnmount() {
    this.videoRef.pauseAsync();
  }

  renderVideo = videoURL => {
    const {
      data: { illustration },
      parallax
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{ uri: illustration }}
        containerStyle={[styles.imageContainer]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor="rgba(0, 0, 0, 0.25)"
      />
    ) : (
      <Video
        ref={r => (this.videoRef = r)}
        source={{
          // uri: videoURL,
          uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
        }}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay={true}
        isLooping={false}
        style={{ flex: 1 }}
        // onLoadStart={() => console.warn("onLoadStart")}
      />
    );
  };

  render() {
    const {
      data: { title, videoURL }
    } = this.props;

    return (
      <View style={styles.slideInnerContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.slideInnerContainer}
          onPress={async () => {
            // this.videoRef &&
            const status = await this.videoRef.getStatusAsync();
            if (status.isPlaying) this.videoRef.pauseAsync();
            else this.videoRef.playAsync();
          }}
        >
          <View style={styles.shadow} />
          <View style={styles.imageContainer}>
            {this.renderVideo(videoURL)}
            <View style={styles.radiusMask} />
          </View>
          <View style={styles.textContainer}>
            {/* {uppercaseTitle} */}
            {/* <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
