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
