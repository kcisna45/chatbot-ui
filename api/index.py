from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import hashlib

app = FastAPI()

# Paste your SourceFieldV11 class here (the one that worked in PowerShell)

@app.get("/api/py/health")
def health():
    return {"status": "SourceField Online", "substrate": "Symmetrical"}

@app.get("/api/py/run-simulation")
def run_simulation():
    # This executes the same logic that gave you the 0.166 score
    sim = SourceFieldV11(n_agents=3, state_size=100, timesteps=100)
    result = sim.run()
    return result