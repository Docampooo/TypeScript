import asyncio
import websockets
import json
import httpx

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from pydantic import BaseModel, Field

API_LINUX = 'http://193.146.35.221:8000'
WS_URL    = 'ws://193.146.35.221:8000/ws/raceway-circuito'

router = APIRouter()


@router.websocket("/ws")
async def websocket_bridge(client_ws: WebSocket):
    await client_ws.accept()
    print("[BRIDGE] Browser conectado")

    try:
        async with websockets.connect(WS_URL) as external_ws:
            print("[BRIDGE] Conectado al servidor externo")

            async for message in external_ws:
                try:
                    data = json.loads(message)
                    await client_ws.send_json(data)
                except Exception as e:
                    print(f"[BRIDGE] Error enviando al browser: {e}")
                    break

    except WebSocketDisconnect:
        print("[BRIDGE] Browser desconectado limpiamente")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"[BRIDGE] Servidor externo cerró la conexión: {e}")
        try:
            await client_ws.send_json({"error": "Conexion con servidor perdida"})
        except Exception:
            pass

    except OSError as e:
        print(f"[BRIDGE] No se pudo conectar al servidor externo: {e}")
        try:
            await client_ws.send_json({"error": "No se puede conectar al servidor Linux"})
        except Exception:
            pass

    except Exception as e:
        print(f"[BRIDGE] Error inesperado: {e}")
        
        
# ─── Time Settings ────────────────────────────────────────────────────────────

class DepositoTiempos(BaseModel):
    valvula_llenado: int = Field(..., ge=0, le=120)
    valvula_vaciado: int = Field(..., ge=0, le=120)
    
class TimeSettings(BaseModel):
    dep_raceway: DepositoTiempos
    dep_cultivo:  DepositoTiempos
    dep_cosecha:  DepositoTiempos
 
@router.get("/time-settings")
async def get_time_settings():
    url = f"{API_LINUX}/api/v1/raceway-circuito/time-settings"
    print(f"[TIME-SETTINGS] GET {url}")
 
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, timeout=10)
            res.raise_for_status()
            return res.json()
    except httpx.ConnectError as e:
        raise HTTPException(status_code=502, detail=f"No se puede conectar al servidor Linux: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout al obtener time settings")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))
 
 
@router.post("/time-settings")
async def post_time_settings(settings: TimeSettings):
    url = f"{API_LINUX}/api/v1/raceway-circuito/time-settings"
    print(f"[TIME-SETTINGS] POST {url} → {settings.model_dump()}")
 
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=settings.model_dump(), timeout=10)
            res.raise_for_status()
            return res.json()
    except httpx.ConnectError as e:
        raise HTTPException(status_code=502, detail=f"No se puede conectar al servidor Linux: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout al guardar time settings")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/{estado}")
async def fase(estado: bool, direccion: bool):
    url = f"{API_LINUX}/api/v1/raceway-circuito/motor/{estado}?direccion={direccion}"
    print(f"[FASE] POST {url}")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, timeout=150)
            res.raise_for_status()
            return res.json()

    except httpx.ConnectError as e:
        print(f"[FASE] No se pudo conectar: {e}")
        raise HTTPException(status_code=502, detail=f"No se puede conectar al servidor Linux: {str(e)}")
    except httpx.TimeoutException:
        print(f"[FASE] Timeout")
        raise HTTPException(status_code=504, detail="Timeout al conectar con el servidor Linux")
    except httpx.HTTPStatusError as e:
        print(f"[FASE] Error HTTP {e.response.status_code}: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        print(f"[FASE] Error generico: {e}")
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/valvula/{valvula_id}/{accion}")
async def valvula(valvula_id: str, accion: bool):
    
    valvula_id = int(valvula_id)
    url = f"{API_LINUX}/api/v1/raceway-circuito/valvula/{valvula_id}/{accion}"
    print(f"[VALVULA] POST {url}")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, timeout=30)
            res.raise_for_status()
            return res.json()

    except httpx.ConnectError as e:
        print(f"[VALVULA] No se pudo conectar: {e}")
        raise HTTPException(status_code=502, detail=f"No se puede conectar al servidor Linux: {str(e)}")
    except httpx.TimeoutException:
        print(f"[VALVULA] Timeout")
        raise HTTPException(status_code=504, detail="Timeout al accionar la valvula")
    except httpx.HTTPStatusError as e:
        print(f"[VALVULA] Error HTTP {e.response.status_code}: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        print(f"[VALVULA] Error generico: {e}")
        raise HTTPException(status_code=502, detail=str(e))
    