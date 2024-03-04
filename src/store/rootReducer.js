import { combineReducers } from "redux";
import taskReducer from "../slices/taskSlice";

const rootReducer = combineReducers({
  tasks: taskReducer,
  // other reducers if you have more slices
});

export default rootReducer;
