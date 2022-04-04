require("dotenv").config();
const { HTTP_METHODS } = require("../common/constants");
const { isEmpty, holdOn } = require("../common/util.functions");
const needle = require("needle");

class TwitterStreamClass {
  constructor() {
    this.defaultHeaders = {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    this.baseURL = "https://api.twitter.com/2/tweets/search/stream";
  }

  addRule = (rule, isTest = false) => {
    const ruleArray = [{ value: rule }];
    const url = this.baseURL + `/rules?dry_run=${isTest}`;

    const addRulePromise = needle(
      HTTP_METHODS.POST,
      url,
      { add: ruleArray },
      { headers: this.defaultHeaders }
    );

    return addRulePromise;
  };

  getRules = (ids) => {
    let url = this.baseURL + "/rules";

    if (!isEmpty(ids)) url += `?ids=${ids}`;

    const getRulesPromise = needle(HTTP_METHODS.GET, url, {
      headers: this.defaultHeaders,
    });

    return getRulesPromise;
  };

  deleteRules = (idsArray) => {
    const url = this.baseURL + "/rules";
    const deleteRulesPromise = needle(
      HTTP_METHODS.POST,
      url,
      { delete: { ids: idsArray } },
      { headers: this.defaultHeaders }
    );

    return deleteRulesPromise;
  };

  streamTweets = (io) => {
    const streamUrl = this.baseURL + "?tweet.fields=public_metrics,created_at&expansions=author_id,attachments.media_keys&user.fields=name,username,profile_image_url&media.fields=url,alt_text,width,height";
    const stream = needle.get(streamUrl,
      {
        headers: {
          Authorization: this.defaultHeaders.Authorization,
        },
      }
    );

    stream
      .on("data", (data) => {
        try {
          const parsedData = JSON.parse(data);

          if (parsedData.connection_issue) {
            io.emit("error", "Trying to reconnect");
            this.reconnect(stream, io);
          } else if (parsedData.data) {
            io.emit("tweet", parsedData);
          } else {
            io.emit("error", "Something went wrong");
          }
        } catch (error) {}
      })
      .on("error", (error) => {
        io.emit("error", "Trying to reconnect");
        this.reconnect(stream, io);
      });
  };

  reconnect = async (stream, socket) => {
    stream.destroy();
    await holdOn(2000);
    this.streamTweets(socket);
  };
}

const TwitterStream = new TwitterStreamClass();

module.exports = TwitterStream;
