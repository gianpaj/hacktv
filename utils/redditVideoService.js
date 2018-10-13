require("reddit.js");

module.exports = function RedditVideoService() {
  var isVideoObject = function(child) {
    if (child.data.is_video === true) {
      return true;
    }
    // debug only - return only reddit videos
    // return false;

    if (child.data.media != null) {
      return (
        child.data.media.type.includes("youtube.com") ||
        child.data.media.type.includes("vimeo.com")
      );
    }
    return false;
  };
  var childObjectToDomainVideoModel = function(child) {
    var result = {};
    result.title = child.data.title;
    result.redditLink = "https://www.reddit.com" + child.data.permalink;

    if (child.data.preview && child.data.preview.images) {
      const images = child.data.preview.images[0].resolutions;
      result.posterSource = images[images.length - 1].url;
    }

    // reddit video
    if (child.data.is_video) {
      result.videoUrl = child.data.media.reddit_video.fallback_url;
      result.type = "reddit";
      return result;
    }

    if (child.data.media === undefined) {
      return {};
    }

    // youtube video
    if (child.data.media.type === "youtube.com") {
      var startIndex =
        child.data.media.oembed.html.indexOf("/embed/") + "/embed/".length;
      var endIndex = child.data.media.oembed.html.indexOf("?feature=oembed");

      result.videoUrl = child.data.media.oembed.html.substring(
        startIndex,
        endIndex
      );
      result.type = "youtube";
    }
    // vimeo video
    if (child.data.media.type === "vimeo.com") {
      result.videoUrl = "vimeo.com";
      result.type = "vimeo";
    }

    return result;
  };

  // public interface
  return {
    // loadHot: function(channel) {
    //   return this.loadHotStartFrom(channel, null);
    // },
    loadHot: function(channel, after) {
      return new Promise((result, reject) => {
        let query = reddit.hot(channel).limit(100);
        if (after !== null) query = query.after(after);

        query.fetch(res => {
          var videos = res.data.children
            .filter(x => isVideoObject(x))
            .map(x => childObjectToDomainVideoModel(x));

          result(videos);
        });
      });
    }
  };
};
