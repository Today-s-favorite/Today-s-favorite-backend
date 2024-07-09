import pandas as pd
import mysql.connector
from mysql.connector import Error
from datetime import datetime

def read_excel(file_path):
    """엑셀 파일을 읽어 데이터프레임으로 변환합니다."""
    df = pd.read_excel(file_path)
    return df

def connect_to_mysql(host, user, password, database):
    """MySQL 데이터베이스에 연결합니다."""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4',
            auth_plugin='mysql_native_password'
        )
        if connection.is_connected():
            print("MySQL 데이터베이스에 연결되었습니다.")
            return connection
    except Error as e:
        print(f"Error: '{e}'")
        return None

# 날짜 형식 변환
def convert_timestamps_to_date(df, timestamp_columns):
    """Convert Unix timestamps to MySQL DATE format as strings."""
    for col in timestamp_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], unit='s').dt.strftime('%Y-%m-%d')
    return df

# NaN 값 Null로 변환
def handle_nan_values(df):
    """Handle NaN values by replacing them with an appropriate value."""
    df = df.where(pd.notnull(df), None)
    return df

def insert_data_to_mysql(connection, df, table_name):
    """데이터프레임의 데이터를 MySQL 테이블로 삽입합니다."""
    cursor = connection.cursor()
    timestamp_columns = ['date_t']  # 날짜 넣을 열 지정
    df = convert_timestamps_to_date(df, timestamp_columns)  # 날짜 형식 변환
    df = handle_nan_values(df)   # NaN 값 Null로 변환
    
    for index, row in df.iterrows():
        placeholders = ', '.join(['%s'] * len(row))
        columns = ', '.join(row.index)
        sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        cursor.execute(sql, tuple(row))
    
    connection.commit()
    cursor.close()
    print("데이터 삽입이 완료되었습니다.")

def main():
    # 엑셀 파일 경로
    excel_file_path = 'C:\\Favorite_project\\Today-s-favorite-backend\\IU_Twitter_DB.xlsx'
    
    # MySQL 데이터베이스 연결 정보
    mysql_host = 'localhost'
    mysql_user = 'root'
    mysql_password = '0727'
    mysql_database = 'favorite'
    mysql_table_name = 'twitter'

    # 엑셀 파일 읽기
    df = read_excel(excel_file_path)

    # MySQL 데이터베이스 연결
    connection = connect_to_mysql(mysql_host, mysql_user, mysql_password, mysql_database)

    if connection:
        # 데이터 삽입
        insert_data_to_mysql(connection, df, mysql_table_name)
        # 연결 종료
        connection.close()
        print("MySQL 연결이 종료되었습니다.")

if __name__ == "__main__":
    main()
