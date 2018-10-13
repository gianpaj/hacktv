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
    top: 10,
    position: "absolute",
    left: 10,
    paddingTop: 5,
    fontSize: 18,
    zIndex: 10,
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
