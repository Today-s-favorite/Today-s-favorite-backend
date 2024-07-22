const axios = require("axios");
const cheerio = require("cheerio");
const { Builder } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fs = require("fs");
const { promisify } = require("util");
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');

const pool = require('../../config/databaseSet');

const unsupportedSites = [
  'jtbc.co.kr',
  'hankookilbo.com',
  'tvreport.co.kr',
  // 추가적으로 지원하지 않는 사이트를 여기에 추가
];

async function crawlNews(entertainerName) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
  const keywordQuery = entertainerName.split(" ").join("+");
  const url = `https://search.naver.com/search.naver?where=news&query=${keywordQuery}&sm=tab_opt&sort=0&photo=0&field=0&reporter_article=&pd=3&ds=${today}&de=${today}&docid=&nso=so%3Ar%2Cp%3Afrom${today.replace(
    /\./g,
    ""
  )}to${today.replace(/\./g, "")}%2Ca%3Aall&mynews=0&refresh_start=0&related=0`;

  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--disable-gpu'); // GPU 비활성화
  chromeOptions.addArguments('--disable-software-rasterizer'); // 소프트웨어 래스터라이저 비활성화
  chromeOptions.addArguments('--single-process'); // 단일 프로세스 모드
  chromeOptions.addArguments('--disable-gpu-sandbox'); // GPU 샌드박스 비활성화

  let driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();
  await driver.get(url);
  await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
  await driver.sleep(2000);
  const html = await driver.getPageSource();
  await driver.quit();

  const $ = cheerio.load(html);
  let newsList = [];
  $("div.news_area").each((i, elem) => {
    const title = $(elem).find("a.news_tit").text();
    const link = $(elem).find("a.news_tit").attr("href");
    if (
      entertainerName
        .split(" ")
        .every((keyword) => title.toLowerCase().includes(keyword.toLowerCase()))
    ) {
      newsList.push({ title, link });
    }
  });

  console.log("Crawled news list:", newsList);
  return newsList;
}

