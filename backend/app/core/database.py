import json
import os
import uuid
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import pymongo
from app.core.config import settings

class JsonCollection:
    """Fallback in-file collection store if MongoDB is offline."""
    def __init__(self, collection_name: str, db_file: Path):
        self.name = collection_name
        self.db_file = db_file

    def _read_data(self) -> Dict[str, List[dict]]:
        if not self.db_file.exists():
            return {}
        try:
            with open(self.db_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_data(self, data: Dict[str, List[dict]]):
        self.db_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.db_file, "w", encoding="utf-8") as f:
            json.dump(data, f, default=str, indent=2)

    def insert_one(self, doc: dict):
        data = self._read_data()
        docs = data.get(self.name, [])
        new_doc = dict(doc)
        if "_id" not in new_doc:
            new_doc["_id"] = str(uuid.uuid4())
        docs.append(new_doc)
        data[self.name] = docs
        self._write_data(data)
        class InsertResult:
            inserted_id = new_doc["_id"]
        return InsertResult()

    def find_one(self, query: dict) -> Optional[dict]:
        data = self._read_data()
        docs = data.get(self.name, [])
        for doc in docs:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    def find(self, query: Optional[dict] = None) -> List[dict]:
        data = self._read_data()
        docs = data.get(self.name, [])
        if not query:
            return docs
        results = []
        for doc in docs:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return results

    def update_one(self, query: dict, update: dict, upsert: bool = False):
        data = self._read_data()
        docs = data.get(self.name, [])
        updated = False
        set_vals = update.get("$set", update)
        for i, doc in enumerate(docs):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                docs[i].update(set_vals)
                updated = True
                break
        if not updated and upsert:
            new_doc = dict(query)
            new_doc.update(set_vals)
            if "_id" not in new_doc:
                new_doc["_id"] = str(uuid.uuid4())
            docs.append(new_doc)
        data[self.name] = docs
        self._write_data(data)

    def delete_one(self, query: dict):
        data = self._read_data()
        docs = data.get(self.name, [])
        for i, doc in enumerate(docs):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                docs.pop(i)
                break
        data[self.name] = docs
        self._write_data(data)

class DatabaseManager:
    def __init__(self):
        self.is_connected_to_mongo = False
        self.mongo_client = None
        self.db = None
        self.fallback_file = Path(__file__).resolve().parent.parent.parent / "storage" / "db_data.json"
        self._init_connection()

    def _init_connection(self):
        try:
            client = pymongo.MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1500)
            # Check connection
            client.admin.command('ping')
            self.mongo_client = client
            self.db = client[settings.DATABASE_NAME]
            self.is_connected_to_mongo = True
            print(f"[DB] Successfully connected to MongoDB at {settings.MONGODB_URL}")
        except Exception as e:
            self.is_connected_to_mongo = False
            self.fallback_file.parent.mkdir(parents=True, exist_ok=True)
            print(f"[DB] MongoDB connection unavailable ({e}). Using persistent resilient storage: {self.fallback_file}")

    def get_collection(self, name: str):
        if self.is_connected_to_mongo and self.db is not None:
            try:
                return self.db[name]
            except Exception:
                pass
        return JsonCollection(name, self.fallback_file)

db_manager = DatabaseManager()

def get_db_status():
    return {
        "status": "connected" if db_manager.is_connected_to_mongo else "fallback_active",
        "engine": "MongoDB" if db_manager.is_connected_to_mongo else "Persistent JSON Store",
        "url": settings.MONGODB_URL if db_manager.is_connected_to_mongo else str(db_manager.fallback_file)
    }
