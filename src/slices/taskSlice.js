import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  taskLists: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTaskList(state, action) {
      state.taskLists.push({ id: uuidv4(), title: action.payload, tasks: [] });
    },
    addTaskToList(state, action) {
      const { listId, task } = action.payload;
      const list = state.taskLists.find((list) => list.id === listId);
      if (list) {
        list.tasks.push({ ...task, id: uuidv4() });
      }
    },
    toggleTaskStatus(state, action) {
      const { listId, taskId } = action.payload;
      const taskList = state.taskLists.find((list) => list.id === listId);
      if (taskList) {
        const task = taskList.tasks.find((task) => task.id === taskId);
        if (task) {
          task.isDone = !task.isDone;
        }
      }
    },
    removeTask(state, action) {
      const { listId, taskId } = action.payload;
      const taskList = state.taskLists.find((list) => list.id === listId);
      if (taskList) {
        taskList.tasks = taskList.tasks.filter((task) => task.id !== taskId);
      }
    },
    removeTaskList(state, action) {
      const { listId } = action.payload;
      state.taskLists = state.taskLists.filter((list) => list.id !== listId);
    },
  },
});

export const {
  addTaskList,
  addTaskToList,
  toggleTaskStatus,
  removeTask,
  removeTaskList,
} = taskSlice.actions;

export default taskSlice.reducer;
