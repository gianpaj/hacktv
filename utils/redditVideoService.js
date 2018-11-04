require("reddit.js");

const youtubeURL = "http://www.youtube.com/watch?v=";
const youtubeURLLength = youtubeURL.length;
const embedLength = "/embed/".length;

module.exports = function RedditVideoService() {
  function isVideoObject({ data }) {
    // reddit videos
    if (data.is_video === true) return true;

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
      const { oembed } = data.media;
      result.type = "youtube";

      if (oembed.url && oembed.url.indexOf(youtubeURL) === 0) {
        return (result.videoUrl = oembed.html.substring(youtubeURLLength));
      } else {
        const { html } = oembed;
        const startIndex = html.indexOf("/embed/") + embedLength;
        const endIndex = html.indexOf("?");
        result.videoUrl = html.substring(startIndex, endIndex);
      }
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
          new Error("Bad channel argument value. Channel should be a string")
        );
      }
      let query = reddit.hot(channel).limit(100);
      if (after !== null) query = query.after(after);

      query.fetch(
        res => {
          const videos = res.data.children
            .filter(isVideoObject)
            .map(childObjectToDomainVideoModel)
            .filter(v => v.type === "youtube");

          result(videos);
        },
        // err contains the error from Reddit
        err => reject(err)
      );
    });
  }

  /**
   * e.g.
   * arrayOfArrays =
   * [[1,2,3], [4,5,6,7,8], [9,10]]
   *
   * return
   * [1, 4, 9, 2, 5, 10, 3, 6, 7, 8]
   *
   * TODO: if we skipped the video of a channel the 2nd video
   */
  function getOneVideoOfEachChannel(arrayOfArrays) {
    // find the smallest amount of videos for every channel
    const leastAmountOfVids = Math.min.apply(
      null,
      arrayOfArrays.map(arr => arr.length)
    );

    if (arrayOfArrays.length === 1) {
      if (__DEV__) console.warn("skipping", arrayOfArrays[0]);
      return arrayOfArrays;
    }

    let videos = [];
    // get one video of each channel in rotation
    for (let i = 0; i < leastAmountOfVids; i++) {
      for (let j = 0; j < arrayOfArrays.length; j++) {
        const vid = arrayOfArrays[j][i];
        videos.push(vid);
      }
    }
    // get the rest of videos
    for (let k = 0; k < arrayOfArrays.length; k++) {
      const vid = arrayOfArrays[k].slice(leastAmountOfVids);
      videos.push(...vid);
    }

    return videos;
  }

  /**
   * Get videos from subreddit(s)
   *
   * @param {string} channel_s one or more channels - e.g. 'funny' or' 'funny;cool'
   * @param {*} after reddit id to load more videos
   */
  async function loadHot(channel_s, after) {
    // TODO: implement "after" for multiple channels
    channel_s = channel_s.split(";");
    // console.warn("fetching", channel_s.length, "channels");
    const promises = channel_s.map(channel => _loadHot(channel));

    const arrayOfArrayOfVideos = await Promise.all(promises);

    let videos = getOneVideoOfEachChannel(arrayOfArrayOfVideos);

    const uniq = {};
    // remove duplicate videos
    videos = videos.filter(
      arr => !uniq[arr.videoUrl] && (uniq[arr.videoUrl] = true)
    );

    return [].concat.apply([], videos);
    // .sort(dynamicSort("created_utc"));
  }

  // public interface
  return {
    loadHot
  };
};
