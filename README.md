# 🌐 Hotel Reservations SPA – Frontend

Frontend del sistema de reservas de hotel desarrollado en **Angular 20**, consumiendo la API REST del backend. Implementa autenticación JWT, gestión de habitaciones, reservas y checkout.

---

## 🚀 Tecnologías

- Angular 20  
- TypeScript  
- RxJS  
- Angular Material  
- SCSS  
- JWT Interceptor  
- Lazy Loading + Modularización avanzada  

---

## 📌 Funcionalidades principales

### 🏨 Habitaciones
- Listado con paginación
- Filtros por tipo, precio, capacidad
- Vista de detalle
- Cálculo dinámico de noches y precio

### 📅 Reservas
- Crear reserva desde el detalle
- Ver reservas del usuario
- Modificar fechas
- Cancelar reserva
- Checkout

### 🔐 Autenticación
- Login y registro
- Manejo de sesión persistente con JWT
- Guards para rutas protegidas
- Interceptor para inyectar token automáticamente

### 🧩 UX/UI
- Angular Material
- SweetAlert
- Spinners, Snackbars, feedback visual
- Errores globales manejados desde interceptor

---

## ▶️ Ejecutar en local

### Requisitos
- Node 20+
- Angular CLI 20+

### Instalar dependencias
npm install

###Iniciar servidor de desarrollo
ng serve -o

###Aplicación disponible en:
http://localhost:4200

## Crear usuario
Se debe crear un usuario en la pantalla de Inicio de sesion para poder realizar reservaciones de habitaciones
Las habitaciones si son visibles sin autenticacion (Agregar habitaciones en api desde collection)



# Configuracion Docker
## Instala dependencias
COPY package*.json ./
RUN npm install

## Copia el código fuente y genera la build de producción
COPY . .
RUN npm run build -- --configuration production


Descripción:

Se usa node:22-alpine para minimizar el tamaño.

Se instalan dependencias con npm install.

Se genera la build optimizada con npm run build.

El resultado final queda en:
dist/hotel-front/browser

🌐 Etapa 2 — Servidor Nginx para SPA (nginx:stable-alpine)

Esta etapa copia la build generada y configura Nginx para servir correctamente la SPA.

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

## Elimina configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

## Copia configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

## Copia la aplicación Angular compilada
COPY --from=build /app/dist/hotel-front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

