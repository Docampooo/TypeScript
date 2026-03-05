from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Raceway API - Pruebas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

estado = {
    "motor": {
        "encendido": False,
        "direccion": None
    },
    "raceway": {
        "nivel_agua": 50,
        "n1_minimo": False,
        "n2_maximo": False,
        "v1_vaciado": False,
        "v2_llenado": False,
    },
    "deposito": {
        "nivel": 50,
        "n3_minimo": False,
        "n4_maximo": False,
        "v3_entrada": False,
        "v4_salida": False,
    },
    "salida": {
        "nivel": 50,
        "n5_minimo": False,
        "n6_maximo": False,
        "v5_salida": False,
        "v6_salida": False,
    }
}


def actualizar_sensores_raceway():
    """Comprueba nivel y activa/desactiva valvulas y sensores automaticamente."""
    nivel = estado["raceway"]["nivel_agua"]

    # Sensor minimo (N1): nivel <= 20%
    estado["raceway"]["n1_minimo"] = nivel <= 20
    # Sensor maximo (N2): nivel >= 80%
    estado["raceway"]["n2_maximo"] = nivel >= 80

    # Control automatico: nivel maximo -> abrir vaciado, cerrar llenado
    if estado["raceway"]["n2_maximo"]:
        estado["raceway"]["v1_vaciado"] = True
        estado["raceway"]["v2_llenado"] = False

    # Control automatico: nivel minimo -> abrir llenado, cerrar vaciado
    if estado["raceway"]["n1_minimo"]:
        estado["raceway"]["v2_llenado"] = True
        estado["raceway"]["v1_vaciado"] = False


def actualizar_sensores_deposito():
    """Comprueba nivel deposito y activa automaticamente valvulas."""
    nivel = estado["deposito"]["nivel"]

    estado["deposito"]["n3_minimo"] = nivel <= 20
    estado["deposito"]["n4_maximo"] = nivel >= 80

    if estado["deposito"]["n4_maximo"]:
        estado["deposito"]["v4_salida"] = True
        estado["deposito"]["v3_entrada"] = False

    if estado["deposito"]["n3_minimo"]:
        estado["deposito"]["v3_entrada"] = True
        estado["deposito"]["v4_salida"] = False


def actualizar_sensores_salida():
    """Comprueba nivel salida y activa automaticamente valvulas."""
    nivel = estado["salida"]["nivel"]

    estado["salida"]["n5_minimo"] = nivel <= 20
    estado["salida"]["n6_maximo"] = nivel >= 80

    if estado["salida"]["n6_maximo"]:
        estado["salida"]["v5_salida"] = True
        estado["salida"]["v6_salida"] = False

    if estado["salida"]["n5_minimo"]:
        estado["salida"]["v6_salida"] = True
        estado["salida"]["v5_salida"] = False


# --- GET ---

@app.get("/devices/{device_name}/status")
def get_status(device_name: str):
    # Recalcula sensores en cada consulta
    actualizar_sensores_raceway()
    actualizar_sensores_deposito()
    actualizar_sensores_salida()
    return estado


# --- POST: fases ---

@app.post("/devices/{device_name}/fase1")
def fase1(device_name: str, duration: int = 5):
    estado["motor"]["encendido"] = True
    if estado["motor"]["direccion"] is None:
        estado["motor"]["direccion"] = "forward"
    estado["raceway"]["v2_llenado"] = False
    actualizar_sensores_raceway()
    return {"ok": True, "mensaje": f"Fase 1 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase2")
def fase2(device_name: str):
    estado["motor"]["encendido"] = False
    estado["raceway"]["v2_llenado"] = True
    estado["raceway"]["v1_vaciado"] = False
    actualizar_sensores_raceway()
    return {"ok": True, "mensaje": f"Fase 2 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase3")
def fase3(device_name: str):
    estado["motor"]["encendido"] = True
    if estado["motor"]["direccion"] is None:
        estado["motor"]["direccion"] = "forward"
    estado["raceway"]["v2_llenado"] = True
    actualizar_sensores_raceway()
    return {"ok": True, "mensaje": f"Fase 3 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase4")
