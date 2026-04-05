import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  activeProfile: string | null
  isImpersonating: boolean
  impersonatedRole: string | null
  setProfile: (profile: string) => void
  setImpersonation: (role: string | null) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      isImpersonating: false,
      impersonatedRole: null,
      setProfile: (profile) => set({ activeProfile: profile }),
      setImpersonation: (role) => set({ 
        isImpersonating: role !== null, 
        impersonatedRole: role,
        activeProfile: role // Al simular, tratamos este perfil como activo para el router
      }),
      clearProfile: () => set({ activeProfile: null, isImpersonating: false, impersonatedRole: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
)
