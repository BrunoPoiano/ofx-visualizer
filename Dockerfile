FROM node:20 AS frontend

WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install
RUN npm run lint
RUN npm run format:clean
RUN npm run build

FROM golang:1.24.3-alpine3.21 AS backend

WORKDIR /app
COPY backend/ .
COPY --from=frontend /app/frontend/dist ./frontend/dist
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o ofxvisualizer .

FROM alpine:3.21

WORKDIR /app
COPY --from=backend /app/ofxvisualizer ./
RUN mkdir -p /app/database && chmod 777 /app/database
RUN mkdir -p /app/frontend/dist && chmod 777 /app/frontend/dist
COPY --from=backend /app/ofxvisualizer .
COPY --from=backend /app/frontend/dist ./frontend/dist
EXPOSE 8247

CMD ["./ofxvisualizer"]
