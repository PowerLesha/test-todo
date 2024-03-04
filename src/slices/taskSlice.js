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
    addTaskList(state, action) {
      state.tasks.push({ title: action.payload, tasks: [] }); // Add a new task list with an empty array of tasks
    },
    // add other reducers for updating task status, filtering, etc.
  },
});

export const { addTask, addTaskList } = taskSlice.actions;

export default taskSlice.reducer;
