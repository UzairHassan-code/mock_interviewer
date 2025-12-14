# import os
# from pymongo import MongoClient
# from dotenv import load_dotenv

# load_dotenv()

# client = MongoClient(os.getenv("MONGO_URI"))
# db = client["interview_db"]

# def save_interview_data(field, answer, evaluation):
#     db.interviews.insert_one({
#         "field": field,
#         "answer": answer,
#         "evaluation": evaluation
#     })
