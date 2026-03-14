from kafka import KafkaProducer
import json 


class DocumentProducer:
    
    
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers= "localhost:9092",
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        
    def send_document (self , save_path:str , unique_filename:str):
        self.producer.send(
            "documents",{
                "save_path": save_path,
                "unique_filename": unique_filename
            }
        )
        self.producer.flush()