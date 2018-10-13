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

const entryBorderRadius = 8;

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
    backgroundColor: colors.black,
    width: itemWidth,
    height: viewportHeight,
    paddingHorizontal: itemHorizontalMargin
  },
  videoContainer: {
    flex: 1,
    // marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: "white"
  },
  textContainer: {
    bottom: 0,
    position: "absolute",
    zIndex: 10,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .3)",
    flex: 1
  },
  textContainerEven: {
    backgroundColor: colors.black
  },
  title: {
    color: "rgba(255, 255, 255, .9)",
    fontSize: 13,
    fontWeight: "bold",
    // fontFamily: "OpenSans",
    padding: 10
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
