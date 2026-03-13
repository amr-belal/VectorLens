from minio import Minio
import os  
import dotenv
from dotenv import load_dotenv

load_dotenv()
class MinIoService:
    
    def __init__(self):
        self.client = Minio(
            "localhost:9000",
            access_key="vectorlens",
            secret_key=os.getenv("MINIO_PASS"),
            secure=False
            
        )
        self.bucket = "vectorlens"
        if not self.client.bucket_exists(self.bucket):
            self.client.make_bucket(self.bucket)
            
            
    def upload_file(self, file_name, file_path):
        self.client.fput_object(self.bucket, file_name, file_path)
        
        return f"http://localhost:9000/{self.bucket}/{file_name}"
    
    def download_file(self, file_name, file_path):
        self.client.fget_object(self.bucket, file_name, file_path)
        
        return f"http://localhost:9000/{self.bucket}/{file_name}"
    
    def delete_file(self, file_name):
        self.client.remove_object(self.bucket, file_name)
        
        return f"http://localhost:9000/{self.bucket}/{file_name}"
    
    def get_file_url(self, file_name):
        return f"http://localhost:9000/{self.bucket}/{file_name}"
    
            