def fase4(device_name: str):
    estado["motor"]["encendido"] = False
    estado["motor"]["direccion"] = None
    estado["raceway"]["v1_vaciado"] = False
    estado["raceway"]["v2_llenado"] = False
    estado["deposito"]["v3_entrada"] = False
    estado["deposito"]["v4_salida"] = False
    estado["salida"]["v5_salida"] = False
    estado["salida"]["v6_salida"] = False
    return {"ok": True, "mensaje": f"Fase 4 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase5")
def fase5(device_name: str):
    estado["motor"]["encendido"] = True
    if estado["motor"]["direccion"] == "forward" or estado["motor"]["direccion"] is None:
        estado["motor"]["direccion"] = "backward"
    else:
        estado["motor"]["direccion"] = "forward"
    return {"ok": True, "mensaje": f"Fase 5 activada en {device_name}", "estado": estado}


# --- POST: valvulas manuales (con bloqueo por sensor) ---

@app.post("/devices/{device_name}/v1/open")
def v1_open(device_name: str):
    # Bloqueado si sensor minimo activo
    if estado["raceway"]["n1_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel minimo alcanzado")
    estado["raceway"]["v1_vaciado"] = True
    estado["raceway"]["nivel_agua"] = max(0, estado["raceway"]["nivel_agua"] - 20)
    actualizar_sensores_raceway()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v1/close")
def v1_close(device_name: str):
    # Bloqueado si sensor maximo activo (se esta vaciando automaticamente)
    if estado["raceway"]["n2_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: vaciado automatico activo")
    estado["raceway"]["v1_vaciado"] = False
    actualizar_sensores_raceway()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v2/open")
def v2_open(device_name: str):
    # Bloqueado si sensor maximo activo
    if estado["raceway"]["n2_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel maximo alcanzado")
    estado["raceway"]["v2_llenado"] = True
    estado["raceway"]["nivel_agua"] = min(100, estado["raceway"]["nivel_agua"] + 20)
    actualizar_sensores_raceway()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v2/close")
def v2_close(device_name: str):
    if estado["raceway"]["n1_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: llenado automatico activo")
    estado["raceway"]["v2_llenado"] = False
    actualizar_sensores_raceway()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v3/open")
def v3_open(device_name: str):
    if estado["deposito"]["n4_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel maximo deposito")
    estado["deposito"]["v3_entrada"] = True
    estado["deposito"]["nivel"] = min(100, estado["deposito"]["nivel"] + 20)
    actualizar_sensores_deposito()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v3/close")
def v3_close(device_name: str):
    if estado["deposito"]["n3_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: llenado automatico activo")
    estado["deposito"]["v3_entrada"] = False
    actualizar_sensores_deposito()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v4/open")
def v4_open(device_name: str):
    if estado["deposito"]["n3_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel minimo deposito")
    estado["deposito"]["v4_salida"] = True
    estado["deposito"]["nivel"] = max(0, estado["deposito"]["nivel"] - 20)
    actualizar_sensores_deposito()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v4/close")
def v4_close(device_name: str):
    if estado["deposito"]["n4_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: vaciado automatico activo")
    estado["deposito"]["v4_salida"] = False
    actualizar_sensores_deposito()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v5/open")
def v5_open(device_name: str):
    if estado["salida"]["n5_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel minimo salida")
    estado["salida"]["v5_salida"] = True
    estado["salida"]["nivel"] = max(0, estado["salida"]["nivel"] - 20)
    actualizar_sensores_salida()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v5/close")
def v5_close(device_name: str):
    if estado["salida"]["n6_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: vaciado automatico activo")
    estado["salida"]["v5_salida"] = False
    actualizar_sensores_salida()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v6/open")
def v6_open(device_name: str):
    if estado["salida"]["n6_maximo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: nivel maximo salida")
    estado["salida"]["v6_salida"] = True
    estado["salida"]["nivel"] = min(100, estado["salida"]["nivel"] + 20)
    actualizar_sensores_salida()
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v6/close")
def v6_close(device_name: str):
    if estado["salida"]["n5_minimo"]:
        raise HTTPException(status_code=403, detail="Bloqueado: llenado automatico activo")
    estado["salida"]["v6_salida"] = False
    actualizar_sensores_salida()
    return {"ok": True, "estado": estado}