const pool = require('../../config/databaseSet'); // 상대 경로 수정

// 모든 게시물 조회
exports.getAllPosts = async () => {
    const [rows] = await pool.query('SELECT * FROM instagram');
    return rows;  // 모든 게시물 리스트 반환
};

// 특정 날짜의 게시물 조회
exports.getPostsByDate = async (date) => {
    const [rows] = await pool.query('SELECT * FROM instagram WHERE DATE(date_i) = ?', [date]);
    return rows;  // 특정 날짜의 게시물 리스트 반환
};

// 특정 게시물에 좋아요 추가
exports.addLike = async (instagram_id) => {
    await pool.query('UPDATE instagram SET heart = heart + 1 WHERE instagram_id = ?', [instagram_id]);
};

// 특정 게시물에서 좋아요 취소
exports.removeLike = async (instagram_id) => {
    await pool.query('UPDATE instagram SET heart = heart - 1 WHERE instagram_id = ?', [instagram_id]);
};

// 특정 게시물에 싫어요 추가
exports.addDislike = async (instagram_id) => {
    await pool.query('UPDATE instagram SET thumb_down = thumb_down + 1 WHERE instagram_id = ?', [instagram_id]);
};

// 특정 게시물에서 싫어요 취소
exports.removeDislike = async (instagram_id) => {
    await pool.query('UPDATE instagram SET thumb_down = thumb_down - 1 WHERE instagram_id = ?', [instagram_id]);
};