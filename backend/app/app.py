from fastapi import FastAPI
from app.routes.raceway import router

app = FastAPI()

app.include_router(router)