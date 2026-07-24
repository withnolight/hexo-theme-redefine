"use strict";

const { findSeriesPosts } = require("../helpers/article-enhancement-helpers");
const { html } = require("../utils/html");

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const renderSeries = function (args) {
  const config = hexo.theme.config.articles?.series || {};
  if (config.enable !== true) {
    hexo.log.warn("Series tag is disabled in theme config: articles.series.enable");
    return "";
  }

  const requestedSeries = args.join(" ").trim();
  const seriesName = requestedSeries || this.series;
  if (!seriesName) {
    hexo.log.warn("Series tag requires a series name or `series` front-matter");
    return "";
  }

  const posts = hexo.locals.get("posts");
  const seriesPosts = findSeriesPosts(seriesName, posts, config);
  if (!seriesPosts.length) {
    hexo.log.warn(`No posts found for series: ${seriesName}`);
    return "";
  }

  const urlFor = hexo.extend.helper.get("url_for").bind(hexo);
  const currentPath = this.path;
  const items = seriesPosts.map((post) => {
    const currentAttribute = post.path === currentPath
      ? ' class="current" aria-current="page"'
      : "";
    return html`
      <li${currentAttribute}>
        <a href="${escapeHtml(urlFor(post.path))}" title="${escapeHtml(post.title)}">${escapeHtml(post.title)}</a>
      </li>
    `;
  });
  const listTag = config.numbered === false ? "ul" : "ol";

  return `<${listTag} class="series-items">${items.join("")}</${listTag}>`;
};

hexo.extend.tag.register("series", renderSeries, { ends: false });
