# Tres Astronautas API

Este proyecto es una API REST construida con NestJS, un framework progresivo de Node.js. La aplicación utiliza MongoDB como base de datos y está diseñada con una arquitectura moderna y escalable.

## Tecnologías Principales

- NestJS v11
- MongoDB
- Passport JWT para autenticación
- Swagger para documentación de API
- Docker para contenerización

## Requisitos Previos

- Node.js (v18 o superior)
- npm (viene con Node.js)
- Docker y Docker Compose (para desarrollo con contenedores)
- MongoDB (si se ejecuta localmente)

## Configuración del Proyecto

1. Clonar el repositorio:
```bash
git clone https://github.com/luisbedoia/tres_astronautas.git
cd tres_astronautas
```

2. Instalar dependencias:
```bash
npm install
```


## Ejecutar el Proyecto

### Usando Docker

```bash
# Construir y levantar los contenedores
docker-compose up -d

# Detener los contenedores
docker-compose down
```

El servidor estará disponible en `http://localhost:3000` por defecto.

## Documentación API

La documentación de la API está disponible a través de Swagger UI en:
```
http://localhost:3000/api
```
