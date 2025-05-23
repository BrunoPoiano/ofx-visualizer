FROM node:20 AS frontend

WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install --force
RUN npm run build


FROM golang:1.24.3-alpine3.21 AS builder

WORKDIR /build
COPY /backend .

COPY --from=frontend /app/frontend/dist ./frontend/dist

RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o ofxvisualizer .

FROM alpine:3.21

WORKDIR /app/ofxvisualizer

COPY --from=builder /build/ofxvisualizer ./

# Create database directory with proper permissions
RUN mkdir -p /app/ofxvisualizer/database && chmod 777 /app/ofxvisualizer/database

EXPOSE 8080

CMD ["./ofxvisualizer"]
