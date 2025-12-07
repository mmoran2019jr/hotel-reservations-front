# --------- Etapa 1: build Angular ---------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# --------- Etapa 2: Nginx para servir la SPA ---------
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# Borramos config por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra config de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos la build de Angular (ajusta si tu carpeta dist tiene otro nombre)
COPY --from=build /app/dist/hotel-front/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
