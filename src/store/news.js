import { useMemo } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useAppSelector } from './hooks';


const url = 'https://newsapi.org/v2/';
const token = '3c8aa5408fd7454182de94e528c715ad';

export const getNews = async(fetchParams) => {
	const { pageSize, pageNumber} = fetchParams;

	const response = await fetch(`${url}everything?q=apple&pageSize=${pageSize}&page=${pageNumber}&apiKey=${token}`).then(data => {
		return data.json()
	})
	return response
} 	

/**
 * News initial state
 */
const initialState = {
    data: {},
    status: 'idle',
    totalResults: 0,
};

/**
 * News Async thunk
 */
const readNews = createAsyncThunk(
    'news/read',
    async (filterParams) => {
        const response = await getNews(filterParams);
        return response;
    }
);

/**
 * News slice
 */
export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                readNews.pending,
                (state) => {
                    state.status = 'loading';
                }
            )
            .addCase(
                readNews.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.status = 'success';
                    state.data = action.payload.articles;
                    state.totalResults = action.payload.totalResults
                }
            )
            .addCase(
                readNews.rejected,
                (state) => {
                    state.status = 'failed';
                    state.data = initialState.data;
                }
            );
    },
});

/**
 * News hooks
 */
export const useNews = () => {
    const dispatch = useAppDispatch();
    const reducerState = useAppSelector(
        (state) => state.news
    );

    const reducerActions = useMemo(
        () => ({
            read: (filterParams) =>
                dispatch(readNews(filterParams)),
        }),
        [dispatch]
    );

    return [reducerState, reducerActions];
};

export default newsSlice.reducer;
