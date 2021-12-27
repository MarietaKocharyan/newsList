import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './news';

export const store = configureStore({
	reducer: {
		news: newsReducer
	}
})