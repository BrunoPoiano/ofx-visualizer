# OFX Visualizer

A open-source, self-hosted web application for visualizing OFX (Open Financial Exchange) files for privacy-conscious users. This project allows users to upload OFX files, view and filter transactions in a table or chart format, and analyze financial data

![image](https://github.com/user-attachments/assets/9d8938bf-0225-42c7-9601-18d84ad562d0)

## Features

- OFX file upload and parsing
- Transaction visualization with charts and tables
- Dark/Light theme support
- Pagination for transaction lists
- Filter transactions by date range, type, and amount
- Banking information tracking
- Responsive design

## Docker Deploy (Recomended)

You can find the Docker image here: [ofx-visualizer image](https://hub.docker.com/r/brunopoiano/ofx-visualizer)

Build and run using Docker:

```sh
docker run -d -p 8247:8247 --name ofxvisualizer docker.io/brunopoiano/ofx-visualizer:latest
```

or

```sh
services:
  brunopoiano:
    image: "docker.io/brunopoiano/ofx-visualizer:latest"
    container_name: ofxvisualizer
    ports:
      - "8247:8247"
    volumes:
      - path/to/volume:/app/database
```

### from source

Build and run using Docker:

```sh
git clone https://github.com/BrunoPoiano/ofx-visualizer
cd ofx-visualizer
docker build -t ofx-visualizer .
docker run -p 8247:8247 ofx-visualizer
```

## Tech Stack

### Frontend

- React
- TypeScript
- TailwindCSS

### Backend

- Go
- SQLite database

## Local Deploy

### Prerequisites

- Node.js (v20 or later)
- Go (v1.24.3 or later)
- SQLite

### Installation

1. Clone the repository:

```sh
git clone https://github.com/BrunoPoiano/ofx-visualizer
cd ofx-visualizer
```

2. Install frontend dependencies:

```sh
cd frontend
npm install
```

3. Install backend dependencies:

```sh
cd backend
go mod download
```

### Running the Application

1. Start the frontend development server at `http://localhost:5173`:

```sh
cd frontend
npm run dev
```

2. Start the backend development server at `http://localhost:8080`:

```sh
cd backend
go run main.go
```
