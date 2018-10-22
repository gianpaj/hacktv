# [Walnut](walnut.tv)

Always interesting videos.
[Android](https://play.google.com/store/apps/details?id=com.walnut.tv) and [iOS app](https://itunes.apple.com/us/app/walnut-tv/id1439048706?ls=1&mt=8).

[![download on the Play Store](https://thumbs.gfycat.com/UnnaturalHorribleCrossbill-size_restricted.gif)](https://play.google.com/store/apps/details?id=com.walnut.tv)

## Getting Started

This was a Expo React Native app, but because of a build issue we ejected the app and made the build locally. In the future we might remove the WebView for something like `react-native-youtube`.

### Prerequisites

- node 8+
- [react-native](https://facebook.github.io/react-native/docs/getting-started.html) (using _Building Projects with Native Code_)
- yarn
- Android Studio with Android SDK

_Only tested on macOS_

### Start development

1. Install the dependencies

```bash
yarn
```

2. Enter YouToube API key into `config.json`

```bash
cp config-example.json config.json
```

3. Start the Emulator/Simulator or connect your mobile phone to the computer.

4. Develop

```bash
react-native run-ios
# or
react-native run-android
```

5. Win! :tada:

## Make a Play Store release

1. Copy the `walnut.keystore` file to `android/app/`
2. Run

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Built With

- [react-native](https://facebook.github.io/react-native/) - A framework for building native apps using React
- [reddit.js](https://github.com/sahilm/reddit.js) - Reddit API wrapper for the browser

## Authors

- [gianpaj](https://github.com/gianpaj)
- [andreyk6](https://github.com/andreyk6)

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details -->

## Acknowledgments

- Thanks for UCU for organizing the [hackathon](https://www.facebook.com/events/271103630179568/)
