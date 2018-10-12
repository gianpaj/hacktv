import React, { PureComponent } from "react";
import { AppState, View, Text, WebView, TouchableOpacity } from "react-native";
import { Video } from "expo";
import PropTypes from "prop-types";
// import { ParallaxImage } from "react-native-snap-carousel";

import styles from "../styles/SliderEntry.style";

export default class SliderEntry extends PureComponent {
  videoRef;

  state = {
    appState: AppState.currentState,
    loading: true
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    parallax: PropTypes.bool
  };

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.videoRef && this.videoRef.pauseAsync();
  }

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
  };

  renderVideo = item => {
    const {
      // data: { illustration },
      parallax
    } = this.props;

    if (item.type == "youtube" && this.state.appState == "active") {
      return (
        <WebView
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          source={{
            uri: `https://www.youtube.com/embed/${
              item.videoUrl
            }?rel=0&autoplay=1&controls=0`
          }}
        />
      );
    }

    return (
      <Video
        ref={r => (this.videoRef = r)}
        source={{ uri: item.videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={true}
        isLooping={false}
        style={{ flex: 1 }}
        usePoster={item.posterSource || false}
        posterSource={{ uri: item.posterSource } || null}
        // onLoadStart={() => console.warn("onLoadStart")}
        onError={() => console.warn("onError")}
        // useNativeControls
      />
    );
  };

  render() {
    const { data } = this.props;

    return (
      <View style={styles.slideInnerContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.slideInnerContainer}
          onPress={async () => {
            const status = await this.videoRef.getStatusAsync();
            if (status.isPlaying) this.videoRef.pauseAsync();
            else this.videoRef.playAsync();
          }}
        >
          <View style={styles.imageContainer}>{this.renderVideo(data)}</View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {this.props.data.title}
            </Text>
            {/* <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
