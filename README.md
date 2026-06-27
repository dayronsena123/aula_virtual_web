# Aula Virtual - Grupo de Estudio ULEMA

Esta plataforma web es un aula virtual y landing page premium desarrollada para el **Grupo de Estudio ULEMA**. El sistema está diseñado en modo oscuro con acentos en rojo rubí, interfaces con efecto de cristal (glassmorphism), tipografía de alta legibilidad (Outfit/Inter) y una experiencia libre de emojis.

## Características Clave

1. **Página de Inicio Pública**: Presenta los 3 ciclos principales con tarjetas interactivas y temario:
   - **Repaso Intensivo UNI (Matemática)**: Álgebra, Aritmética, Geometría y Trigonometría.
   - **Cálculo Diferencial**: Límites y Derivadas.
   - **Cálculo Integral**: Integrales y Aplicaciones.
2. **Seguridad de Video (Anti-Descarga)**:
   - **Bloqueo Contextual**: Clic derecho deshabilitado en el reproductor de video.
   - **Controles Personalizados**: Interfaz limpia sin botones de descarga estándar del navegador.
   - **URLs Firmadas (Signed URLs)**: Los enlaces de video almacenados de manera privada en Supabase expiran en 60 segundos, imposibilitando compartir el enlace directo.
   - **Marca de Agua Dinámica**: El DNI y nombre del estudiante flota constantemente sobre el video en reproducción para desalentar las grabaciones de pantalla de terceros.
3. **Panel del Estudiante**: Vista personalizada de los ciclos en los que está matriculado y acceso a clases segmentadas por semanas y días (Lunes a Sábado). Descarga de material didáctico:
   - *Material de Problemas* (Práctica).
   - *Clase Dictada* (Teoría / Solucionario).
4. **Panel de Administrador (Para el Dueño)**:
   - **Gestión de Alumnos**: Registrar nuevos alumnos asociando su DNI (que actúa como usuario) y una contraseña, asignándoles su ciclo académico correspondiente.
   - **Gestión de Contenido**: Crear semanas de clase, añadir sesiones de clase diarias con títulos, enlaces de videos y subir archivos PDF directamente al almacenamiento en la nube.

---

## Guía de Configuración Paso a Paso

### Paso 1: Configurar Supabase (Backend Gratuito)
1. Crea una cuenta gratuita en [Supabase](https://supabase.com).
2. Crea un nuevo proyecto llamado `aula-virtual-ulema`.
3. Ve a la sección **SQL Editor** en el panel de Supabase, crea una nueva consulta ("New query"), copia el contenido completo del archivo [supabase_schema.sql](file:///d:/DESARROLLO%20WEB/aula_virtual_web/supabase_schema.sql) de este proyecto, y haz clic en **Run**. Esto creará todas las tablas, relaciones, datos iniciales y la función segura de administrador.
4. Ve a **Authentication -> Providers -> Email** y **desactiva** la opción "Confirm email" (Confirmar correo). Esto permite que las cuentas que registre el administrador inicien sesión inmediatamente sin requerir verificar una casilla de correo.
5. Ve a **Storage (Almacenamiento)** y crea dos cubos (buckets):
   - `materials`: Márcalo como **público** (Public bucket). Aquí se guardarán los PDFs de teoría y problemas.
   - `videos`: Déjalo como **privado** (Private bucket). Aquí se guardarán los videos de las clases para habilitar los enlaces firmados.

### Paso 2: Crear el Archivo de Variables de Entorno
Crea un archivo llamado `.env` en la raíz de la carpeta del proyecto (usa como base el archivo [.env.example](file:///d:/DESARROLLO%20WEB/aula_virtual_web/.env.example)) y coloca las credenciales de tu proyecto de Supabase (las encuentras en Project Settings -> API):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### Paso 3: Ejecutar en Local
Asegúrate de tener instalado [Node.js](https://nodejs.org). Luego ejecuta en la terminal de la raíz del proyecto:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Abre la dirección [http://localhost:5173](http://localhost:5173) en tu navegador para ver la plataforma funcionando.

### Paso 4: Crear el Primer Administrador
Para poder ingresar al panel `/admin` y gestionar todo, necesitas tener un usuario con el rol `admin`:
1. Registra un usuario de prueba en la landing/login de la web (o créalo desde Supabase Auth).
2. En Supabase, ve a la tabla `profiles` (sección Table Editor).
3. Busca la fila del usuario recién creado y cambia el campo `role` de `'student'` a `'admin'`.
4. ¡Listo! Al iniciar sesión con ese usuario, se activará el enlace "Administración" en la barra lateral.

---

## Despliegue en Línea (Gratis)
Puedes subir este repositorio a tu cuenta de **GitHub** y desplegarlo en minutos en plataformas gratuitas como **Vercel** o **Netlify**:
1. Conecta tu cuenta de GitHub a [Vercel](https://vercel.com).
2. Selecciona este repositorio.
3. En la sección **Environment Variables**, añade las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con sus respectivos valores.
4. Haz clic en **Deploy**. Tendrás el Aula Virtual en línea con HTTPS seguro.
