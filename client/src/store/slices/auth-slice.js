// Function that defines the initial state and actions for authentication
export const createAuthSlice = (set) => ({
    // userInfo state holds information about the logged-in user; initially undefined
    userInfo: undefined,

    // setUserInfo action allows updating the userInfo state
    setUserInfo: (userInfo) => set({ userInfo }),
});
