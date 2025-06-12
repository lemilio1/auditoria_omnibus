-- Crear o actualizar el perfil del super admin
INSERT INTO user_profiles (id, email, name, role, is_active, created_at)
VALUES (
  'super-admin-id',
  'emmileschneske@gmail.com',
  'Emil Schneske',
  'super_usuario',
  true,
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_usuario',
  is_active = true,
  name = 'Emil Schneske';

-- Crear permisos completos para el super admin
INSERT INTO user_permissions (user_id, permissions)
VALUES (
  'super-admin-id',
  '{
    "ver_buses": true,
    "editar_buses": true,
    "crear_buses": true,
    "eliminar_buses": true,
    "ver_novedades": true,
    "crear_novedades": true,
    "editar_novedades": true,
    "eliminar_novedades": true,
    "aprobar_novedades": true,
    "ver_usuarios": true,
    "crear_usuarios": true,
    "editar_usuarios": true,
    "eliminar_usuarios": true,
    "ver_logs": true,
    "configuracion_avanzada": true,
    "super_admin": true
  }'::jsonb
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  permissions = '{
    "ver_buses": true,
    "editar_buses": true,
    "crear_buses": true,
    "eliminar_buses": true,
    "ver_novedades": true,
    "crear_novedades": true,
    "editar_novedades": true,
    "eliminar_novedades": true,
    "aprobar_novedades": true,
    "ver_usuarios": true,
    "crear_usuarios": true,
    "editar_usuarios": true,
    "eliminar_usuarios": true,
    "ver_logs": true,
    "configuracion_avanzada": true,
    "super_admin": true
  }'::jsonb;

-- Verificar que las tablas necesarias existen
CREATE TABLE IF NOT EXISTS buses (
  id SERIAL PRIMARY KEY,
  numero_interno VARCHAR(50) UNIQUE,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  patente VARCHAR(20) UNIQUE,
  año INTEGER,
  capacidad INTEGER,
  estado VARCHAR(50) DEFAULT 'activo',
  observaciones TEXT,
  fecha_ingreso DATE,
  proxima_revision DATE,
  ultima_revision DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS novedades (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  prioridad VARCHAR(50) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  bus_numero VARCHAR(50),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_vencimiento TIMESTAMP WITH TIME ZONE,
  creado_por VARCHAR(255),
  asignado_a VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_buses_numero_interno ON buses(numero_interno);
CREATE INDEX IF NOT EXISTS idx_buses_patente ON buses(patente);
CREATE INDEX IF NOT EXISTS idx_buses_estado ON buses(estado);
CREATE INDEX IF NOT EXISTS idx_novedades_estado ON novedades(estado);
CREATE INDEX IF NOT EXISTS idx_novedades_user_id ON novedades(user_id);
CREATE INDEX IF NOT EXISTS idx_novedades_bus_numero ON novedades(bus_numero);
