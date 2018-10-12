import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import CarouselPager from "react-native-carousel-pager";

export default class App extends React.Component {
  componentDidMount() {
    // GET API for /videos
  }

  _renderFrame = i => {
    return (
      <ScrollView key={"page-" + i}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
            borderRadius: 2
          }}
        >
          <TouchableOpacity
            onPress={() => this.horizontalCarousel.goToPage((i + 1) % 5)}
          >
            <Text style={{ color: "#666", fontSize: 60, fontWeight: "bold" }}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <CarouselPager
          ref={ref => (this.carousel = ref)}
          initialPage={2}
          pageStyle={{ backgroundColor: "#fff" }}
        >
          <View key={"page0"}>
            <Text>page0</Text>
          </View>
          <View key={"page1"}>
            <Text>page1</Text>
          </View>
          <View key={"page2"}>
            <Text>page2</Text>
          </View>
          <View key={"page3"}>
            <Text>page3</Text>
          </View>
        </CarouselPager>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: "#369"
          }}
        >
          <CarouselPager
            ref={ref => (this.verticalCarousel = ref)}
            vertical={true}
            deltaDelay={10}
            pageStyle={{
              backgroundColor: "#fff",
              padding: 30
            }}
          >
            {this._renderFrame(0)}
          </CarouselPager>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center"
  }
});
