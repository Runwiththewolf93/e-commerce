import { createSlice } from "@reduxjs/toolkit";

const initialState = [{ id: 1, title: "Post 1", description: "Description 1" }];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.push(...action.payload);
    },
    updatePost: (state, action) => {
      const { id, title, description } = action.payload;
      const postIndex = state.findIndex(post => post.id === id);
      if (postIndex !== -1) {
        state[postIndex].title = title;
        state[postIndex].description = description;
      }
    },
    addPost: (state, action) => {
      const { id, title, description } = action.payload;
      state.push({ id, title, description });
    },
    deletePost: (state, action) => {
      const { id } = action.payload;
      return state.filter(post => post.id !== id);
    },
  },
});

export const { addPost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;
