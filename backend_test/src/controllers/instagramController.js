const pool = require('../../config/databaseSet');

const getMediaByDate = async (date) => {
  const query = `
    SELECT instagram_id, date_i, content, photo, insta_video, heart, thumb_down
    FROM instagram
    WHERE DATE(date_i) = DATE(?)
  `;
  const [rows] = await pool.execute(query, [date]);
  return rows;
};

const updateHeart = async (instagram_id, action) => {
  const increment = action === 'like' ? 1 : action === 'unlike' ? -1 : 0;
  const query = `
    UPDATE instagram
    SET heart = heart + ?
    WHERE instagram_id = ?
  `;
  const [result] = await pool.execute(query, [increment, instagram_id]);
  return result;
};

const updateThumbDown = async (instagram_id, action) => {
  const increment = action === 'dislike' ? 1 : action === 'undislike' ? -1 : 0;
  const query = `
    UPDATE instagram
    SET thumb_down = thumb_down + ?
    WHERE instagram_id = ?
  `;
  const [result] = await pool.execute(query, [increment, instagram_id]);
  return result;
};

module.exports = {
  getMediaByDate,
  updateHeart,
  updateThumbDown,
};