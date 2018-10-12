import { StyleSheet } from "react-native";

export const colors = {
  black: "#1a1917",
  gray: "#888888"
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
    top: 10,
    position: "absolute",
    left: 10,
    zIndex: 10,
    resizeMode: "contain",
    width: 50,
    height: 70,
    tintColor: "white"
  },
  slider: {
    // marginTop: 15,
    overflow: "visible" // for custom animations
  },
  sliderContentContainer: {
    // paddingVertical: 10 // for custom animation
  }
});
