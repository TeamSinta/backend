# Sinta

Sinta is a development project that combines frontend technologies using Vite and backend technologies using Django with Docker containers.

## Setup
__Requirements:__
- [Node.js](https://nodejs.org/en) (make sure you have Node.js installed on your system)
- [Docker](https://www.docker.com/) (make sure you have Docker installed on your system)
  
## Instructions:

Clone the repository from the source: 
```bash
git clone https://github.com/TeamSinta/teamsinta.git
```

### Frontend Setup:

Navigate to the `frontend` directory:
```bash
cd frontend
```

Create a `.env` file to store project variables
```bash
touch .env
```
Copy and paste the variables found in the .env-file [here](https://www.notion.so/teamsinta/Setup-bf522b83eea142099865032cbf33906a?pvs=4#edc1efb6b4ec496f949249740ae6592c) into your newly created `.env` file.

Install dependencies using npm (Node Package Manager):
```bash
npm install
```

Run the development server:
```bash
npm start
```

This will start the Vite development server, and your frontend will be accessible at http://localhost:3001 by default.

## Storybook

Make sure you have done the above setup before trying to run storybook.

Navigate to the `frontend` directory:
```bash
cd frontend
```

Run the storybook server:
```bash
npm run storybook
```
This will start the Storybook Frontend Documentation server, and your storybook will be accessible at http://localhost:6006/ by default.


### Backend Setup:

Navigate to the `backend_django` directory:
```bash
cd backend_django
```

Create a `.env` file to store project variables
```bash
touch .env
```
Copy and paste the variables found in the .env-file [here](https://www.notion.so/teamsinta/Setup-535411d2a0084082976d1805d768ec3b?pvs=4#7380680e44cc49078148bcedb4b202c5) into the newly created `.env` file.

Install the backend servers in docker:
```bash
docker compose up --build
```
This will install the backend servers, db and setup a default superuser account. _Note that the `--build` attribute is only 'required' the first time._

To shutdown the containers within docker:
```bash
docker compose down
```

To start the backend server again:
```bash
docker compose up
```

This will start the Django server, and your backend will be accessible at http://localhost:8000 by default.
