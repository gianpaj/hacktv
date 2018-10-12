import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors } from "../styles/index.style";

const IS_IOS = Platform.OS === "ios";
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
    width: itemWidth,
    height: viewportHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18
    // shadowColor: colors.black,
    // shadowOpacity: 0.25,
    // shadowOffset: { width: 0, height: 10 },
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: "white"
  },
  imageContainerEven: {
    backgroundColor: colors.black
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover"
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: entryBorderRadius,
    // backgroundColor: "white"
  },
  radiusMaskEven: {
    // backgroundColor: colors.black
  },
  textContainer: {
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, .0)"
  },
  textContainerEven: {
    backgroundColor: colors.black
  },
  title: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.5
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
