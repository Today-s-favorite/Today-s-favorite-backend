import mysql.connector
import pickle
import os

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

# 데이터 검색 쿼리
select_query = "SELECT date_i, content, photo, insta_video, heart, thumb_down FROM instagram WHERE date_i = %s"
date_i_value = '20181226000001'  # 여기에 원하는 date_i 값을 넣어주세요 (YYYYMMDDHHMMSS)
cursor.execute(select_query, (date_i_value,))
result = cursor.fetchone()

if result:
    date_i, content, photo_blob, insta_video, heart, thumb_down = result
    
    # photo 열의 BLOB 데이터 역직렬화
    photos = pickle.loads(photo_blob) if photo_blob else []
    
    # 역직렬화한 사진 데이터 저장
    save_folder = r'C:\Favorite_project\test_data'  # 저장할 폴더 경로
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)
    
    for i, photo_data in enumerate(photos):
        with open(os.path.join(save_folder, f'retrieved_photo_{i}.jpg'), 'wb') as f:
            f.write(photo_data)
    
    # insta_video 역직렬화 (있는 경우)
    if insta_video:
        with open(os.path.join(save_folder, 'retrieved_video.mp4'), 'wb') as f:
            f.write(insta_video)
    
    print("사진과 비디오 데이터를 성공적으로 저장하였습니다.")
else:
    print(f"해당 date_i({date_i_value})로 데이터를 찾을 수 없습니다.")

# 커서 및 연결 닫기
cursor.close()
db_connection.close()
