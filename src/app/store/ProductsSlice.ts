
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type LoadingProp = 'idle' | 'loading'
type ErrorProp = string
export type ProductType = {
    id: number,
    image_url: string
    title: string,
    description: string,
    price: number,
    quantity: number,
}

interface ProductsI {
    loading: LoadingProp,
    error: ErrorProp,
    products: ProductType[]
    total: number,
    page: number,
}

const initialState: ProductsI = {
    loading: 'idle',
    error: '',
    products: [],
    total: 0,
    page: 1,

}

export type ActionProp = {
    page?: number,
    page_size?: number,
}

export const getProducts = createAsyncThunk(
    '@products/get-all-products',

    async ({ page = 1, page_size = 20 }: ActionProp) => {

        const prod = await fetch(`http://o-complex.com:1337/products?page=${page}&page_size=${page_size}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
        const productsList = await prod.json()

        if (productsList.products.length === 0) {
            return {
                notification: 'Нет подходящих продуктов'
            }
        }

        if (productsList !== undefined) {
            return productsList
        }
        else {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
    }
)

const ProductsSlice = createSlice({
    name: '@products',
    initialState,
    reducers: {
        changePage: (state, action: PayloadAction<ProductsI['page']>) => {
            state.page = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = 'loading'
                state.error = ''
                state.products = []
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                const formattedProducts = action.payload.products.map((item: ProductType) => {
                    return {
                        ...item,
                        quantity: 0,
                    }
                })
                
                state.products = formattedProducts
                state.loading = 'idle'
                state.error = action.payload.notification ? action.payload.notification : ''
                state.total = action.payload.total
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = 'idle'
                state.total = 0
                if (action.error.message) {
                    state.products = []
                    state.error = action.error.message ? action.error.message : '« Сервис временно недоступен! »'
                }
            })
    }
})

export const ProductsReducer = ProductsSlice.reducer
export const { changePage } = ProductsSlice.actions