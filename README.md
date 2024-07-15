# AWS RDS 설정
host name: DB endpoint 입력

DB 인스턴스 이름: favorite

관리자 ID: admin

DB PW: myfavorite04

DB 이름: favorite

# AWS RDS MYSQL workbench에 연결하기
1. 보안 그룹 규칙 가서 Inbound 수정
   
2. 편집 들어가서 mysql/aurora 선택, 소스 탭에서 내 IP 선택
   
3. 규칙 저장 후 workbench 실행
 
4. 홈 화면에서 mysql connection 옆 + 선택
  
5. connection name => 맘대로 하십쇼
 
6. hostname: db 생성후 받은 endpoint 입력
 
7. port: 3306

8. username: admin
 
9. password: store in vault...  눌러서 myfavorite04 입력 후 기억시키기

# AWS 연결된 DB에 트위터, 인스타 데이터 넣기
1. 트위터는 엑셀 파일이랑 twitter 폴더에 있는 영상 다 다운받기

2. 인스타는 올라가있는 instagram 폴더 다 다운받기

3. 파일 중에 excel_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행

4. twiiter_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행 => 트위터 자체 게시 비디오 파일 삽입

5. insta_upload.py에서 파일 주소 변견하고 DB 설정 변경 후 실행

6. 인스타랑 트위터 실행 순서는 상관 없는데 트위터는 파일 순서 저대로 실행 필수

# workbench에서 DB 접근하기 (admin 계정에서 실행)
1. 빈 쿼리창에
   use mysql; 
   select host, user, authentication_string from mysql.user; 실행

2. create user ' 사용자 id ' @ ' 접속할 ip' identified by '비밀번호';

3. 사용자 삭제: drop user '사용자 id'

4. 권한 부여하기: grant all privileges on DB명.* to '사용자 id'@'%' identified by '비밀번호';

5. 실행시키기 : flush privileges;

6. 생성한 user 정보로 위의 workbench 연결하기 동작

