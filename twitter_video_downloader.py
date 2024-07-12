import mysql.connector
from mysql.connector import Error
import os

# MySQL 서버 연결 정보
config = {
    'host': 'localhost',  # MySQL 호스트 주소
    'database': 'favorite',  # 데이터베이스 이름
    'user': 'root',  # 데이터베이스 사용자 이름
    'password': '0727',  # 데이터베이스 비밀번호
    'auth_plugin': 'mysql_native_password'  # 인증 플러그인 명시
}

# 저장할 파일의 절대 경로 설정
save_path = 'C:/Favorite_project/test_data'
file_name = 'downloaded_video.mp4'
file_path = os.path.join(save_path, file_name)

# MySQL 서버에 연결
try:
    conn = mysql.connector.connect(**config)

    if conn.is_connected():
        print('Connected to MySQL database')

        # 데이터베이스 cursor 생성
        cursor = conn.cursor()

        # 예시: twitter_id가 1인 트윗의 twitter_video 다운로드
        query = "SELECT twitter_video FROM twitter WHERE twitter_id = 294"
        cursor.execute(query)

        # 결과 가져오기
        row = cursor.fetchone()
        if row:
            # twitter_video 데이터를 파일로 저장
            with open(file_path, 'wb') as f:
                f.write(row[0])  # 첫 번째 열이 twitter_video longblob 데이터

            print('Video downloaded successfully')

        else:
            print('No video found for the given twitter_id')

except Error as e:
    print(f'Error while connecting to MySQL: {e}')

finally:
    # 연결 닫기
    if conn.is_connected():
        cursor.close()
        conn.close()
        print('MySQL connection closed')
