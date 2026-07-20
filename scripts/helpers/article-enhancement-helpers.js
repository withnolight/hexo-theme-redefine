"use strict";

const collectionToArray = (collection) => {
  if (Array.isArray(collection)) {
    return collection;
  }

  if (Array.isArray(collection?.data)) {
    return collection.data;
  }

  const items = [];
  if (collection && typeof collection.forEach === "function") {
    collection.forEach((item) => items.push(item));
  }
  return items;
};

const getDateValue = (post) => {
  const date = post?.date;

  if (date && typeof date.valueOf === "function") {
    return date.valueOf();
  }

  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortSeriesPosts = (posts, config = {}) => {
  const direction = Number(config.order) === -1 ? -1 : 1;
  const orderBy = config.order_by === "title" ? "title" : "date";

  return [...posts].sort((first, second) => {
    const firstValue = orderBy === "title"
      ? String(first.title || "").toLocaleLowerCase()
      : getDateValue(first);
    const secondValue = orderBy === "title"
      ? String(second.title || "").toLocaleLowerCase()
      : getDateValue(second);

    if (firstValue < secondValue) return -1 * direction;
    if (firstValue > secondValue) return direction;
    return 0;
  });
};

const findSeriesPosts = (seriesName, posts, config = {}) => {
  if (!seriesName) {
    return [];
  }

  const matches = collectionToArray(posts).filter(
    (post) => post?.series === seriesName && post?.layout !== false,
  );

  return sortSeriesPosts(matches, config);
};

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

module.exports = {
  collectionToArray,
  findSeriesPosts,
  sortSeriesPosts,
};
