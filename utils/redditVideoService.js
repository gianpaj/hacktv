require("reddit.js");

module.exports = function RedditVideoService() {
  function isVideoObject({ data }) {
    // reddit videos
    if (data.is_video === true) {
      return true;
    }
    // debug only - return only reddit videos
    // return false;

    if (data.media !== null) {
      return (
        data.media.type.includes("youtube.com") ||
        data.media.type.includes("vimeo.com")
      );
    }
    return false;
  }

  function childObjectToDomainVideoModel({ data }) {
    const result = {};
    result.title = data.title;
    result.id = data.id;
    result.redditLink = "https://www.reddit.com" + data.permalink;
    result.created_utc = data.created_utc;

    if (data.preview && data.preview.images) {
      const images = data.preview.images[0].resolutions;
      result.posterSource = images[images.length - 1].url;
    }

    // reddit video
    if (data.is_video) {
      result.videoUrl = data.media.reddit_video.fallback_url;
      result.type = "reddit";
      return result;
    }

    // if (data.media === undefined) {
    //   return {};
    // }

    // youtube video
    if (data.media.type === "youtube.com") {
      var startIndex =
        data.media.oembed.html.indexOf("/embed/") + "/embed/".length;
      var endIndex = data.media.oembed.html.indexOf("?feature=oembed");

      result.videoUrl = data.media.oembed.html.substring(startIndex, endIndex);
      result.type = "youtube";
    }

    // vimeo video
    if (data.media.type === "vimeo.com") {
      result.videoUrl = "vimeo.com";
      result.type = "vimeo";
    }

    return result;
  }

  function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      const result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  function _loadHot(channel, after) {
    return new Promise((result, reject) => {
      if (typeof channel !== "string") {
        return reject(
          new Error("Bad channel argument value. Channel shuould be a string")
        );
      }
      let query = reddit.hot(channel).limit(100);
      if (after !== null) query = query.after(after);

      query.fetch(res => {
        const videos = res.data.children
          .filter(isVideoObject)
          .map(childObjectToDomainVideoModel)
          .filter(v => v.type === "youtube");

        result(videos);
      });
    });
  }

  /**
   * Get videos from a subreddit
   * @param {string} channel_s one or more channels - e.g. 'funny' or' 'funny;cool'
   * @param {*} after reddit id to load more videos
   */
  async function loadHot(channel_s, after) {
    // if only single channel
    if (channel_s === "string") {
      // just a single channel name passed - return videos for the channel
      return _loadHot(channel_s, after);
      // if it contains ';' then it should be converted into an array of strings
    }

    // TODO: implement "after" for multiple channels!!!
    channel_s = channel_s.split(";");
    const promises = channel_s.map(channel => _loadHot(channel));

    const arrayOfArrayOfVideos = await Promise.all(promises);
    return [].concat.apply([], arrayOfArrayOfVideos);
    // .sort(dynamicSort("created_utc"));
  }

  // public interface
  return {
    loadHot
  };
};
