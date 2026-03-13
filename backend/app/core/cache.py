import redis 
import json 

class CacheService :
    
    def __init__(self):
        self.client = redis.Redis(host="localhost", port=6379)
    
    def get(self,key):
        if self.client.exists(key):
            return json.loads(self.client.get(key))
        return None
    
    def set(self , key:str,value:dict , ttl:int =3600):
        self.client.set(key, json.dumps(value), ex=ttl)
        