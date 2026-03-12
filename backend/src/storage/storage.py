import os
from dotenv import load_dotenv
from abc import ABC, abstractmethod
from fastapi import Depends
from typing import Annotated
from supabase import create_client, Client


class StorageProvider(ABC):
    @abstractmethod
    async def upload(self, file, filename: str) -> str:
        """Returns the public URL of the uploaded file"""
        pass

    @abstractmethod
    def get_url(self, path: str) -> str:
        """Turns the DB string into a full usable URL"""
        pass

    @abstractmethod
    async def delete(self, filename: str):
        """Removes the physical file from storage"""
        pass


class LocalStorage(StorageProvider):
    def __init__(self, upload_dir="uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)

    async def upload(self, file, filename: str) -> str:
        path = os.path.join(self.upload_dir, filename)
        with open(path, "wb") as buffer:
            buffer.write(await file.read())
        return f"/static/{filename}"

    def get_url(self, path: str) -> str:
        base = os.getenv("BASE_URL", "http://localhost:8000")
        return f"{base}{path}"

    async def delete(self, filename: str):
        path = os.path.join(self.upload_dir, filename)
        if os.path.exists(path):
            os.remove(path)


class SupabaseStorage(StorageProvider):
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(url, key)
        self.bucket_name = os.getenv("SUPABASE_BUCKET_NAME", "images")

    async def upload(self, file, filename: str) -> str:
        path = f"tasks/{filename}"
        content = await file.read()
        
        self.supabase.storage.from_(self.bucket_name).upload(
            file=content,
            path=path,
            file_options={"content-type": file.content_type}
        )
        return path

    def get_url(self, path: str) -> str:
        return self.supabase.storage.from_(self.bucket_name).get_public_url(path)

    async def delete(self, filename: str):
        self.supabase.storage.from_(self.bucket_name).remove([filename])


load_dotenv()


def get_storage() -> StorageProvider:
    storage_type = os.getenv('STORAGE_TYPE', 'LOCAL')
    match storage_type:
        case 'SUPABASE':
            return SupabaseStorage()
        case 'LOCAL':
            return LocalStorage()
        case _:
            return LocalStorage()


StorageDep = Annotated[StorageProvider, Depends(get_storage)]
