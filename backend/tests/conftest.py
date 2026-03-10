
# import pytest
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from app.core.database import Base, get_db
# from app.models import document
# from app.main import app

# engine = create_engine(
#     "sqlite:///:memory:",
#     connect_args={"check_same_thread": False}
# )
# TestSession = sessionmaker(bind=engine)

# @pytest.fixture(autouse=True, scope="session")
# def setup_database():
#     Base.metadata.create_all(bind=engine)
#     yield
#     Base.metadata.drop_all(bind=engine)

# @pytest.fixture(autouse=True)
# def override_db():
#     def get_test_db():
#         db = TestSession()
#         try:
#             yield db
#         finally:
#             db.close()
#     app.dependency_overrides[get_db] = get_test_db
#     yield
#     app.dependency_overrides.clear()