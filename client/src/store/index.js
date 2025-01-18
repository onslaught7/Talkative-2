import { create } from 'zustand'
import { createAuthSlice } from './slices/auth-slice'

// Creating the Zustand store using the create function
// The spread operator (...a) is used to pass all arguments to the createAuthSlice function
// The store is then composed with the state and actions returned by createAuthSlice
export const useAppStore = create()((...a) => ({
    // similar to ...createAuthSlice(set, get, api)
    ...createAuthSlice(...a),
}));