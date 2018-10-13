require("reddit.js");

module.exports = function RedditVideoService() {
  var isVideoObject = function (child) {
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
  var childObjectToDomainVideoModel = function (child) {
    var result = {};
    result.title = child.data.title;
    result.id = child.data.id;
    result.redditLink = "https://www.reddit.com" + child.data.permalink;
    result.created_utc = child.data.created_utc;

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
  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  var _loadHot = function (channel, after) {
    if (!(typeof channel === 'string' || channel instanceof String)) {
      throw new "Bad channel argument value. Channel shuould be a string";
    }

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

  // public interface
  return {
    loadHot: function (channels, after) {
      var channelsVideosPromises = [];
      //if only single channel or channels separated with ';' are passed
      if (typeof channels === 'string' || channels instanceof String) {
        // if it conatains ';' then it is should be converted into array of channels and processed as array
        if (channels.includes(';')) {
          channels = channels.split(';');
        } else {
          //just a single channel name passed - return videos for the channel
          return _loadHot(channels, after);
        }
      }

      if (Array.isArray(channels)) {
        var promises = [];
        for (var i = 0; i < channels.length; i++) {
          //todo implement "after" for multiple channels!!!
          promises.push(_loadHot(channels[i]));
        }
        return Promise.all(promises).then((arrayOfArrayOfVideos) => {
          return Array.prototype.concat.apply([], arrayOfArrayOfVideos).sort(dynamicSort("created_utc"));
        });
      }

      throw new "Bad channels argument value was passed. Channels should be a string (channel name) or array of string for  merging results from multiple channels";
    }
  };
};
