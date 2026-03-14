from app.services.kafka.consumer import DocumentConsumer
from app.tasks.document_tasks import process_document_task


def start_worker():
    consumer = DocumentConsumer()
    
    for data  in consumer.consumer_task():
        process_document_task.delay(
            data["save_path"],
            data["unique_filename"]
        )
        print(f"Processing: {data['unique_filename']}") 
        
if __name__ == "__main__":
    start_worker()