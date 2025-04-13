# Stage 1: Build the Vite project
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the project using Vite
RUN npx vite build --outDir="./docs"
FROM nginx:alpine
COPY --from=build-stage /app/docs /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]