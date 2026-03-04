from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Raceway API - Pruebas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado global hardcodeado (simula el hardware)
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


# --- GET: estado completo ---

@app.get("/devices/{device_name}/status")
def get_status(device_name: str):
    return estado


# --- POST: fases del motor ---

@app.post("/devices/{device_name}/fase1")
def fase1(device_name: str, duration: int = 5):
    """Iniciar Motor forward, valvula cerrada."""
    estado["motor"]["encendido"] = True
    
    if estado["motor"]["direccion"] is None :
        estado["motor"]["direccion"] = "forward"
        
    estado["raceway"]["v2_llenado"] = False
    return {"ok": True, "mensaje": f"Fase 1 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase2")
def fase2(device_name: str):
    """Motor parado, valvula llenado abierta."""
    estado["motor"]["encendido"] = False
    estado["raceway"]["v2_llenado"] = True
    estado["raceway"]["v1_vaciado"] = False
    return {"ok": True, "mensaje": f"Fase 2 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase3")
def fase3(device_name: str):
    """Motor encendido, valvula llenado abierta."""
    estado["motor"]["encendido"] = True
    
    if estado["motor"]["direccion"] is None :
        estado["motor"]["direccion"] = "forward"
        
    estado["raceway"]["v2_llenado"] = True
    return {"ok": True, "mensaje": f"Fase 3 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase4")
def fase4(device_name: str):
    """Cerrar todo."""
    estado["motor"]["encendido"] = False
    estado["raceway"]["v1_vaciado"] = False
    estado["raceway"]["v2_llenado"] = False
    estado["deposito"]["v3_entrada"] = False
    estado["deposito"]["v4_salida"] = False
    estado["salida"]["v5_salida"] = False
    estado["salida"]["v6_salida"] = False
    return {"ok": True, "mensaje": f"Fase 4 activada en {device_name}", "estado": estado}

@app.post("/devices/{device_name}/fase5")
def fase5(device_name: str):
    """Motor backward."""
    estado["motor"]["encendido"] = True
    
    if estado["motor"]["direccion"] == "forward" or estado["motor"]["direccion"] is None :
        estado["motor"]["direccion"] = "backward"
    else:
        estado["motor"]["direccion"] = "forward"

    return {"ok": True, "mensaje": f"Fase 5 activada en {device_name}", "estado": estado}


# --- POST: control manual valvulas raceway ---

@app.post("/devices/{device_name}/v1/open")
def v1_open(device_name: str):
    estado["raceway"]["v1_vaciado"] = True
    nivel = estado["raceway"]["nivel_agua"]
    if nivel > 0:
        estado["raceway"]["nivel_agua"] = max(0, nivel - 20)
    estado["raceway"]["n1_minimo"] = estado["raceway"]["nivel_agua"] <= 20
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v1/close")
def v1_close(device_name: str):
    estado["raceway"]["v1_vaciado"] = False
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v2/open")
def v2_open(device_name: str):
    estado["raceway"]["v2_llenado"] = True
    nivel = estado["raceway"]["nivel_agua"]
    if nivel < 100:
        estado["raceway"]["nivel_agua"] = min(100, nivel + 20)
    estado["raceway"]["n2_maximo"] = estado["raceway"]["nivel_agua"] >= 80
    estado["raceway"]["n1_minimo"] = estado["raceway"]["nivel_agua"] <= 20
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v2/close")
def v2_close(device_name: str):
    estado["raceway"]["v2_llenado"] = False
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v3/open")
def v3_open(device_name: str):
    estado["deposito"]["v3_entrada"] = True
    nivel = estado["deposito"]["nivel"]
    estado["deposito"]["nivel"] = min(100, nivel + 20)
    estado["deposito"]["n4_maximo"] = estado["deposito"]["nivel"] >= 80
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v3/close")
def v3_close(device_name: str):
    estado["deposito"]["v3_entrada"] = False
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v4/open")
def v4_open(device_name: str):
    estado["deposito"]["v4_salida"] = True
    nivel = estado["deposito"]["nivel"]
    estado["deposito"]["nivel"] = max(0, nivel - 20)
    estado["deposito"]["n3_minimo"] = estado["deposito"]["nivel"] <= 20
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v4/close")
def v4_close(device_name: str):
    estado["deposito"]["v4_salida"] = False
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v5/open")
def v5_open(device_name: str):
    estado["salida"]["v5_salida"] = True
    nivel = estado["salida"]["nivel"]
    estado["salida"]["nivel"] = max(0, nivel - 20)
    estado["salida"]["n5_minimo"] = estado["salida"]["nivel"] <= 20
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v5/close")
def v5_close(device_name: str):
    estado["salida"]["v5_salida"] = False
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v6/open")
def v6_open(device_name: str):
    estado["salida"]["v6_salida"] = True
    nivel = estado["salida"]["nivel"]
    estado["salida"]["nivel"] = min(100, nivel + 20)
    estado["salida"]["n6_maximo"] = estado["salida"]["nivel"] >= 80
    return {"ok": True, "estado": estado}

@app.post("/devices/{device_name}/v6/close")
def v6_close(device_name: str):
    estado["salida"]["v6_salida"] = False
    return {"ok": True, "estado": estado}