import { StyleSheet } from "react-native";

export const colors = {
  black: "#1a1917",
  gray: "#777"
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black
  },
  channelIcon: {
    top: 30,
    position: "absolute",
    right: 10,
    zIndex: 10,
    resizeMode: "contain",
    width: 30,
    height: 40,
    tintColor: "white"
  },
  channelText: {
    bottom: 15,
    fontWeight: "bold",
    borderRadius: 5,
    position: "absolute",
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18
    // zIndex: 10,
  },
  slider: {
    // marginTop: 15,
    overflow: "visible" // for custom animations
  }
});
