async def on_load():
    print("on_load")
    from .models import AppState
    AppState.set_ready_status(True)

async def process_query(state, query):
    print("No images were extracted. !")
    return "lmao not a query anymore!"