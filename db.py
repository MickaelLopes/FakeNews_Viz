import pymongo
from bson.json_util import dumps
import json

mongo = pymongo.MongoClient('mongodb+srv://lopesmickael8:C1348m13@cluster0-mqdrm.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)


db = pymongo.database.Database(mongo, 'FakeNews')
news_col = pymongo.collection.Collection(db, 'News')
tweets_col = pymongo.collection.Collection(db, 'Tweets')

col_results = json.loads(dumps(news_col.find_one({"_id":13806})))
tweets_col = json.loads(dumps(tweets_col.find_one({"_id":13806})))

print(tweets_col)
