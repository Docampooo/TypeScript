from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Raceway API - Pruebas")

# CORS para que Next.js pueda hacer fetch sin problemas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado global hardcodeado (simula el hardware)
estado = {
    "motor": {
        "encendido": True,
        "direccion": "forward"   # "forward" | "backward" | None
    },
    "valvula": {
        "abierta": True,
    }
}


# --- GET: estado actual ---

@app.get("/devices/{device_name}/status")
def get_status(device_name: str):
    """Devuelve el estado actual del motor y la valvula."""
    return estado


# --- POST: funciones del raceway ---

@app.post("/devices/{device_name}/fase1")
def fase1(device_name: str, duration: int = 5):
    """Iniciar Motor: motor encendido en forward, valvula cerrada."""
    estado["motor"]["encendido"] = True
    estado["motor"]["direccion"] = "forward"
    estado["valvula"]["abierta"] = False
    return {"ok": True, "mensaje": f"Fase 1 activada en {device_name} durante {duration}s", "estado": estado}


@app.post("/devices/{device_name}/fase2")
def fase2(device_name: str):
    """Motor parado, Valvula abierta."""
    estado["motor"]["encendido"] = False
    estado["motor"]["direccion"] = None
    estado["valvula"]["abierta"] = True
    return {"ok": True, "mensaje": f"Fase 2 activada en {device_name}", "estado": estado}


@app.post("/devices/{device_name}/fase3")
def fase3(device_name: str):
    """Motor encendido, Valvula abierta."""
    estado["motor"]["encendido"] = True
    estado["motor"]["direccion"] = "forward"
    estado["valvula"]["abierta"] = True
    return {"ok": True, "mensaje": f"Fase 3 activada en {device_name}", "estado": estado}


@app.post("/devices/{device_name}/fase4")
def fase4(device_name: str):
    """Cerrar todo: motor apagado, valvula cerrada."""
    estado["motor"]["encendido"] = False
    estado["motor"]["direccion"] = None
    estado["valvula"]["abierta"] = False
    return {"ok": True, "mensaje": f"Fase 4 activada en {device_name}", "estado": estado}


@app.post("/devices/{device_name}/fase5")
def fase5(device_name: str):
    """Motor encendido en direccion opuesta (backward), valvula cerrada."""
    estado["motor"]["encendido"] = True
    estado["motor"]["direccion"] = "backward"
    estado["valvula"]["abierta"] = False
    return {"ok": True, "mensaje": f"Fase 5 activada en {device_name}", "estado": estado}