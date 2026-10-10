from fastapi import FastAPI

# Initialize the FastAPI app
app = FastAPI(
    title="Basic FastAPI Backend",
    description="A simple API template to get you started.",
    version="1.0.0",
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, World! Welcome to your FastAPI backend."}

# Endpoint with path and query parameters
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "query": q}