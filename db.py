import pymongo
from bson.json_util import dumps
import json

news_id = 13775

mongo = pymongo.MongoClient('mongodb+srv://lopesmickael8:C1348m13@cluster0-mqdrm.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)


db = pymongo.database.Database(mongo, 'FakeNews')
news_col = pymongo.collection.Collection(db, 'News')
tweets_col = pymongo.collection.Collection(db, 'Tweets')

col_results = json.loads(dumps(news_col.find_one({"_id":news_id})))
tweets_col = json.loads(dumps(tweets_col.find_one({"_id":news_id})))


print(tweets_col)

# When working in database connection - save file to be loaded in main.js
"""
with open(f'{news_id}.json', 'w') as json_file:
    json.dump(col_results, json_file)

with open(f't_{news_id}.json', 'w') as json_file2:
    json.dump(tweets_col, json_file2)
"""
