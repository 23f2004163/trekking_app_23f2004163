import os 
from backend.configurations import UPSTASH_REDIS_REST_TOKEN , UPSTASH_REDIS_REST_URL

from upstash_redis import Redis 

redis = Redis(
    
   url= UPSTASH_REDIS_REST_URL ,
   token = UPSTASH_REDIS_REST_TOKEN
)