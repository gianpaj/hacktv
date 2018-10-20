import React, { PureComponent } from "react";
import { Animated, Text, View, WebView } from "react-native";
import YouTube from "react-native-youtube";
import PropTypes from "prop-types";

import styles from "../styles/SliderEntry.style";

import config from "../config";

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
    if (!this.props.data.isPlaying || !this.props.isActive) return null;

    // if (item.type !== "youtube") return null;
    return (
      // <WebView
      //   style={{ flex: 1 }}
      //   javaScriptEnabled={true}
      //   source={{
      //     uri: `https://www.youtube.com/embed/${
      //       item.videoUrl
      //     }?rel=0&autoplay=1&controls=0`
      //   }}
      // />
      <YouTube
        controls={2}
        apiKey={config.YOUTUBE_API}
        videoId={item.videoUrl}
        play // control playback of video with true/false
        // fullscreen // control whether the video should play in fullscreen or inline
        // loop // control whether the video should loop when ended

        // onReady={e => this.setState({ isReady: true })}
        // onChangeState={e => this.setState({ status: e.state })}
        // onChangeQuality={e => this.setState({ quality: e.quality })}
        // onError={e => this.setState({ error: e.error })}
        style={{ alignSelf: "stretch", flex: 1 }}
        resumePlayAndroid
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
    return (
      <View style={styles.slideInnerContainer}>
        <View style={styles.videoContainer}>
          {this.renderVideo(this.props.data)}
        </View>
        {/* {this.renderDescription()} */}
      </View>
    );
  }
}
