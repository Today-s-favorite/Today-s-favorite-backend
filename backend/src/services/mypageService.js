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

  async getLikedPosts(user_id) {
    try {
      const connection = await pool.getConnection();

      const [likedPosts] = await connection.query(
        `SELECT 
          hp.post_id,
          hp.naver_heart,
          hp.youtube_heart,
          hp.twitter_heart,
          hp.instagram_heart,
          n.title AS naver_title,
          y.title AS youtube_title,
          t.title AS twitter_title,
          i.title AS instagram_title
        FROM heart_post hp
        LEFT JOIN naver n ON hp.naver_post = n.naver_id
        LEFT JOIN youtube y ON hp.youtube_post = y.youtube_id
        LEFT JOIN twitter t ON hp.twitter_post = t.twitter_id
        LEFT JOIN instagram i ON hp.instagram_post = i.instagram_id
        WHERE hp.user_info = ?`,
        [user_id]
      );

      connection.release();

      return likedPosts;
    } catch (error) {
      console.error("좋아요를 누른 게시물 정보를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();