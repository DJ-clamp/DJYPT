const url = require("url");
const { getVideoDurationInSeconds } = require("get-video-duration");
const { getAudioDurationInSeconds } = require("get-audio-duration");
const host = "http://www.ygjy.com.cn:8011/file/";
async function getVideoInfo(data, course, cb) {
  let filename = data.realName;
  if (filename.indexOf(".mp4") != -1) {
    isVideo = true;
  }
  let pathRAW = url.parse(
    `${host}` + encodeURI(isVideo ? "视频" : "音乐") + "/" + encodeURI(filename)
  ).href;
  data.videosrc = pathRAW;
  let seconds;
  if (isVideo) {
    seconds = await getVideoDurationInSeconds(pathRAW);
    console.log(seconds);
  } else {
    seconds = await getAudioDurationInSeconds(pathRAW);
  }
  data.courseId = (seconds / 60).toFixed(2);
  data.score = cb(data.courseId);
  return data;
}
module.exports = {
  getVideoInfo,
};
