import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/index.style";

// const IS_IOS = Platform.OS === "ios";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideHeight = viewportHeight;
export const slideWidth = wp(100);
const itemHorizontalMargin = wp(0);
const itemVerticalMargin = wp(0);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const itemHeight = slideHeight + itemVerticalMargin * 2;

export default StyleSheet.create({
  shareButtonContainer: {
    width: 30,
    height: 50,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  shareIcon: {
    alignSelf: "flex-end",
    top: 10,
    position: "absolute",
    right: 15,
    zIndex: 10,
    resizeMode: "contain",
    width: 30,
    height: 50
  },
  slideInnerContainer: {
    // paddingHorizontal: itemHorizontalMargin
    flex: 1
  },
  videoContainer: {
    flex: 1
    // marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    // backgroundColor: "blue"
  },
  textContainer: {
    backgroundColor: "rgba(0, 0, 0, .8)",
    top: 0,
    height: 60,
    // justifyContent: "center",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 10
  },
  title: {
    // borderWidth: 1,
    // borderColor: "white",
    color: "rgba(255, 255, 255, .9)",
    fontSize: 17,
    fontWeight: "bold",
    // fontFamily: "OpenSans",
    padding: 10,
    width: "90%"
  },
  titleEven: {
    color: "white"
  },
  subtitle: {
    marginTop: 6,
    color: colors.gray,
    fontSize: 12,
    fontStyle: "italic"
  },
  subtitleEven: {
    color: "rgba(255, 255, 255, 0.7)"
  }
});
