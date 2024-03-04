import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  // other initial state properties if needed
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    // add other reducers for updating task status, filtering, etc.
  },
});

export const { addTask } = taskSlice.actions;

export default taskSlice.reducer;
