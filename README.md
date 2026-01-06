# 📋 Distribución de Trabajo OpenBlind - Feature-First Architecture

**Carpetas específicas que usa:**

# 📋 DISTRIBUCIÓN DETALLADA DE TAREAS POR ESTUDIANTE

---

## 👨‍💻 **N°4 - ANGELO JOEL VERA BRAVO**

### **Tarea 1: Gestión de Usuarios (CRUD Completo)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── users/
│       ├── screens/
│       │   ├── UsersListScreen.tsx          # READ: Listar usuarios
│       │   ├── UserDetailScreen.tsx         # READ: Ver detalle completo
│       │   └── UserFormScreen.tsx           # CREATE/UPDATE: Alta y edición
│       │
│       ├── components/
│       │   ├── UsersTable.tsx               # Tabla principal con paginación
│       │   ├── UserCard.tsx                 # Card para vista de detalle
│       │   ├── UserStatusBadge.tsx          # Badge (activo/bloqueado)
│       │   ├── UserFilters.tsx              # Filtros de búsqueda
│       │   └── UserProfileView.tsx          # Vista: perfil, tarjeta, contactos
│       │
│       ├── hooks/
│       │   ├── useUsers.ts                  # Hook para listar/obtener usuarios
│       │   └── useUserActions.ts            # Hook para CREATE/UPDATE/DELETE
│       │
│       ├── services/
│       │   └── usersService.ts              # Llamadas API: GET, POST, PUT, DELETE
│       │
│       └── types/
│           └── user.types.ts                # Interfaces: User, UserStatus, etc.
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── tables/
│   │   ├── DataTable.tsx                    # Tabla base reutilizable
│   │   ├── TablePagination.tsx              # Paginación
│   │   └── TableFilters.tsx                 # Sistema de filtros
│   │
│   ├── modals/
│   │   ├── Modal.tsx                        # Modal genérico
│   │   └── ConfirmDialog.tsx                # Confirmar DELETE/UPDATE estado
│   │
│   ├── buttons/
│   │   └── ActionButton.tsx                 # Botones de acciones CRUD
│   │
│   └── feedback/
│       └── EmptyState.tsx                   # Estado vacío "No hay usuarios"
│
└── utils/
    └── export.utils.ts                      # Exportar lista a CSV/Excel
```

---

### **Tarea 2: Gestión de Lugares y Zonas (CRUD Completo)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── places/
│       ├── screens/
│       │   ├── PlacesListScreen.tsx         # READ: Listar lugares favoritos
│       │   ├── SafeZonesScreen.tsx          # CREATE/READ/UPDATE: Zonas seguras
│       │   └── CriticalPointsScreen.tsx     # CREATE/READ/UPDATE: Puntos críticos
│       │
│       ├── components/
│       │   ├── PlacesTable.tsx              # Tabla de lugares frecuentes
│       │   ├── ZoneMap.tsx                  # Mapa interactivo (Leaflet)
│       │   ├── PlaceForm.tsx                # Formulario CREATE/UPDATE lugares
│       │   ├── ZoneClassification.tsx       # Selector de tipo de zona
│       │   └── PlaceFilters.tsx             # Filtros por zona/usuario
│       │
│       ├── hooks/
│       │   ├── usePlaces.ts                 # Hook para lugares favoritos
│       │   └── useZones.ts                  # Hook para zonas seguras/críticas
│       │
│       ├── services/
│       │   └── placesService.ts             # API: zonas, puntos, lugares
│       │
│       └── types/
│           └── place.types.ts               # Interfaces: Place, Zone, Point
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── inputs/
│   │   └── SearchInput.tsx                  # Búsqueda de lugares
│   │
│   ├── modals/
│   │   ├── Modal.tsx                        # Modal para formularios
│   │   └── ConfirmDialog.tsx                # Confirmar DELETE zona/punto
│   │
│   └── feedback/
│       └── Loading.tsx                      # Cargando mapa
│
└── utils/
    └── format.utils.ts                      # Formatear coordenadas
```

**Dependencia externa:**
- `leaflet` y `react-leaflet` para el mapa interactivo

