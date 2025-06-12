"use client"

// Sistema de autenticación simulado para demostración
interface DemoUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

interface DemoSession {
  user: DemoUser
  access_token: string
  expires_at: number
}

const DEMO_USERS: Record<string, { password: string; user: DemoUser }> = {
  "admin@onvia.com": {
    password: "admin123",
    user: {
      id: "demo-admin-id",
      email: "admin@onvia.com",
      name: "Administrador Demo",
      role: "administrador",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  "user@onvia.com": {
    password: "user123",
    user: {
      id: "demo-user-id",
      email: "user@onvia.com",
      name: "Usuario Demo",
      role: "visitante",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  },
}

const DEMO_BUSES = [
  {
    id: 1,
    numero_interno: "001",
    marca: "Mercedes Benz",
    modelo: "OF-1721",
    patente: "AB123CD",
    estado: "activo",
    ultima_revision: "2024-01-15",
    created_at: "2024-01-01",
  },
  {
    id: 2,
    numero_interno: "002",
    marca: "Scania",
    modelo: "K380",
    patente: "XY456ZW",
    estado: "mantenimiento",
    ultima_revision: "2024-01-10",
    created_at: "2024-01-01",
  },
  {
    id: 3,
    numero_interno: "003",
    marca: "Volvo",
    modelo: "B12R",
    patente: "QR789ST",
    estado: "activo",
    ultima_revision: "2024-01-20",
    created_at: "2024-01-01",
  },
]

export class DemoAuth {
  private static SESSION_KEY = "demo-session"
  private static listeners: Array<(event: string, session: DemoSession | null) => void> = []

  static async signIn(email: string, password: string): Promise<{ data: any; error: any }> {
    console.log("🎭 Demo Auth: Intentando iniciar sesión con", email)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userRecord = DEMO_USERS[email]

    if (!userRecord || userRecord.password !== password) {
      return {
        data: { user: null, session: null },
        error: { message: "Credenciales inválidas" },
      }
    }

    const session: DemoSession = {
      user: userRecord.user,
      access_token: "demo-token-" + Date.now(),
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    }

    // Guardar sesión
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

    // Notificar a los listeners
    this.notifyListeners("SIGNED_IN", session)

    console.log("✅ Demo Auth: Inicio de sesión exitoso")

    return {
      data: {
        user: session.user,
        session: session,
      },
      error: null,
    }
  }

  static async signOut(): Promise<{ error: any }> {
    console.log("🎭 Demo Auth: Cerrando sesión")

    localStorage.removeItem(this.SESSION_KEY)
    this.notifyListeners("SIGNED_OUT", null)

    return { error: null }
  }

  static async getSession(): Promise<{ data: { session: DemoSession | null }; error: any }> {
    const sessionData = localStorage.getItem(this.SESSION_KEY)

    if (!sessionData) {
      return {
        data: { session: null },
        error: null,
      }
    }

    try {
      const session: DemoSession = JSON.parse(sessionData)

      // Verificar si la sesión ha expirado
      if (Date.now() > session.expires_at) {
        localStorage.removeItem(this.SESSION_KEY)
        return {
          data: { session: null },
          error: null,
        }
      }

      return {
        data: { session },
        error: null,
      }
    } catch (error) {
      localStorage.removeItem(this.SESSION_KEY)
      return {
        data: { session: null },
        error: null,
      }
    }
  }

  static onAuthStateChange(callback: (event: string, session: DemoSession | null) => void) {
    this.listeners.push(callback)

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback)
            if (index > -1) {
              this.listeners.splice(index, 1)
            }
          },
        },
      },
    }
  }

  private static notifyListeners(event: string, session: DemoSession | null) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, session)
      } catch (error) {
        console.error("Error en listener de auth:", error)
      }
    })
  }
}

export class DemoDatabase {
  static async getUserProfile(userId: string): Promise<{ data: DemoUser | null; error: any }> {
    console.log("🎭 Demo DB: Obteniendo perfil de usuario", userId)

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Buscar usuario por ID
    const user = Object.values(DEMO_USERS).find((u) => u.user.id === userId)

    if (!user) {
      return {
        data: null,
        error: { message: "Usuario no encontrado" },
      }
    }

    return {
      data: user.user,
      error: null,
    }
  }

  static async getBuses(): Promise<{ data: any[]; error: any }> {
    console.log("🎭 Demo DB: Obteniendo lista de buses")

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      data: DEMO_BUSES,
      error: null,
    }
  }

  static async createUserProfile(profileData: any): Promise<{ data: DemoUser; error: any }> {
    console.log("🎭 Demo DB: Creando perfil de usuario", profileData)

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const newUser: DemoUser = {
      id: profileData.id || "demo-new-user-" + Date.now(),
      email: profileData.email,
      name: profileData.name,
      role: profileData.role || "visitante",
      is_active: profileData.is_active !== false,
      created_at: new Date().toISOString(),
    }

    return {
      data: newUser,
      error: null,
    }
  }
}