async function crawlNewsContent(newsUrl) {
  const siteSelectors = {
    "https://www.topstarnews.net": {
      title: ".article-head-title",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.newsen.com": {
      title: ".art_title",
      content: ".article",
      encoding: "utf-8",
    },
    "https://www.slist.kr": {
      title: ".heading",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.newsculture.press/news": {
      title: ".heading",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.fashionn.com": {
      title: ".title",
      content: ".view_body",
      encoding: "utf-8",
    },
    "https://www.stardailynews.co.kr": {
      title: ".heading",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.yna.co.kr": {
      title: "#articleWrap > div.content03 > header > h1",
      content:
        "#articleWrap > div.content01.scroll-article-zone01 > div > div > article",
      encoding: "utf-8",
    },
    "https://www.newsis.com": {
      title: "#content > div.articleView > div.view > div.top > h1",
      content: "#content > div.articleView > div.view > div.viewer",
      encoding: "utf-8",
    },
    "https://www.osen.co.kr": {
      title:
        "#main_section > div.detail_view.view > div.content > div > div > div > div.sub-content > div.view-info > strong",
      content: "#articleBody",
      encoding: "utf-8",
    },
    "http://www.heraldpop.com": {
      title:
        "body > div.wrap > div.view_bg > div.view_area > div.article_wrap > div.article_top > ul > li.article_title.ellipsis2",
      content: "#articleText",
      encoding: "utf-8",
    },
    "https://www.ggilbo.com": {
      title: "#article-view > div > header > h3",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.wikitree.co.kr": {
      title: "#article",
      content: "#content > div > div.content_left_wrap > div.article_body",
      encoding: "utf-8",
    },
    "https://www.tvdaily.co.kr": {
      title: ".read_title",
      content: ".read",
      encoding: "euc-kr",
    },
    "https://www.asiatoday.co.kr": {
      title: "#section_top > div > h3",
      content: "#section_main > div > dl",
      encoding: "utf-8",
    },
    "https://www.donga.com": {
      title: "#contents > header > div > section > h1",
      content:
        "#contents > div.view_body > div > div.main_view > section.news_view",
      encoding: "utf-8",
    },
    "https://mksports.co.kr": {
      title: "#view_tit > table > tbody > tr:nth-child(1) > td > span.head_tit",
      content: "#joinskmbox > div:nth-child(1) > div",
      encoding: "utf-8",
    },
    "https://www.joongang.co.kr": {
      title: "#container > section > article > header > h1",
      content: "#article_body",
      encoding: "utf-8",
    },
    "https://www.ktnews.com": {
      title: ".article-head-title",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.greened.kr": {
      title: ".article-head-title",
      content: "#articleBody",
      encoding: "utf-8",
    },
    "https://tvreport.co.kr": {
      title: ".title-box",
      content: ".news-article",
      encoding: "utf-8",
    },
    "https://tenasia.hankyung.com": {
      title: "#container > article > section > h1",
      content: "#article-body",
      encoding: "utf-8",
    },
    "https://news.heraldcorp.com": {
      title:
        "body > div.wrap > div.view_bg > div.view_area > div.article_wrap > div.article_top > ul > li.article_title.ellipsis2",
      content: "#articleText",
      encoding: "utf-8",
    },
    "https://www.starnewskorea.com": {
      title: "#content > div.fbox.cw651 > div > div > h1",
      content: "#textBody",
      encoding: "utf-8",
    },
    "https://view.asiae.co.kr": {
      title:
        "#container > div.contents > section > div.cont_sub.cont02023 > div.area_title > h1",
      content:
        "#container > div.contents > section > div.cont_main > div.cont_article > div",
      encoding: "utf-8",
    },
    "https://imnews.imbc.com": {
      title:
        "#content > div > section.wrap_article > article > div.wrap_title > h2",
      content:
        "#content > div > section.wrap_article > article > div.news_cont > div.news_txt",
      encoding: "utf-8",
    },
    "https://www.segye.com": {
      title: "#title_sns",
      content: "#article_txt",
      encoding: "utf-8",
    },
    "https://www.sedaily.com": {
      title: "#v-left-scroll-in > div.article_head > h1",
      content:
        "#v-left-scroll-in > div.article_con > div.con_left > div.article_view",
      encoding: "utf-8",
    },
    "https://www.yonhapnewstv.co.kr": {
      title:
        "#content > div.inner > div.article-head-wrap > div > div > strong",
      content: "#articleBody",
      encoding: "utf-8",
    },
    "https://www.mk.co.kr": {
      title:
        "#container > section > div.news_detail_head_group.type_none_bg > section > div > div > div > h2",
      content:
        "#container > section > div.news_detail_body_group > section > div.min_inner > div.sec_body > div.news_cnt_detail_wrap",
      encoding: "utf-8",
    },
    "https://sports.donga.com": {
      title: "#contents > div > div.list_content > div.article_tit > h1",
      content: "#article_body",
      encoding: "utf-8",
    },
    "https://www.mhns.co.kr": {
      title: "#article-view > div > header > h3",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
    "https://www.job-post.co.kr": {
      title:
        "#user-container > div.float-center.max-width-1080 > header > div > div",
      content: "#article-view-content-div",
      encoding: "utf-8",
    },
  };

  const domain = Object.keys(siteSelectors).find((site) =>
    newsUrl.includes(site)
  );

  if (!domain || unsupportedSites.some(site => newsUrl.includes(site))) {
    console.log(`해당 사이트에서는 지원하지 않는 경우: ${newsUrl}`);
    return null;
  }

  const selectors = siteSelectors[domain];

  try {
    const resp = await axios.get(newsUrl, {
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    });
    const html = resp.data.toString(selectors.encoding);
    const $ = cheerio.load(html);
    const newsTitle = $(selectors.title).text().trim();
    const newsContent = $(selectors.content).text().trim();

    console.log(`Crawled content for ${newsUrl}:`, newsContent);

    return {
      제목: newsTitle,
      내용: newsContent,
      URL: newsUrl,
    };
  } catch (error) {
    console.error(`Failed to fetch content from ${newsUrl}: ${error.message}`);
  }
  return null;
}

async function saveToDatabase(news) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      "INSERT INTO naver (date_n, naver_title, content, naver_url, heart, thumb_down) VALUES (?, ?, ?, ?, ?, ?)",
      [new Date(), news.제목, news.내용, news.URL, 0, 0]
    );
    console.log(`Data inserted with id: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error('DB Insert Error:', error);
  } finally {
    connection.release();
  }
}

async function main() {
  const entertainerName = "아이유";
  const newsResult = await crawlNews(entertainerName);
  const newsContents = [];

  for (const news of newsResult) {
    const content = await crawlNewsContent(news.link);
    if (content) {
      newsContents.push(content);
    }
  }

  console.log("Final news contents:", newsContents);

  for (const news of newsContents) {
    await saveToDatabase(news);
  }

  console.log(`All news articles have been saved to the database`);
}

module.exports = { main };