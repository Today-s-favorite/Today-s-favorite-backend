const instagramService = require('../services/instagramService');

// 모든 게시물 조회
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await instagramService.getAllPosts();
        res.status(200).json(posts);  // 게시물 리스트를 JSON 형식으로 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};

// 특정 날짜의 게시물 조회
exports.getPostsByDate = async (req, res, next) => {
    try {
        const { date } = req.params;  // YYYY-MM-DD 형식으로 날짜를 전달받음
        const posts = await instagramService.getPostsByDate(date);
        res.status(200).json(posts);  // 특정 날짜의 게시물 리스트를 JSON 형식으로 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};

// 특정 게시물에 좋아요 추가
exports.addLike = async (req, res, next) => {
    try {
        const { instagram_id } = req.params;
        await instagramService.addLike(instagram_id);
        res.status(200).json({ message: '좋아요가 추가되었습니다' });  // 성공 메시지 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};

// 특정 게시물에서 좋아요 취소
exports.removeLike = async (req, res, next) => {
    try {
        const { instagram_id } = req.params;
        await instagramService.removeLike(instagram_id);
        res.status(200).json({ message: '좋아요가 취소되었습니다' });  // 성공 메시지 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};

// 특정 게시물에 싫어요 추가
exports.addDislike = async (req, res, next) => {
    try {
        const { instagram_id } = req.params;
        await instagramService.addDislike(instagram_id);
        res.status(200).json({ message: '싫어요가 추가되었습니다' });  // 성공 메시지 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};

// 특정 게시물에서 싫어요 취소
exports.removeDislike = async (req, res, next) => {
    try {
        const { instagram_id } = req.params;
        await instagramService.removeDislike(instagram_id);
        res.status(200).json({ message: '싫어요가 취소되었습니다' });  // 성공 메시지 반환
    } catch (error) {
        next(error);  // 에러 핸들링 미들웨어로 에러 전달
    }
};