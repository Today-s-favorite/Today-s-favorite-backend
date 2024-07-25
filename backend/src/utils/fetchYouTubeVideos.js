require('dotenv').config();
const axios = require('axios');
const db = require('../config/databaseSet');

const API_KEY = process.env.GOOGLE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

// YouTube 비디오 데이터를 가져와 데이터베이스에 저장하는 함수
const fetchYouTubeVideos = async () => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                key: API_KEY,
                channelId: CHANNEL_ID,
                part: 'snippet',
                order: 'date',
                maxResults: 10
            }
        });

        const videos = response.data.items;
        for (let video of videos) {
            const { title, publishedAt, thumbnails } = video.snippet;
            const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
            const photo = await axios.get(thumbnails.high.url, { responseType: 'arraybuffer' });
            const photoBlob = Buffer.from(photo.data, 'binary');

            await db.query(
                'INSERT INTO youtube (date_y, title, photo, video_url, heart, thumb_down) VALUES (?, ?, ?, ?, 0, 0)',
                [new Date(publishedAt), title, photoBlob, videoUrl]
            );
        }
        console.log('유튜브 비디오가 데이터베이스에 저장되었습니다.');
    } catch (error) {
        console.error('유튜브 비디오를 가져오는 중 오류가 발생했습니다:', error.message);
    }
};

// 스크립트 실행
fetchYouTubeVideos();