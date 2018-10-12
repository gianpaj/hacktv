import { StyleSheet } from "react-native";

export const colors = {
  black: "#1a1917",
  gray: "#777"
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: {
    flex: 1
  },
  channelIcon: {
    alignSelf: "flex-start",
    top: 30,
    position: "absolute",
    left: 10,
    zIndex: 10,
    resizeMode: "contain",
    width: 30,
    height: 40,
    tintColor: "white"
  },
  channelText: {
    alignSelf: "flex-start",
    bottom: 20,
    position: "absolute",
    right: 2,
    paddingTop: 5,
    fontSize: 24,
    zIndex: 10,
    width: 30,
    color: "white"
  },
  slider: {
    // marginTop: 15,
    overflow: "visible" // for custom animations
  },
  sliderContentContainer: {
    // paddingVertical: 10 // for custom animation
  }
});
