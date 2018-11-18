import React, { PureComponent } from "react";
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

import styles, { fadeDuration, fadeDelay } from "../styles/SliderEntry.style";

const { height } = Dimensions.get("window");

export default class SliderEntry extends PureComponent {
  videoRef;

  state = {
    // appState: AppState.currentState,
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 1
    playerStatus: -2
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    isFirstChannel: PropTypes.bool.isRequired,
    isFirstVideo: PropTypes.bool.isRequired,
    onNext: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired
  };

  componentDidMount() {
    // AppState.addEventListener("change", this._handleAppStateChange);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.fadeAnim !== this.state.fadeAnim) {
  //     return { fadeAnim: nextState.fadeAnim };
  //   }
  //   return false;
  // }

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
  fadeOut = () => {
    this.setState({ fadeAnim: new Animated.Value(1) }, () =>
      Animated.timing(this.state.fadeAnim, {
        delay: fadeDelay,
        toValue: 0,
        duration: fadeDuration
      }).start()
    );
  };

  fadeIn = () => {
    this.setState({ fadeAnim: new Animated.Value(0) }, () =>
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: fadeDuration
      }).start()
    );
  };

  onPause = () => {
    this.pauseVideo();
    this.fadeIn();
    this.props.onPause();
  };

  // _handleAppStateChange = nextAppState => {
  //   this.setState({ appState: nextAppState });
  // };

  onMessage(data) {
    data = parseInt(data);
    this.setState({ playerStatus: data });

    switch (data) {
      case 0:
        // ended
        this.props.onNext();
        break;
      case 1:
        // playing
        this.fadeOut();
        this.props.onPlay();
        break;
      case 2:
        // paused
        this.fadeIn();
        this.props.onPause();
        break;

      default:
        break;
    }
  }

  renderVideo = item => {
    return (
      <WebView
        ref={webview => (this.videoRef = webview)}
        style={{ flex: 1 }}
        onMessage={event => this.onMessage(event.nativeEvent.data)}
        mediaPlaybackRequiresUserAction={false}
        source={{
          html: `<html>
            <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
            <body style="border: 0; width: 100%; margin: 0; background-color: black">
              <iframe id="existing-iframe-example"
                width="100%" height="${height}"
                allow="autoplay;"
                src="https://www.youtube.com/embed/${
                  item.videoUrl
                }?enablejsapi=1&rel=0&autoplay=1&controls=1&playsinline=1"
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
              function onYouTubeIframeAPIReady() {
                player = new YT.Player('existing-iframe-example', {
                  events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                  }
                });
              }

              // 4. The API will call this function when the video player is ready.
              function onPlayerReady(event) {
                if (${this.props.isFirstChannel && this.props.isFirstVideo})
                  event.target.playVideo();
              }

              // 5. The API calls this function when the player's state changes.
              function onPlayerStateChange(event) {
                window.postMessage(event.data);
              }

              function onPlayerError() {
                window.postMessage(0);
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

  renderSquare(data) {
    return <View style={{ backgroundColor: data.color, flex: 1 }} />;
  }

  render() {
    const { data } = this.props;

    if (data.type == "youtube") {
      return (
        <View style={styles.slideInnerContainer}>
          {this.renderDescription()}
          {/* {this.renderSquare(data)} */}
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
