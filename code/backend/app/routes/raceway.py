import asyncio
import websockets
import json
import httpx

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

API_LINUX = 'http://193.146.35.221:8000'
# API_LINUX = 'http://localhost:8001'

WS_URL = 'ws://193.146.35.221:8000/ws/broadcast'

router = APIRouter()

@router.websocket("/ws")
async def websocket_bridge(client_ws: WebSocket):
    await client_ws.accept()
    print("[BRIDGE] Browser conectado")

    try:
        async with websockets.connect(WS_URL) as external_ws:
            print("[BRIDGE] Conectado al servidor externo")

            async def forward_to_client():
                async for message in external_ws:
                    data = json.loads(message)
                    await client_ws.send_json(data)

            async def forward_to_external():
                while True:
                    data = await client_ws.receive_json()
                    await external_ws.send(json.dumps(data))

            await asyncio.gather(
                forward_to_client(),
                forward_to_external()
            )

    except WebSocketDisconnect:
        print("[BRIDGE] Browser desconectado limpiamente")

@router.post("/fase{fase}")
async def fase(fase: str):
    url = f"{API_LINUX}/devices/motor/fase{fase}"
    print(f"[FASE] Conectando a: {url}")
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, timeout=150)
            res.raise_for_status()
            return res.json()
    except httpx.ConnectError as e:
        print(f"[FASE] No se pudo conectar a {API_LINUX}: {e}")
        raise HTTPException(status_code=502, detail=f"No se puede conectar al servidor Linux: {str(e)}")
    
    except httpx.TimeoutException as e:
        print(f"[FASE] Timeout conectando a {API_LINUX}: {e}")
        raise HTTPException(status_code=504, detail="Timeout al conectar con el servidor Linux")
    except httpx.HTTPStatusError as e:
        print(f"[FASE] Error HTTP {e.response.status_code}: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        print(f"[FASE] Error generico: {e}")
        raise HTTPException(status_code=502, detail=str(e))
