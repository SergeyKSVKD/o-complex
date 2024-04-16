import { configureStore } from '@reduxjs/toolkit'
import { CommentsReducer } from './CommentsSlice'
import { ProductsReducer } from './ProductsSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: {
        commentsState: CommentsReducer,
        productsState: ProductsReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        trace: true,
        serializableCheck: false,
    })
})