---

## 👨‍💻 **N°4 - OSCAR JAVIER SORIA TUPIZA**

### **Tarea 3: Gestión de Contactos de Emergencia (Solo lectura)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── emergency-contacts/
│       ├── screens/
│       │   ├── ContactsOverviewScreen.tsx   # READ: Vista global de contactos
│       │   └── UserContactsScreen.tsx       # READ: Contactos por usuario
│       │
│       ├── components/
│       │   ├── ContactsTable.tsx            # Tabla de contactos
│       │   ├── ContactCard.tsx              # Card individual de contacto
│       │   └── ContactFilters.tsx           # Filtros por usuario/parentesco
│       │
│       ├── hooks/
│       │   └── useEmergencyContacts.ts      # Hook solo READ
│       │
│       ├── services/
│       │   └── contactsService.ts           # API: GET contactos
│       │
│       └── types/
│           └── contact.types.ts             # Interface: EmergencyContact
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── tables/
│   │   ├── DataTable.tsx                    # Tabla base
│   │   └── TablePagination.tsx              # Paginación
│   │
│   └── feedback/
│       └── EmptyState.tsx                   # "No hay contactos"
│
└── utils/
    └── export.utils.ts                      # Exportar contactos a CSV
```

---

### **Tarea 4: Gestión de Navegación y Geolocalización (Configuración y Stats)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── navigation/
│       ├── screens/
│       │   ├── NavigationStatsScreen.tsx    # READ: Estadísticas de uso
│       │   └── RouteConfigScreen.tsx        # UPDATE: Configurar parámetros
│       │
│       ├── components/
│       │   ├── RouteStatsTable.tsx          # Tabla: cantidad de rutas
│       │   ├── PopularZonesChart.tsx        # Gráfico: zonas más usadas
│       │   ├── RetentionPolicyForm.tsx      # Form: políticas de retención
│       │   └── MapProviderConfig.tsx        # Form: configurar proveedor mapas
│       │
│       ├── hooks/
│       │   ├── useNavigationStats.ts        # Hook para estadísticas
│       │   └── useRouteConfig.ts            # Hook para configuración
│       │
│       ├── services/
│       │   └── navigationService.ts         # API: stats y config
│       │
│       └── types/
│           └── navigation.types.ts          # Interfaces: Stats, Config
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── charts/
│   │   ├── BarChart.tsx                     # Gráfico de rutas por día
│   │   └── PieChart.tsx                     # Zonas más populares
│   │
│   ├── inputs/
│   │   ├── Input.tsx                        # Inputs de config
│   │   └── Select.tsx                       # Selector proveedor mapas
│   │
│   └── cards/
│       └── StatsCard.tsx                    # Card para métricas
│
└── utils/
    └── format.utils.ts                      # Formatear números/stats
```

---

## 👨‍💻 **N°5 - DAVID ALEJANDRO MALDONADO DELGADO**

### **Tarea 5: Gestión de Incidencias (CRUD Completo)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── incidents/
│       ├── screens/
│       │   ├── IncidentsListScreen.tsx      # READ: Listar incidencias
│       │   ├── IncidentDetailScreen.tsx     # READ: Detalle de incidencia
│       │   └── IncidentFormScreen.tsx       # CREATE: Registrar nueva
│       │
│       ├── components/
│       │   ├── IncidentsTable.tsx           # Tabla con filtros
│       │   ├── IncidentCard.tsx             # Card de incidencia
│       │   ├── IncidentStatusBadge.tsx      # Badge de estado
│       │   ├── IncidentFilters.tsx          # Filtros: zona, fecha, tipo
│       │   ├── IncidentMap.tsx              # Mapa con marcadores
│       │   └── IncidentTimeline.tsx         # Línea temporal de cambios
│       │
│       ├── hooks/
│       │   ├── useIncidents.ts              # Hook READ
│       │   └── useIncidentActions.ts        # Hook CREATE/UPDATE/DELETE
│       │
│       ├── services/
│       │   └── incidentsService.ts          # API CRUD completo
│       │
│       └── types/
│           └── incident.types.ts            # Interfaces: Incident, Status
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── tables/
│   │   ├── DataTable.tsx                    # Tabla base
│   │   ├── TablePagination.tsx              # Paginación
│   │   └── TableFilters.tsx                 # Sistema de filtros
│   │
│   ├── modals/
│   │   ├── Modal.tsx                        # Modal para formulario
│   │   └── ConfirmDialog.tsx                # Confirmar DELETE/archivar
│   │
│   ├── inputs/
│   │   ├── DatePicker.tsx                   # Selector de fechas
│   │   └── Select.tsx                       # Selector de estado/tipo
│   │
│   ├── badges/
│   │   └── StatusBadge.tsx                  # Badge reutilizable
│   │
│   └── feedback/
│       └── EmptyState.tsx                   # "No hay incidencias"
│
└── utils/
    └── date.utils.ts                        # Formatear fechas
