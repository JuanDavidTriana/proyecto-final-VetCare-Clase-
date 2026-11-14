# Despliegue local de VetCare con Docker y WSL

Esta guía explica cómo levantar VetCare localmente en Windows usando Docker Desktop con integración WSL 2. La configuración de `docker-compose.yml` inicia MongoDB, Mongo Express, la API y la aplicación web.

> Esta configuración está pensada para desarrollo y demostración local, no para exponer el sistema a Internet. Usa credenciales de desarrollo y Mongo Express no tiene autenticación.

## Requisitos

- Windows con WSL 2 instalado y una distribución Linux disponible.
- Docker Desktop instalado y en ejecución, con integración WSL habilitada para la distribución que se usará.
- El repositorio clonado y accesible desde WSL.

En una terminal WSL, comprueba que Docker y Compose estén disponibles:

```bash
docker --version
docker compose version
```

Si Docker no responde, inicia Docker Desktop y revisa **Settings > Resources > WSL Integration**.

## Iniciar el proyecto

Abre la terminal de tu distribución WSL y entra en la carpeta `app` del repositorio. Si el repositorio está en el disco `C:`, la ruta desde WSL tendrá este formato:

```bash
cd "/mnt/c/Users/<USUARIO>/Github/proyecto-final-VetCare(Clase)/app"
```

Reemplaza `<USUARIO>` por el nombre de tu usuario de Windows. Si clonaste el repositorio dentro del sistema de archivos de Linux, usa la ruta donde lo guardaste, por ejemplo `cd ~/proyecto-final-VetCare(Clase)/app`.

Construye las imágenes e inicia los contenedores:

```bash
docker compose up -d --build
```

La primera ejecución puede tardar mientras Docker descarga imágenes e instala las dependencias. Para confirmar el estado:

```bash
docker compose ps
```

Espera a que MongoDB y la API aparezcan como `healthy`.

## Abrir y verificar la aplicación

- Aplicación web: <http://localhost:4200>
- API: <http://localhost:3000>
- Estado de la API y conexión a la base de datos: <http://localhost:3000/health>
- Administrador de MongoDB (Mongo Express): <http://localhost:8081>

La ruta `/health` debe responder con estado HTTP `200` e indicar `"db":"connected"`.

## Comandos útiles

Ejecuta estos comandos desde la carpeta `app`:

```bash
# Ver el estado de los servicios
docker compose ps

# Seguir los registros de todos los servicios
docker compose logs -f

# Ver los registros de un servicio específico
docker compose logs -f api

# Detener los servicios y conservar los datos de MongoDB
docker compose down

# Volver a construir y recrear los servicios
docker compose up -d --build
```

Los datos de MongoDB se conservan en el volumen Docker `mongo_data` al ejecutar `docker compose down`. Para borrar también ese volumen y todos los datos de la base de datos, ejecuta `docker compose down -v`; esta acción es irreversible.

## Configuración de desarrollo

Compose define puertos, credenciales de MongoDB y una clave de autenticación de desarrollo por defecto. No publiques esta configuración en un servidor ni reutilices esos valores para producción. La clave puede sobrescribirse antes de iniciar los contenedores:

```bash
export BETTER_AUTH_SECRET="$(openssl rand -hex 32)"
docker compose up -d --build
```

Para un despliegue real se deben configurar secretos y credenciales seguras, habilitar autenticación para las herramientas administrativas y revisar los puertos expuestos y las reglas de red.

## Solución de problemas

- **`docker: command not found` en WSL:** inicia Docker Desktop y habilita la integración WSL para tu distribución en sus ajustes.
- **Un contenedor no inicia o queda en `unhealthy`:** consulta `docker compose ps` y `docker compose logs <servicio>`, donde `<servicio>` puede ser `mongo`, `api`, `web` o `mongo-express`.
- **Un puerto ya está en uso:** libera el puerto local correspondiente (`27017`, `3000`, `4200` o `8081`) y vuelve a iniciar Compose.
- **Cambiaste código o configuración de construcción:** vuelve a ejecutar `docker compose up -d --build`.
