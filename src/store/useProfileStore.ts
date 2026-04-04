import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  activeProfile: string | null
  setProfile: (profile: string) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setProfile: (profile) => set({ activeProfile: profile }),
      clearProfile: () => set({ activeProfile: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
)
