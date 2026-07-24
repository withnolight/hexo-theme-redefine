"use strict";

const { findSeriesPosts } = require("../utils/series");

hexo.extend.helper.register("getSeriesPosts", function (
  currentPost,
  posts,
  config = {},
) {
  return findSeriesPosts(currentPost?.series, posts, config);
});

hexo.extend.helper.register("getPostEditUrl", function (post, config = {}) {
  if (post?.post_edit === false || config.enable !== true) {
    return "";
  }

  if (typeof post?.post_edit === "string" && post.post_edit.trim()) {
    try {
      const target = new URL(post.post_edit.trim());
      return ["http:", "https:"].includes(target.protocol) ? target.href : "";
    } catch (error) {
      return "";
    }
  }

  const baseUrl = typeof config.url === "string" ? config.url.trim() : "";
  const source = typeof post?.source === "string" ? post.source : "";

  if (!baseUrl || !source) {
    return "";
  }

  try {
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const target = new URL(source.replace(/^\/+/, ""), normalizedBase);
    if (!["http:", "https:"].includes(target.protocol)) {
      return "";
    }
    return target.href;
  } catch (error) {
    return "";
  }
});
