const axios = require("axios").default;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
// Mozilla/5.0 (iphone; cpu iphone os 13_2_3 like mac os x) applewebkit/605.1.15 (khtml, like gecko) mobile/9b206 micromessenger/8.0
let BASE_URL = process.env.DJ_URL || undefined;
class options {
  // eslint-disable-next-line
  options = {
    username: [],
  };
  url = {
    // 答题 [POST]
    exam: (username) =>
      `http://${BASE_URL}:8011/api/pub/wx/practice/subScore?userId=${username}&score=5`,
    // 获取用户的详细信息 [GET] [ type:json , name为用户姓名  ]
    userDetail: (username) =>
      `http://${BASE_URL}:8011/api/pub/wx/api/userDetail?userId=${username}`,
    // 分数 {"praMonth":10,"culDay":0,"praTotal":10,"praWeek":10,"culWeek":0,"culTotal":0,"culMonth":0,"praDay":5} praDay 为每日积分
    userScore: (username) =>
      `http://${BASE_URL}:8011/api/pub/wx/center/userScore?userId=${username}`,
    /*
     * @method GET
     * @param username {String} 通过username id信息获取课程列表
     */
    courseWare: (username) =>
      `http://${BASE_URL}:8011/api/pub/wx/study/courseWare?userId=${username}`,
    /*
     * @method POST
     */
    annex: () => `http://${BASE_URL}:8011/api/pub/wx/study/annex`,
    /*
     * 加入学习课程
     * @method GET
     */
    studyRecord: (username, courseWareId) =>
      `http://${BASE_URL}:8011/api/pub/wx/study/studyRecord?userId=${username}&courseWareId=${courseWareId}`,
    /*
     * 更新课程进度
     * @method POST
     */
    updateStudyRecord: (username, courseWareId, duration, schedule) =>
      `http://${BASE_URL}:8011/api/pub/wx/study/updateStudyRecord?userId=${username}&courseWareId=${courseWareId}&duration=${duration}&schedule=${schedule}&isDone=false`,
    /*
     * 结算分数
     * @method POST
     */
    studyScore: (username, courseWareId, duration, schedule) =>
      `http://${BASE_URL}:8011/api/pub/wx/study/studyScore?userId=${username}&courseWareId=${courseWareId}&duration=${duration}&schedule=${schedule}&isDone=false`,
  };
  constructor(usernames) {
    if (usernames == undefined || usernames == "") {
      $.msg("用户信息错误");
      throw new Error("参数失效");
    }
    if (usernames.indexOf("@") > -1) {
      this.options.username.push(...usernames.split("@"));
    } else {
      this.options.username.push(usernames);
    }
    $.log(`目前提供了${this.options.username.length}个账号`);
  }

  getUsername() {
    return this.options.username;
  }

  getUserDetail() {
    let usernameArray = [];
    usernameArray.push(
      ...this.getUsername().map((v) => {
        return {
          username: v,
          exam: this.url.exam(v),
          userDetail: this.url.userDetail(v),
          userScore: this.url.userScore(v),
          courseWare: this.url.courseWare(v),
          annex: this.url.annex(),
          studyRecord: (id) => this.url.studyRecord(v, id),
          updateStudyRecord: (id, duration, schedule) =>
            this.url.updateStudyRecord(v, id, duration, schedule),
          studyScore: (id, duration, schedule) =>
            this.url.studyScore(v, id, duration, schedule),
        };
      })
    );
    return usernameArray;
  }

  async getUserCourses(url, proxy = null) {
    return new Promise((resolve, reject) => {
      try {
        axios({
          url: url,
          method: "GET",
          headers: {
            "User-Agent": UA,
          },
          proxy,
        }).then((res) => {
          resolve(res.data);
        });
      } catch (e) {
        throw console.log(e);
      }
    });
  }
}

async function postExam(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "User-Agent": UA,
        },
        proxy,
        referrer: `http://${BASE_URL}:8010/`,
      });
      resolve();
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function getUserDetail(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "GET",
        headers: {
          "User-Agent": UA,
        },
        proxy,
      }).then((res) => {
        resolve(res.data["name"]);
      });
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function getUserScore(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "GET",
        headers: {
          "User-Agent": UA,
        },
        proxy,
      }).then((res) => {
        resolve(res.data);
      });
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function postResourceByVideoIds(url, videoIds, proxy = null) {
  let videoObj = videoIds.reduce((acc, curr) => ((acc[curr] = {}), acc), {});
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "User-Agent": UA,
        },
        proxy,
        data: videoObj,
        // referrer: "http://${BASE_URL}:8010/",
      }).then((res) => {
        resolve(res.data);
      });
    } catch (e) {
      throw console.log(e);
    }
  });
}

//通过用户ID获取课程列表
async function getUserCoursesById(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "GET",
        headers: {
          "User-Agent": options.UA,
        },
        proxy,
      }).then((res) => {
        return resolve(res.data);
      });
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function studyRecordById(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "GET",
        headers: {
          "User-Agent": UA,
        },
        proxy,
      }).then((res) => {
        return resolve(res.data);
      });
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function updateCourseSchedule(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "User-Agent": UA,
        },
        proxy,
        referrer: `http://${BASE_URL}:8010/`,
      });
      resolve();
    } catch (e) {
      throw console.log(e);
    }
  });
}

async function addStudyScore(url, proxy = null) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: url,
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "User-Agent": UA,
        },
        proxy,
        referrer: `http://${BASE_URL}:8010/`,
      });
      resolve();
    } catch (e) {
      throw console.log(e);
    }
  });
}
async function sleep(ms) {
  // add ms millisecond timeout before promise resolution
  return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = {
  UA,
  BASE_URL,
  sleep,
  options,
  getUserDetail,
  getUserScore,
  postResourceByVideoIds,
  getUserCoursesById,
  studyRecordById,
  updateCourseSchedule,
  addStudyScore,
  postExam,
};

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)} // eslint-disable-line
