import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, TouchableHighlight } from "react-native";
import { Video } from "expo";
import PropTypes from "prop-types";
// import { ParallaxImage } from "react-native-snap-carousel";
import { channels, icons } from "../static/entries";
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
      // data: { illustration },
      parallax
    } = this.props;

    return (
        <Video
          ref={r => (this.videoRef = r)}
        source={{ uri: videoURL }}
          rate={1.0}
          volume={1.0}
        isMuted={false}
          resizeMode="cover"
          shouldPlay={true}
          isLooping={false}
          style={{ flex: 1 }}
        // onLoadStart={() => console.warn("onLoadStart")}
        />
      );
  };

  onShareBtnClick(videoUrl) {
    Share.share({
      message: '',
      url: videoUrl,
      title: 'Wow, did you see that?'
    }, {
        // Android only:
        dialogTitle: 'Share one more amazing video',
        // iOS only:
        excludedActivityTypes: []
      })
  };

  render() {
    const { data } = this.props;

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
            {this.renderVideo(data.videoUrl)}
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
