## Project Structure

- `frontend/`: React application with a chat interface
- `backend/`: Python FastAPI server for LLM integration
- `data/`: Directory to store the BMW X Series manual PDF
- `docker-compose.yml`: Docker Compose configuration for the entire application

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- BMW X1 Series manual PDF

### Configuration

1. Create a `.env` file in the root directory with your API keys e.g. :
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

1. Build and start the containers:
   ```
   docker-compose up -d --build
   ```

2. Access the chatbot at http://localhost

3. To view logs
   ```
   docker compose logs -f backend
   ```

4. To stop the application:
   ```
   docker-compose down
   ```
