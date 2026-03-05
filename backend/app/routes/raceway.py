import requests 

from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware

#BASE_URL = 'http://localhost:8000' --> WEB
API_URL = 'http://193.146.35.221:8000'

router = APIRouter()

#Obtiene todos los datos del raceway
@router.get("/datos")
def datos():
    
    try:
        res = requests.get(f"{API_URL}/devices/motor/datos")
        res.raise_for_status()
        
        datos = res.json()
        return datos
    
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="La API del servidor no responde")
    
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error al conectar con el servidor: {str(e)}")
    
@router.post("/{fase}")
def fase1(fase: int):
    
    try:
        res = requests.post(f"{API_URL}/devices/motor/fase{fase}")
        
        res.raise_for_status()
        return res.json()
    
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))