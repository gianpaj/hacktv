import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  // AppState,
  Text,
  TouchableOpacity,
  View,
  WebView
} from "react-native";
import PropTypes from "prop-types";

import styles from "../styles/SliderEntry.style";

const { width, height } = Dimensions.get("window");

function JStoInjectPlay() {
  // alert("injected");
  const state = player.getPlayerState();
  // paused || unstarted || ended || cued
  if (state == 2 || state == -1 || state == 0 || state == 5) {
    player.playVideo();
    // playing
  } else if (state == 1) {
    player.pauseVideo();
  }
}

export default class SliderEntry extends Component {
  videoRef;

  state = {
    // appState: AppState.currentState,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    playerStatus: -2
  };

  static propTypes = {
    data: PropTypes.object.isRequired
    // parallax: PropTypes.bool
  };

  componentDidMount() {
    // AppState.addEventListener("change", this._handleAppStateChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.fadeAnim !== this.state.fadeAnim) {
      return { fadeAnim: nextState.fadeAnim };
    }
    return false;
  }

  componentWillUnmount() {
    // AppState.removeEventListener("change", this._handleAppStateChange);
    // this.videoRef && this.videoRef.pauseAsync();
  }

  onPlay = () => {
    this.playVideo();

    // playing
    if (this.state.state == 1) {
      this.fadeOut();
      this.props.onPlay();
    }
  };

  // TODO: introduce delay for the first time the video starts playing
  fadeOut = (delay = 0) => {
    this.setState({ fadeAnim: new Animated.Value(1) }, () =>
      Animated.timing(this.state.fadeAnim, {
        delay,
        toValue: 0,
        duration: 1000
      }).start()
    );
  };

  fadeIn = () => {
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 1000
      }).start()
    );
  };

  onPause = () => {
    this.pauseVideo();
    this.fadeOut();
    this.props.onPause();
  };

  // _handleAppStateChange = nextAppState => {
  //   this.setState({ appState: nextAppState });
  // };

  onMessage(data) {
    data = JSON.parse(data);
    this.setState({ playerStatus: data });
    // ended
    if (data == 0) {
      this.props.onNext();
    }
    // playing
    if (data == 1) {
      this.fadeOut();
      this.props.onPlay();
    }
    // paused
    if (data == 2) {
      this.fadeIn();
    }
  }

  renderVideo = item => {
    return (
      <WebView
        ref={webview => (this.videoRef = webview)}
        style={{ flex: 1, borderWidth: 1, borderColor: "red" }}
        onMessage={event => this.onMessage(event.nativeEvent.data)}
        mediaPlaybackRequiresUserAction={false}
        source={{
          html: `<html>
            <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
            <body style="border: 0; width: 100%; margin: 0">
              <iframe id="existing-iframe-example"
                width="100%" height="${height}"
                allow="autoplay; fullscreen"
                src="https://www.youtube.com/embed/${
                  item.videoUrl
                  // "B7bqAsxee4I"
                }?enablejsapi=1&rel=0&autoplay=1&controls=1"
                frameborder="0"></iframe>
              <script>
              // 2. This code loads the IFrame Player API code asynchronously.
              var tag = document.createElement('script');

              tag.src = "https://www.youtube.com/iframe_api";
              var firstScriptTag = document.getElementsByTagName('script')[0];
              firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

              // 3. This function creates an <iframe> (and YouTube player)
              //    after the API code downloads.
              var player;
              var done = false;
              function onYouTubeIframeAPIReady() {
                player = new YT.Player('existing-iframe-example', {
                  events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                  }
                });
              }


              // 4. The API will call this function when the video player is ready.
              function onPlayerReady(event) {
                document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
                done = false;
                if (${this.props.isFirstChannel && this.props.isFirstVideo})
                event.target.playVideo();
              }

              // 5. The API calls this function when the player's state changes.
              //    The function indicates that when playing a video (state=1),
              //    the player should play for six seconds and then stop.

              function onPlayerStateChange(event) {
                //changeBorderColor(event.data);
                //if (event.data == YT.PlayerState.PLAYING && !done) {
                  window.postMessage(event.data);
                  //done = true;
                //}
              }
            </script>
            </body></html>`
        }}
        scrollEnabled={false} // ios
        allowsInlineMediaPlayback // ios
        // useWebKit // ios
      />
    );
  };

  renderDescription() {
    const { data } = this.props;

    return (
      <Animated.View
        style={[styles.textContainer, { opacity: this.state.fadeAnim }]}
      >
        <Text style={styles.title} numberOfLines={1}>
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

  playVideo = () => {
    this.videoRef.injectJavaScript(`player.playVideo()`);
  };

  pauseVideo = () => {
    this.videoRef.injectJavaScript(`player.pauseVideo()`);
  };

  render() {
    const { data } = this.props;

    if (data.type == "youtube") {
      return (
        <View style={styles.slideInnerContainer}>
          {this.renderDescription()}
          {this.renderVideo(data)}
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
