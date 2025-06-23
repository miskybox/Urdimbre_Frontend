# Urdimbre\_Frontend 💻

![Estado: en desarrollo](https://img.shields.io/badge/estado-en_desarrollo-yellow)  ![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-blue)  ![Build Status](https://github.com/tu-usuario/Urdimbre_Frontend/actions/workflows/ci.yml/badge.svg)



## 📖 Descripción

**Urdimbre\_Frontend** es la interfaz web oficial de la asociación Urdimbre, construida con **React 18**, **Vite**, **JSX** y **CSS Modules**. Permite a usuarios trans, no binarios e intersex interactuar con la plataforma: registrarse, iniciar sesión, consultar eventos y gestionar su perfil.



## ✨ Características principales

* **Registro y login** integrados con la API REST de Urdimbre
* **Dashboard** de usuario con visualización de actividades y eventos
* **Panel de administración** para roles con permisos elevados
* **Rutas protegidas** usando React Router
* **Gestión de estado** con React Context API
* **Petición de datos** mediante Axios
* **Estilos** organizados con CSS Modules para alcance local y mantenible
* **Documentación** de componentes con comentarios JSDoc

## 🛠 Tecnologías

| Categoría          | Tecnología                  |
| ------------------ | --------------------------- |
| Lenguaje           | JavaScript (ES6+)           |
| Framework UI       | React 18                    |
| Bundler            | Vite                        |
| Ruteo              | React Router v6             |
| Estado global      | React Context API           |
| Peticiones HTTP    | Axios                       |
| Estilos            | CSS Modules                 |
| Linter / Formatter | ESLint, Prettier            |
| Pruebas            | Jest, React Testing Library |

## 🚀 Instalación y arranque

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/Urdimbre_Frontend.git
   cd Urdimbre_Frontend
   ```
2. Instala dependencias:

   ```bash
   npm install    # ó yarn install
   ```
3. Configura la URL de la API en `.env`:

   ```env
   VITE_API_BASE_URL=https://api.urdimbre.org
   ```
4. Inicia en modo desarrollo:

   ```bash
   npm run dev    # ó yarn dev
   ```
5. Abre tu navegador en `http://localhost:5173`
6. Para producción:

   ```bash
   npm run build  # ó yarn build
   ```

## 📁 Estructura del proyecto

```
Urdimbre_Frontend/
├── public/                # Archivos estáticos
├── src/                   # Código fuente
│   ├── assets/            # Imágenes y fuentes
│   ├── components/        # Componentes reutilizables
│   ├── contexts/          # Contextos de React
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Vistas / rutas
│   ├── services/          # Configuración de Axios
│   ├── styles/            # CSS Modules globales
│   ├── utils/             # Utilidades y helpers
│   ├── App.jsx            # Punto de entrada de la app
│   └── main.jsx           # Bootstrap de React y Vite
├── .env                   # Variables de entorno
├── vite.config.js         # Configuración de Vite
├── package.json
└── README.md              # Este archivo
```

## 🧪 Pruebas

Ejecuta las pruebas:

```bash
npm run test    # ó yarn test
```

![Dashboard UI](assets/image2.png)

## 🤝 Contribución

1. Haz un fork del proyecto.
2. Crea una rama y muévete a ella:

   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. Realiza cambios y commitea:

   ```bash
   git commit -m "Descripción de mi cambio"
   ```
4. Empuja tu rama y abre un Pull Request.

Por favor, añade pruebas para nuevos componentes y sigue las reglas de ESLint.

## 👥 Equipo de desarrollo

* [Eva Sisalli](https://www.linkedin.com/in/eva-sisalli-guzman/)
* [Alba Rieradipe](https://www.linkedin.com/in/rieradipefullstack/)
* [Einar Tech](https://www.linkedin.com/in/einartech/)
* [Mariana Marín](https://www.linkedin.com/in/mariana-marin-1b6268348/)
* [María Bongoll](https://www.linkedin.com/in/mariabongoll/)

## 📄 Licencia MIT

Este proyecto utiliza la [Licencia MIT](https://opensource.org/licenses/MIT).

