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
  channelText: {
    bottom: 15,
    fontWeight: "bold",
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: light,
    // position: "absolute",
    left: 10,
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
