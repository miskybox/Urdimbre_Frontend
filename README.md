<!-- Logo opcional -->

<p align="center">
  <img src="https://github.com/tu-usuario/Urdimbre_Frontend/assets/logo.png" alt="Urdimbre Logo" width="120" />
</p>

# Urdimbre\_Frontend 💻

<p align="center">
  <a href="https://img.shields.io/badge/estado-en_desarrollo-yellow"><img src="https://img.shields.io/badge/estado-en_desarrollo-yellow" alt="Estado"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/licencia-MIT-blue" alt="Licencia"></a>
  <a href="https://github.com/tu-usuario/Urdimbre_Frontend/actions"><img src="https://github.com/tu-usuario/Urdimbre_Frontend/workflows/CI/badge.svg" alt="Build Status"></a>
</p>

<p align="center">
  <img src="https://github.com/tu-usuario/Urdimbre_Frontend/assets/landing_page.png" alt="Pantalla principal" width="80%" />
</p>

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
   npm install
   # o
   yarn install
   ```
3. Configura la URL de la API en `.env`:

   ```env
   VITE_API_BASE_URL=https://api.urdimbre.org
   ```
4. Inicia en modo desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   ```
5. Accede en tu navegador:

   ```text
   http://localhost:5173
   ```
6. Para producción:

   ```bash
   npm run build
   # o
   yarn build
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

Ejecuta las pruebas con:

```bash
npm run test
# o
yarn test
```


<p align="center">
  <img src="https://github.com/tu-usuario/Urdimbre_Frontend/assets/dashboard_screenshot.png" alt="Dashboard UI" width="80%" />
</p>

## 🤝 Contribución

1. Haz un fork del proyecto.
2. Crea una rama:

   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```
3. Realiza cambios y commitea:

   ```bash
   git commit -m "Descripción del cambio"
   ```
4. Envía un pull request.

> Por favor, añade pruebas para nuevos componentes y sigue las reglas de ESLint.

## 👥 Equipo de desarrollo

* [Eva Sisalli](https://www.linkedin.com/in/eva-sisalli-guzman/)
* [Alba Rieradipe](https://www.linkedin.com/in/rieradipefullstack/)
* [Einar Tech](https://www.linkedin.com/in/einartech/)
* [Mariana Marín](https://www.linkedin.com/in/mariana-marin-1b6268348/)
* [María Bongoll](https://www.linkedin.com/in/mariabongoll/)

## 📄 Licencia MIT

MIT License

Copyright (c) 2025 Urdimbre

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
