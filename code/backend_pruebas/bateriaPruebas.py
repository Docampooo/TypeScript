import asyncio
import json
import httpx

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

# ── Configuracion ─────────────────────────────────────────────────────────────
# Cambia API_TEST por API_LINUX cuando tengas el servidor listo
API_TEST  = 'http://localhost:8001'           # bateria de pruebas local
API_LINUX = 'http://193.146.35.221:8000'      # servidor linux real
DEVICE    = 'motor'

# Apunta aqui para cambiar entre entornos
API_BASE = API_TEST

router = APIRouter()


# ── Mapeo de campos ───────────────────────────────────────────────────────────
# La API de pruebas usa nombres distintos a los que espera el frontend
# Este metodo traduce la respuesta al formato del frontend

def mapear_estado(raw: dict) -> dict:
    r = raw.get('raceway', {})
    d = raw.get('deposito', {})
    s = raw.get('salida', {})
    m = raw.get('motor', {})

    return {
        "motor": {
            "encendido": m.get('encendido', False),
            "forward":   m.get('direccion') == 'forward',
        },
        "raceway": {
            "nivel":           r.get('nivel_agua', 0),
            "sensor_minimo":   r.get('n1_minimo', False),
            "sensor_maximo":   r.get('n2_maximo', False),
            "valvula_vaciado": r.get('v1_vaciado', False),
            "valvula_llenado": r.get('v2_llenado', False),
        },
        "deposito": {
            "nivel":           d.get('nivel', 0),
            "sensor_minimo":   d.get('n3_minimo', False),
            "sensor_maximo":   d.get('n4_maximo', False),
            "valvula_vaciado": d.get('v3_entrada', False),
            "valvula_llenado": d.get('v4_salida', False),
        },
        "salida": {
            "nivel":           s.get('nivel', 0),
            "sensor_minimo":   s.get('n5_minimo', False),
            "sensor_maximo":   s.get('n6_maximo', False),
            "valvula_vaciado": s.get('v5_salida', False),
            "valvula_llenado": s.get('v6_salida', False),
        },
    }


# ── WebSocket — polling a la API de pruebas ───────────────────────────────────
# La API de pruebas no tiene WebSocket, asi que hacemos polling cada segundo
# Cuando cambies a la API Linux real, sustituye por el bridge de websockets

@router.websocket("/ws")
async def websocket_polling(client_ws: WebSocket):
    await client_ws.accept()
    print("[WS] Browser conectado — modo polling")

    try:
        async with httpx.AsyncClient() as client:
            while True:
                try:
                    res = await client.get(
                        f"{API_BASE}/devices/{DEVICE}/status",
                        timeout=5
                    )
                    if res.status_code == 200:
                        raw = res.json()
                        mapeado = mapear_estado(raw)
                        await client_ws.send_json(mapeado)
                except httpx.HTTPError as e:
                    print(f"[WS] Error polling: {e}")

                await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("[WS] Browser desconectado")


# ── Fases ─────────────────────────────────────────────────────────────────────

@router.post("/fase{fase}")
async def activar_fase(fase: str):
    url = f"{API_BASE}/devices/{DEVICE}/fase{fase}"
    print(f"[FASE] POST {url}")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, timeout=30)
            res.raise_for_status()
            raw = res.json()
            # Devuelve el estado ya mapeado
            if 'estado' in raw:
                return mapear_estado(raw['estado'])
            return raw

    except httpx.ConnectError as e:
        raise HTTPException(status_code=502, detail=f"No se puede conectar: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))


# ── Valvulas ──────────────────────────────────────────────────────────────────

@router.post("/{valvula}/{accion}")
async def accionar_valvula(valvula: str, accion: str):
    if accion not in ("open", "close"):
        raise HTTPException(status_code=400, detail="Accion debe ser open o close")

    url = f"{API_BASE}/devices/{DEVICE}/{valvula}/{accion}"
    print(f"[VALVULA] POST {url}")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, timeout=10)
            res.raise_for_status()
            raw = res.json()
            if 'estado' in raw:
                return mapear_estado(raw['estado'])
            return raw

    except httpx.ConnectError as e:
        raise HTTPException(status_code=502, detail=f"No se puede conectar: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout")
    except httpx.HTTPStatusError as e:
        # Reenvía el mensaje de bloqueo de la API de pruebas al frontend
        try:
            detail = e.response.json().get('detail', e.response.text)
        except Exception:
            detail = e.response.text
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))