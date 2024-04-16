
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type LoadingProp = 'idle' | 'loading'
type ErrorProp = string
type Comment = {
    id: number,
    text: string,
}

interface CommentsI {
    loading: LoadingProp,
    error: ErrorProp,
    comments: Comment[]
}

const initialState: CommentsI = {
    loading: 'idle',
    error: '',
    comments: []
   
}

export const getComments = createAsyncThunk(
    '@comments/get-all-comments',

    async () => {

        const comments = await fetch(`http://o-complex.com:1337/reviews`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
        const CommentsList = await comments.json()

        if (CommentsList.length === 0) {
            return {
                notification: 'Ошибка загрузки комментариев'
            }
        }

        if (CommentsList !== undefined) {
            return CommentsList
        }
        else {
            throw new Error(`Неверный запрос! Ошибка сервера`)
        }
    }
)

const CommentsSlice = createSlice({
    name: '@comments',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.loading = 'loading'
                state.error = ''
                state.comments = []
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.comments = action.payload
                state.loading = 'idle'
                state.error = action.payload.notification ? action.payload.notification : ''
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = 'idle'
                if (action.error.message) {
                    state.comments = []
                    state.error = action.error.message ? action.error.message : '« Сервис временно недоступен! »'
                }
            })
    }
})

export const CommentsReducer = CommentsSlice.reducer
export const {  } = CommentsSlice.actions