import os
import mysql.connector

# MySQL 데이터베이스에 연결
db_connection = mysql.connector.connect(
    host="localhost",  # MySQL 서버 주소
    user="root",  # MySQL 사용자 이름
    password="0727",  # MySQL 비밀번호
    database="favorite",  # 사용할 데이터베이스 이름
    charset='utf8mb4',
    auth_plugin='mysql_native_password'
)

# 커서 생성
cursor = db_connection.cursor()

# BLOB 데이터 존재 여부 확인 쿼리
get_blob_records_query = """
SELECT twitter_id, date_t, twitter_video FROM twitter WHERE twitter_video IS NOT NULL ORDER BY twitter_id ASC
"""

# BLOB 값을 가진 레코드 가져오기
cursor.execute(get_blob_records_query)
blob_records = cursor.fetchall()

# blob_records를 딕셔너리로 변환하여 빠른 조회를 가능하게 함
blob_records_dict = {(record[0], record[1]): record[2] for record in blob_records}
print(blob_records_dict, end="\n\n")

base_folder = r'C:\Favorite_project\data\Today-s-my-Favorite\Twitter'

# Twitter 폴더 내의 파일들을 순서대로 처리하여 데이터베이스 업데이트
file_list = []  # 파일 리스트를 저장할 리스트

for dirpath, dirnames, filenames in os.walk(base_folder):
    for filename in filenames:
        file_path = os.path.join(dirpath, filename)
        
        if filename.endswith('.mp4'):
            file_list.append((filename, file_path))
        else:
            continue

# 파일을 순서대로 처리하여 데이터베이스 업데이트
for index, (filename, file_path) in enumerate(file_list):
    date_t = filename[:8]
    with open(file_path, 'rb') as f:
        twitter_video = f.read()
        print(f"Reading file: {file_path}")

    # 기존의 twitter_id 값을 사용하여 업데이트
    if index < len(blob_records):
        twitter_id = blob_records[index][0]
        try:
            blob_records_dict[(twitter_id, date_t)] = twitter_video
            print(f"Updating twitter_id: {twitter_id}, date_t: {date_t}")
            update_query = """
            UPDATE twitter
            SET twitter_video = %s
            WHERE twitter_id = %s AND date_t = %s
            """
            cursor.execute(update_query, (twitter_video, twitter_id, date_t))
            db_connection.commit()  # 변경사항 커밋
            print(f"Updated twitter_video for twitter_id: {twitter_id}, date_t: {date_t}")
        except mysql.connector.Error as err:
            print(f"Error updating database: {err}")
    else:
        print(f"No existing record found for file: {filename}")

# 커서 및 연결 닫기
cursor.close()
db_connection.close()

# 데이터 업데이트 완료 메시지 출력
print("Twitter 데이터 업데이트가 완료되었습니다.")
