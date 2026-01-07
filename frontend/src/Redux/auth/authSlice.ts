import { createSlice } from "@reduxjs/toolkit";

// Parse localStorage once
const authString = localStorage.getItem("urlServiceAuth");
const auth = authString ? JSON.parse(authString) : null;
// const authString = localStorage.getItem("auth") ?? null;
// const auth = authString ? JSON.parse(authString) : null;
const initialState = {
    accessToken: auth ? auth.accessToken : null,
    user: auth ? auth.user : undefined,
    error: null,
};

const authSlice = createSlice({
    name: "urlServiceAuth",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            //   console.log("action:", action.payload); //  accessToken

            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            localStorage.setItem(
                "urlServiceAuth",
                JSON.stringify({
                    accessToken: action.payload.accessToken,
                    user: action.payload.user,
                })
            );
        },
        userLoggedOut: (state) => {
            // Remove item from localStorage
            localStorage.removeItem("urlServiceAuth");
            // Reset state values
            state.accessToken = null;
            state.user = undefined;
        },
    },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;