const db = require('../../config/databaseSet'); // DB 연결을 처리하는 모듈
const axios = require('axios');

// 모든 비디오 데이터를 가져오는 서비스 함수
exports.getAllVideos = async () => {
    const [rows] = await db.query('SELECT * FROM youtube');
    return rows;
};

// 비디오에 좋아요를 추가하는 서비스 함수
exports.likeVideo = async (id) => {
    await db.query('UPDATE youtube SET heart = heart + 1 WHERE youtube_id = ?', [id]);
};

// 비디오에 싫어요를 추가하는 서비스 함수
exports.dislikeVideo = async (id) => {
    await db.query('UPDATE youtube SET thumb_down = thumb_down + 1 WHERE youtube_id = ?', [id]);
};

// 비디오에 좋아요를 취소하는 서비스 함수
exports.unlikeVideo = async (id) => {
    await db.query('UPDATE youtube SET heart = heart - 1 WHERE youtube_id = ? AND heart > 0', [id]);
};

// 비디오에 싫어요를 취소하는 서비스 함수
exports.undislikeVideo = async (id) => {
    await db.query('UPDATE youtube SET thumb_down = thumb_down - 1 WHERE youtube_id = ? AND thumb_down > 0', [id]);
};

// 날짜별 비디오 데이터를 가져오는 서비스 함수
exports.getVideosByDate = async (date) => {
    const [rows] = await db.query('SELECT * FROM youtube WHERE date_y = ?', [date]);
    return rows;
};

// YouTube 비디오 데이터를 크롤링하여 저장하는 서비스 함수
exports.crawlYouTubeVideos = async () => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CHANNEL_ID = process.env.CHANNEL_ID;

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
};