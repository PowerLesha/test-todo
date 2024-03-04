// components/AddRecordForm.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTaskList } from "../../slices/taskSlice";

const AddListForm = () => {
  const [listTitle, setNewListTitle] = useState("");
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Accessing tasks from Redux store

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim() !== "") {
      dispatch(addTaskList(listTitle)); // Dispatching addTaskList action with the list title
      setNewListTitle(""); // Clear the input field after submission
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter new list title"
          value={listTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <button type="submit">Add Task List</button>
      </form>
      <div>
        <h2>Task Lists</h2>
        <ul>
          {tasks.map((taskList, index) => (
            <li key={index}>{taskList.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddListForm;
