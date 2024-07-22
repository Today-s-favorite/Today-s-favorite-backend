const crypto = require('crypto');
const { hashPassword } = require('../utils/cryptoUtils');
const pool = require('../../config/databaseSet');
const fs = require('fs').promises;
const path = require('path');

class UserService {
  async getUserInfoByUserId(user_id) {
    try {
      const connection = await pool.getConnection();

      const [userRows] = await connection.query(
        "SELECT u.user_id, u.one_favorite, u.nickname, u.email, u.user_pw AS password, u.profile_picture, u.user_intro AS introduction " +
        "FROM user u " +
        "WHERE u.user_id = ?",
        [user_id]
      );

      connection.release();

      if (userRows.length === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      const userInfo = {
        user_id: userRows[0].user_id,
        email: userRows[0].email,
        nickname: userRows[0].nickname,
        profile_picture: userRows[0].profile_picture,
        introduction: userRows[0].introduction,
        one_favorite: userRows[0].one_favorite,
      };

      return userInfo;
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }

  async getLikedYoutubeVideos(user_id) {
    try {
      const connection = await pool.getConnection();

      const [likedYoutubeVideosRows] = await connection.query(
        `SELECT y.youtube_id, y.title, y.date_y, y.video_url, y.photo
         FROM youtube_likes yl
         JOIN youtube y ON yl.youtube_id = y.youtube_id
         WHERE yl.user_id = ? ORDER BY y.date_y DESC`,
        [user_id]
      );

      connection.release();

      return likedYoutubeVideosRows.map(row => ({
        youtube_id: row.youtube_id,
        title: row.title,
        date_y: row.date_y,
        video_url: row.video_url,
        photo: row.photo
      }));
    } catch (error) {
      console.error("좋아요를 누른 유튜브 동영상을 가져오는 중 에러 발생:", error);
      throw error;
    }
  }

  async modifyUserInfo(user_id, nickname, password, introduction) {
    try {
      const connection = await pool.getConnection();

      const user_salt = crypto.randomBytes(32).toString('hex');
      const hashedPassword = hashPassword(password, user_salt);

      const [result] = await connection.query(
        "UPDATE user SET nickname = ?, user_pw = ?, user_intro = ?, user_salt = ? WHERE user_id = ?", 
        [nickname, hashedPassword, introduction, user_salt, user_id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      return { message: "사용자 정보가 성공적으로 수정되었습니다.", access: true };
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      throw error;
    }
  }

  async modifyUserImage(user_id, imageFileName) {
    try {
      const connection = await pool.getConnection();

      const newImagePath = imageFileName ? `images/${imageFileName}` : null;

      const [result] = await connection.query(
        "UPDATE user SET profile_picture = ? WHERE user_id = ?", 
        [newImagePath, user_id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      return { message: "사용자 이미지가 성공적으로 수정되었습니다.", access: true};
    } catch (error) {
      console.error("사용자 이미지 수정 중 에러 발생:", error);
      throw error;
    }
  }

  async deleteUserById(user_id) {
    try {
      const connection = await pool.getConnection();

      const [deleteUserResult] = await connection.query(
        "DELETE FROM user WHERE user_id = ?", 
        [user_id]
      );

      connection.release();

      if (deleteUserResult.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      return { message: "사용자 및 사용자의 모든 게시물이 성공적으로 삭제되었습니다.", access: true };
    } catch (error) {
      console.error("사용자 삭제 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();