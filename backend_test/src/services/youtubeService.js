const { google } = require('googleapis');
const mysql = require('mysql');
const fs = require('fs');
const { format } = require('date-fns');
require('dotenv').config();

const youtube = google.youtube('v3');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const API_KEY = process.env.YOUTUBE_API_KEY;

async function getChannelId(artistName) {
  try {
    const response = await youtube.search.list({
      q: artistName,
      part: 'snippet',
      type: 'channel',
      maxResults: 1,
      key: API_KEY
    });
    return response.data.items[0].id.channelId;
  } catch (error) {
    console.error('Error fetching channel ID:', error);
    throw error;
  }
}

async function searchOfficialVideos(artistName) {
  const channelId = await getChannelId(artistName);
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

  try {
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      type: 'video',
      publishedAfter: `${today}T00:00:00Z`,
      publishedBefore: `${tomorrow}T00:00:00Z`,
      maxResults: 10,
      key: API_KEY
    });

    return response.data.items.map(item => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
      date_y: item.snippet.publishedAt.split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

function saveVideosToDatabase(videos) {
  videos.forEach(video => {
    const query = 'INSERT INTO youtube (date_y, title, photo, video_url, heart, thumb_down) VALUES (?, ?, ?, ?, 0, 0)';
    db.query(query, [video.date_y, video.title, video.thumbnail, video.link], (error, results) => {
      if (error) {
        console.error('Error saving video to database:', error);
      } else {
        console.log('Video saved to database:', results.insertId);
      }
    });
  });
}

function generateHtml(videos, artistName) {
  let htmlContent = `
    <html>
    <head>
        <title>${artistName}의 공식 동영상</title>
    </head>
    <body>
        <h1>${artistName}의 공식 동영상 목록</h1>
        <ul>
  `;

  videos.forEach(video => {
    htmlContent += `
      <li>
        <a href="${video.link}" target="_blank">
          <img src="${video.thumbnail}" alt="${video.title}"><br>
          ${video.title}
        </a>
      </li>
    `;
  });

  htmlContent += `
        </ul>
    </body>
    </html>
  `;

  fs.writeFileSync(`${artistName}_videos.html`, htmlContent, { encoding: 'utf-8' });
  console.log(`${artistName}_videos.html 파일이 생성되었습니다.`);
}

function updateLikes(youtubeId, isLike) {
  const column = isLike ? 'heart' : 'thumb_down';
  const query = `UPDATE youtube SET ${column} = ${column} + 1 WHERE youtube_id = ?`;
  db.query(query, [youtubeId], (error, results) => {
    if (error) {
      console.error(`Error updating ${column}:`, error);
    } else {
      console.log(`${column} updated for youtube_id ${youtubeId}`);
    }
  });
}

module.exports = {
  searchOfficialVideos,
  saveVideosToDatabase,
  generateHtml,
  updateLikes
};