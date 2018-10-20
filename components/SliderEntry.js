import React, { PureComponent } from "react";
import {
  Animated,
  // AppState,
  Text,
  TouchableOpacity,
  View,
  WebView
} from "react-native";
// import { Video } from "expo";
import PropTypes from "prop-types";
// import { ParallaxImage } from "react-native-snap-carousel";

import styles from "../styles/SliderEntry.style";

export default class SliderEntry extends PureComponent {
  videoRef;

  state = {
    // appState: AppState.currentState,
    finished: false,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    loading: true
  };

  static propTypes = {
    data: PropTypes.object.isRequired
    // parallax: PropTypes.bool
  };

  componentDidMount() {
    // AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener("change", this._handleAppStateChange);
    this.videoRef && this.videoRef.pauseAsync();
  }

  onPlay = () => {
    // FIXME: only for non-youtube videos
    this.videoRef && this.videoRef.playAsync();
    if (!this.state.loading) {
      this.setState({ fadeAnim: new Animated.Value(1) }, () =>
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 1000
        }).start()
      );
      this.props.onPlay();
    }
    if (this.state.finished) {
      this.videoRef.playFromPositionAsync(0);
    }
  };

  onPause = () => {
    // FIXME: only for non-youtube videos
    this.videoRef && this.videoRef.pauseAsync();
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 1000
      }).start()
    );
    this.props.onPause();
  };

  // _handleAppStateChange = nextAppState => {
  //   this.setState({ appState: nextAppState });
  // };

  renderVideo = item => {
    // const {
    //   data: { illustration },
    //   parallax
    // } = this.props;

    if (item.type !== "youtube") return null;
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
    /*
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
        // usePoster={item.posterSource ? true : false}
        // posterSource={{ uri: item.posterSource } || null}
        onLoadStart={() => this.setState({ loading: true })}
        onLoad={() => this.setState({ loading: false })}
        onPlaybackStatusUpdate={playbackStatus => {
          if (playbackStatus.isPlaying && this.state.loading) {
            this.setState({ loading: false }, () => {
              // FIXME: to fade in
              this.onPlay();
            });
          }

          if (playbackStatus.isBuffering) {
            // Update your UI for the buffering state
            // console.warn(playbackStatus);
          }

          // The player has just finished playing and will stop. Maybe you want to play something else?
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.warn("didJustFinish");
            this.setState({ finished: true });
          }
        }}
        onError={() => {
          this.onPause();
          this.setState({ loading: false });
        }}
        // useNativeControls
      />
    );
    */
  };

  onShareBtnClick(videoUrl) {
    Share.share(
      {
        message: "",
        url: videoUrl,
        title: "Wow, did you see that?"
      },
      {
        // Android only:
        dialogTitle: "Share one more amazing video",
        // iOS only:
        excludedActivityTypes: []
      }
    );
  }

  renderDescription() {
    const { data } = this.props;

    return (
      <Animated.View
        style={[
          styles.textContainer,
          { opacity: this.state.fadeAnim },
          data.subtitle ? { paddingBottom: 20 } : { paddingBottom: 10 }
        ]}
      >
        <Text style={styles.title} numberOfLines={2}>
          {data.title}
        </Text>
        {/* {data.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {data.subtitle}
          </Text>
        )} */}
      </Animated.View>
    );
  }

  render() {
    const { data } = this.props;

    if (data.type == "youtube") {
      return (
        <View style={styles.slideInnerContainer}>
          <View style={styles.videoContainer}>{this.renderVideo(data)}</View>
          {/* {this.renderDescription()} */}
        </View>
      );
    }

    return (
      <View style={styles.slideInnerContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.slideInnerContainer}
          onPress={async () => {
            if (!this.videoRef) return;
            const status = await this.videoRef.getStatusAsync();

            if (status.isPlaying) {
              return this.onPause();
            }
            this.onPlay();
          }}
        >
          <View style={styles.videoContainer}>{this.renderVideo(data)}</View>
          {this.renderDescription()}
        </TouchableOpacity>
      </View>
    );
  }
}
