# AWS RDS 설정
DB 인스턴스 이름: favorite

관리자 ID: admin

DB PW: myfavorite04

DB 이름: favorite

# AWS RDS MYSQL workbench에 연결하기
1. 보안 그룹 규칙 가서 Inbound 수정
2. 
3. 편집 들어가서 mysql/aurora 선택, 소스 탭에서 내 IP 선택
4. 
5. 규칙 저장 후 workbench 실행
6. 
7. 홈 화면에서 mysql connection 옆 + 선택
8. 
9. connection name => 맘대로 하십쇼
10. 
11. hostname: db 생성후 받은 endpoint 입력
12. 
13. port: 3306
14. 
15. username: admin
16. 
17. password: store in vault...  눌러서 myfavorite04 입력 후 기억시키기

# AWS 연결된 DB에 트위터, 인스타 데이터 넣기
1. 트위터는 엑셀 파일이랑 twitter 폴더에 있는 영상 다 다운받기
2. 
3. 인스타는 올라가있는 instagram 폴더 다 다운받기
4. 
5. 파일 중에 excel_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행
6. 
7. twiiter_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행 => 트위터 자체 게시 비디오 파일 삽입
8. 
9. insta_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행
10. 
11. 인스타랑 트위터 실행 순서는 상관 없는데 트위터는 파일 순서 저대로 실행 필수