```

**Dependencia externa:**
- `leaflet` y `react-leaflet` para el mapa de incidencias

---

### **Tarea 6: Gestión de Soporte (CRUD Tickets)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── support/
│       ├── screens/
│       │   ├── TicketsListScreen.tsx        # READ: Listar tickets
│       │   └── TicketDetailScreen.tsx       # READ/UPDATE: Ver y responder
│       │
│       ├── components/
│       │   ├── TicketsTable.tsx             # Tabla con filtros
│       │   ├── TicketCard.tsx               # Card de ticket
│       │   ├── TicketStatusBadge.tsx        # Badge de estado
│       │   ├── TicketFilters.tsx            # Filtros: estado, prioridad
│       │   ├── TicketResponses.tsx          # Historial respuestas
│       │   └── TicketPrioritySelector.tsx   # Selector prioridad
│       │
│       ├── hooks/
│       │   ├── useTickets.ts                # Hook READ
│       │   └── useTicketActions.ts          # Hook UPDATE/DELETE
│       │
│       ├── services/
│       │   └── supportService.ts            # API tickets
│       │
│       └── types/
│           └── ticket.types.ts              # Interfaces: Ticket, Response
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── tables/
│   │   ├── DataTable.tsx                    # Tabla base
│   │   └── TableFilters.tsx                 # Filtros
│   │
│   ├── badges/
│   │   ├── StatusBadge.tsx                  # Estado del ticket
│   │   └── PriorityBadge.tsx                # Prioridad (alta/media/baja)
│   │
│   ├── modals/
│   │   └── ConfirmDialog.tsx                # Confirmar archivar
│   │
│   └── feedback/
│       └── EmptyState.tsx                   # "No hay tickets"
│
└── utils/
    └── date.utils.ts                        # Formatear fechas
```

---

## 👩‍💻 **N°5 - JOSSELYN PAMELA MOPOSITA PILATAXI**

### **Tarea 7: Dashboard Admin (Métricas y Gráficos)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── dashboard/
│       ├── screens/
│       │   └── DashboardScreen.tsx          # Vista principal con todas las métricas
│       │
│       ├── components/
│       │   ├── MetricsCard.tsx              # Card individual de métrica
│       │   ├── ActiveUsersChart.tsx         # Gráfico: usuarios activos
│       │   ├── RoutesChart.tsx              # Gráfico: rutas por día
│       │   ├── IncidentsChart.tsx           # Gráfico: incidencias reportadas
│       │   └── ModulesUsageChart.tsx        # Gráfico: uso de módulos
│       │
│       ├── hooks/
│       │   └── useDashboardMetrics.ts       # Hook para obtener métricas
│       │
│       ├── services/
│       │   └── dashboardService.ts          # API: métricas agregadas
│       │
│       └── types/
│           └── dashboard.types.ts           # Interfaces: Metrics
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── cards/
│   │   └── StatsCard.tsx                    # Card base para métricas
│   │
│   ├── charts/
│   │   ├── LineChart.tsx                    # Tendencias temporales
│   │   ├── BarChart.tsx                     # Comparativas
│   │   ├── PieChart.tsx                     # Distribuciones
│   │   └── AreaChart.tsx                    # Áreas acumuladas
│   │
│   └── feedback/
│       └── Loading.tsx                      # Skeleton de gráficos
│
└── utils/
    └── format.utils.ts                      # Formatear números grandes
