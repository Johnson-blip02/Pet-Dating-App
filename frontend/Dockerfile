# Stage 1: Build the frontend
FROM node:18 AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve with a static server
FROM nginx:alpine

# Add custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
