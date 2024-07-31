const YoutubeService = require('../services/youtubeService');

// 모든 비디오 데이터를 가져오는 함수
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await YoutubeService.getAllVideos();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 비디오에 좋아요를 추가하는 함수
exports.likeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await YoutubeService.likeVideo(id);
        res.status(200).json({ message: '비디오에 좋아요를 눌렀습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 비디오에 싫어요를 추가하는 함수
exports.dislikeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await YoutubeService.dislikeVideo(id);
        res.status(200).json({ message: '비디오에 싫어요를 눌렀습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 비디오에 좋아요를 취소하는 함수
exports.unlikeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await YoutubeService.unlikeVideo(id);
        res.status(200).json({ message: '비디오에서 좋아요를 취소했습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 비디오에 싫어요를 취소하는 함수
exports.undislikeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await YoutubeService.undislikeVideo(id);
        res.status(200).json({ message: '비디오에서 싫어요를 취소했습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 날짜별 비디오를 검색하는 함수
exports.getVideosByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const videos = await YoutubeService.getVideosByDate(date);
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// YouTube 비디오 데이터를 크롤링하는 함수
exports.crawlYouTubeVideos = async (req, res) => {
    try {
        await YoutubeService.crawlYouTubeVideos();
        res.status(200).json({ message: '유튜브 비디오가 데이터베이스에 저장되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};