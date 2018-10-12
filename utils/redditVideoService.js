require("reddit.js");

module.exports = function RedditVideoService() {
  //private region

  var currentChannel = "aww";
  var currentPage = 0;

  var isVideoObject = function(child) {
    if (child.data.is_video === true) {
      return true;
    }
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

    // reddit video
    if (child.is_video) {
      result.videoUrl = child.media.reddit_video.fallback_url;
      result.type = "reddit";
      return result;
    }

    if (child.data.media === undefined) {
      return {};
    }

    // youtube video
    if (child.data.media.type.includes("youtube.com")) {
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
    if (child.data.media.type.includes("vimeo.com")) {
      result.videoUrl = "vimeo.com";
      result.type = "vimeo";
    }
    return result;
  };

  // public interface
  return {
    loadHot: function(channel, callback) {
      this.loadHotStartFrom(channel, null, callback);
    },
    loadHotStartFrom: function(channel, after, callback) {
      var query = reddit.hot(channel).limit(100);
      if (after != null) {
        query = query.after(after);
      }
      query.fetch(function(res) {
        var videos = res.data.children
          .filter(x => isVideoObject(x))
          .map(x => childObjectToDomainVideoModel(x));

        console.log("DEBUG: Reddit output START!!!");
        console.log(videos);
        console.log("DEBUG: Reddit output END!!!");
      });
    }
  };
};
