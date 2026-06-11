from sqlalchemy import create_engine, text
import os

from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv

# .envファイルから認証情報を読みこむ
load_dotenv()

username = os.getenv("SQL_USERNAME")
password = os.getenv("SQL_PASSWORD")

engine = create_engine(f"postgresql://{username}:{password}@localhost:5432/eln_db", echo=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False)

class Base(DeclarativeBase): pass

with engine.connect() as conn:
    print(conn.execute(text("SELECT version()")).scalar()) # .scalar(): 実行結果の最初の行の最初の列だけを取り出す

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()