```

**Dependencia externa:**
- `recharts` para todos los gráficos

---

### **Tarea 8: Configuraciones - Parte 1 (Accesibilidad, Navegación, Geolocalización)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── settings/
│       ├── screens/
│       │   ├── AccessibilityConfigScreen.tsx    # Config accesibilidad
│       │   ├── NavigationConfigScreen.tsx       # Config navegación
│       │   └── GeolocationConfigScreen.tsx      # Config geolocalización
│       │
│       ├── components/
│       │   ├── ConfigSection.tsx                # Sección reutilizable
│       │   ├── FontSizeConfig.tsx               # Slider tamaño fuente
│       │   ├── ThemeConfig.tsx                  # Selector tema
│       │   ├── VoiceConfig.tsx                  # Config idioma/voz
│       │   ├── RouteParametersForm.tsx          # Form parámetros rutas
│       │   ├── RetentionPolicyForm.tsx          # Form retención ubicaciones
│       │   └── TrackingConfig.tsx               # Config tracking background
│       │
│       ├── hooks/
│       │   ├── useSettings.ts                   # Hook READ settings
│       │   └── useConfigUpdate.ts               # Hook UPDATE
│       │
│       ├── services/
│       │   └── settingsService.ts               # API configuraciones
│       │
│       └── types/
│           └── settings.types.ts                # Interfaces: Config
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── inputs/
│   │   ├── Input.tsx                        # Inputs genéricos
│   │   ├── Select.tsx                       # Selectores
│   │   └── DatePicker.tsx                   # Selector retención días
│   │
│   ├── buttons/
│   │   └── Button.tsx                       # Botón guardar
│   │
│   └── feedback/
│       └── SuccessMessage.tsx               # Confirmación guardado
│
└── utils/
    └── validation.utils.ts                  # Validar configs
```

---

## 👨‍💻 **N°5 - RONNY ANTONIO VILLA VILLA**

### **Tarea 9: Configuraciones - Parte 2 (Tarjeta ID y Notificaciones)**

#### Carpetas que utiliza:
```
src/
├── features/
│   └── settings/
│       ├── screens/
│       │   ├── IDCardConfigScreen.tsx           # Config tarjeta ID
│       │   └── NotificationsConfigScreen.tsx    # Config notificaciones
│       │
│       ├── components/
│       │   ├── SettingsForm.tsx                 # Form base reutilizable
│       │   ├── IDCardFieldsConfig.tsx           # Config campos obligatorios
│       │   ├── QRConfig.tsx                     # Config estructura QR
│       │   ├── NotificationChannelsConfig.tsx   # Config canales (push/email/SMS)
│       │   └── MessageTemplates.tsx             # Plantillas de mensajes
│       │
│       ├── hooks/
│       │   ├── useSettings.ts                   # Hook READ (compartido)
│       │   └── useConfigUpdate.ts               # Hook UPDATE (compartido)
│       │
│       ├── services/
│       │   └── settingsService.ts               # API (compartido)
│       │
│       └── types/
│           └── settings.types.ts                # Interfaces (compartido)
```

#### Componentes compartidos que usa:
```
src/shared/
├── components/
│   ├── inputs/
│   │   ├── Input.tsx                        # Inputs
│   │   └── Select.tsx                       # Selectores
│   │
│   ├── buttons/
│   │   └── Button.tsx                       # Botón guardar
│   │
│   ├── modals/
│   │   └── Modal.tsx                        # Modal para previsualizar QR
│   │
│   └── feedback/
│       └── SuccessMessage.tsx               # Confirmación
│
└── utils/
    └── validation.utils.ts                  # Validar templates
```

---

## 🔗 CARPETAS COMPARTIDAS POR TODOS

