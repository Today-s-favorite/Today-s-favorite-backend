import os
import mysql.connector
import pickle

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

# Instagram 데이터 삽입 쿼리
insert_query_with_video = """
INSERT INTO instagram (date_i, content, photo, insta_video, heart, thumb_down)
VALUES (%s, %s, %s, %s, %s, %s)
"""

insert_query_without_video = """
INSERT INTO instagram (date_i, content, photo, heart, thumb_down)
VALUES (%s, %s, %s, %s, %s)
"""

# 반복할 연도 범위 설정 (2018부터 2024까지)
start_year = 2018
end_year = 2024

for year in range(start_year, end_year + 1):
    # Instagram 폴더 기본 경로 설정
    base_folder = rf'C:\Favorite_project\data\Today-s-my-Favorite\Instagram\{year}'

    # Instagram 폴더 내의 폴더들을 탐색하여 데이터베이스에 삽입
    for dirpath, dirnames, filenames in os.walk(base_folder):
        # 폴더명(날짜)을 date_i로 사용
        date_i = os.path.basename(dirpath)
        
        # 폴더명이 날짜 형식인지 확인 (예: 'YYYYMMDDHHMMSS')
        if not (date_i.isdigit() and len(date_i) == 14):
            continue
        
        # 데이터베이스에 삽입할 데이터 초기화
        content = None
        photos = []  # 여러 개의 BLOB 데이터를 저장할 리스트
        insta_video = None  # 초기값 None 설정
        heart = 0  # 초기 값 (필요에 따라 변경)
        thumb_down = 0  # 초기 값 (필요에 따라 변경)
        
        # 해당 폴더 내의 파일들을 탐색하고 데이터베이스에 삽입
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            
            # 파일의 확장자에 따라 적절한 필드에 데이터 할당
            if filename.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            elif filename.endswith('.jpg') or filename.endswith('.jpeg'):
                with open(file_path, 'rb') as f:
                    photos.append(f.read())
            elif filename.endswith('.mp4'):
                with open(file_path, 'rb') as f:
                    insta_video = f.read()
            else:
                # 다른 파일 형식은 스킵
                continue
        
        # 여러 개의 photo 데이터를 하나의 BLOB 데이터로 직렬화하여 결합
        if photos:
            photo_blob = pickle.dumps(photos)
        else:
            photo_blob = None
        
        # 데이터 삽입 쿼리 및 값 생성
        if insta_video:
            cursor.execute(insert_query_with_video, (date_i, content, photo_blob, insta_video, heart, thumb_down))
        else:
            cursor.execute(insert_query_without_video, (date_i, content, photo_blob, heart, thumb_down))

# 변경사항 커밋
db_connection.commit()

# 커서 및 연결 닫기
cursor.close()
db_connection.close()

# 데이터 삽입 완료 메시지 출력
print("Instagram 데이터 삽입이 완료되었습니다.")
