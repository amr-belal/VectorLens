from kafka import KafkaConsumer
import json


class DocumentConsumer:
    def __init__(self):
        self.consumer = KafkaConsumer(
            "documents",
            bootstrap_servers = "localhost:9092",
            group_id = "vectorlens-workers",
            value_deserializer=lambda m: json.loads(m.decode("utf-8"))
        )
        
    def consumer_task(self):
        for message in self.consumer:
            data = message.value
            print(f"Received: {data}")
            yield data
            
            self.consumer.commit()
            