### **Services (API)**
```
src/services/
├── api/
│   ├── client.ts              # Configuración Axios (usado por TODOS)
│   ├── endpoints.ts           # URLs de endpoints (usado por TODOS)
│   └── interceptors.ts        # Auth token, manejo errores (usado por TODOS)
│
├── storage/
│   └── localStorage.ts        # Guardar token (usado por Auth)
│
└── export/
    ├── csvExport.ts           # Exportar a CSV (usado por Angelo, Oscar, David)
    └── pdfExport.ts           # Exportar a PDF (opcional)
```

### **Store (Estado Global)**
```
src/store/
├── slices/
│   ├── authSlice.ts           # Estado auth (usado por TODOS)
│   ├── usersSlice.ts          # Estado users (Angelo)
│   ├── incidentsSlice.ts      # Estado incidents (David)
│   └── settingsSlice.ts       # Estado settings (Ronny, Josselyn)
│
├── middleware/
│   └── apiMiddleware.ts       # Middleware para API (usado por TODOS)
│
└── store.ts                   # Store principal (usado por TODOS)
```

### **App (Navegación y Layout)**
```
src/app/
├── navigation/
│   ├── routes/
│   │   └── routes.tsx         # Definición de rutas (usado por TODOS)
│   └── Sidebar.tsx            # Sidebar de navegación (usado por TODOS)
│
├── providers/
│   ├── AuthProvider.tsx       # Proveedor de autenticación (usado por TODOS)
│   └── ThemeProvider.tsx      # Proveedor de tema (usado por TODOS)
│
└── config/
    └── app.config.ts          # Configuración global (usado por TODOS)
```


## 📊 ESTRUCTURA DEL PROYECTO

openblind-admin/
├── src/
│ ├── app/
│ │ ├── navigation/
│ │ │ └── routes/
│ │ ├── providers/
│ │ └── config/
│ │
│ ├── features/
│ │ ├── auth/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── dashboard/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── users/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── places/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── emergency-contacts/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── navigation/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── incidents/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ ├── support/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │
│ │ └── settings/
│ │ ├── screens/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types/
│ │
│ ├── shared/
│ │ ├── components/
│ │ │ ├── layout/
│ │ │ ├── buttons/
│ │ │ ├── inputs/
│ │ │ ├── tables/
│ │ │ ├── cards/
│ │ │ ├── modals/
│ │ │ ├── feedback/
│ │ │ ├── charts/
│ │ │ └── badges/
│ │ │
│ │ ├── hooks/
│ │ ├── utils/
│ │ ├── constants/
│ │ ├── types/
│ │ └── styles/
│ │
│ ├── services/
│ │ ├── api/
│ │ ├── storage/
│ │ └── export/
│ │
│ └── store/
│ ├── slices/
│ └── middleware/
│
├── public/
│ └── assets/
│ ├── images/
│ ├── icons/
│ └── fonts/
│
└── **tests**/
├── unit/
└── integration/

# 1. Crear proyecto

npm create vite@latest openblind-admin -- --template react-ts
cd openblind-admin

# 2. CORE (routing, HTTP, estado)

npm install react-router-dom axios zustand

# 3. FORMULARIOS y VALIDACIÓN

npm install react-hook-form zod @hookform/resolvers

# 4. TABLAS (para listar usuarios, incidencias, tickets, etc.)

npm install @tanstack/react-table

# 5. GRÁFICOS (para el Dashboard)

npm install recharts

# 6. ICONOS y UTILIDADES

npm install lucide-react date-fns clsx
npm install exceljs

# 7. UI FRAMEWORK (elige UNO)

# Opción A: Tailwind (RECOMENDADO - más control)

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Opción B: Material-UI (componentes listos)

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Opción C: Ant Design (especializado en admin)

npm install antd

# 8. NOTIFICACIONES (para feedback de acciones CRUD)

npm install sonner

# 9. AUTENTICACIÓN

npm install jwt-decode
npm install @types/jwt-decode -D

# 10. EXPORTAR DATOS (Excel/CSV para reportes)

npm install xlsx papaparse
npm install @types/papaparse -D

# 11. MAPAS (para visualizar lugares, zonas e incidencias)

npm install leaflet react-leaflet
npm install @types/leaflet -D
