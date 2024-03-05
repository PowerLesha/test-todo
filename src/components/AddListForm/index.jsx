import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Col, ListGroup, Row, Container } from "react-bootstrap";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

import {
  addTaskList,
  addTaskToList,
  removeTask,
  removeTaskList,
  toggleTaskStatus,
} from "../../slices/taskSlice";

const AddListForm = () => {
  const [listTitle, setNewListTitle] = useState("");
  const [newTaskTitles, setNewTaskTitles] = useState({});
  const [filters, setFilters] = useState({});
  const [taskCountText, setTaskCountText] = useState({});
  const [emptyInputSubmitted, setEmptyInputSubmitted] = useState(false);
  const [emptySecondInputSubmitted, setEmptySecondInputSubmitted] = useState(
    {}
  );
  const dispatch = useDispatch();
  const taskLists = useSelector((state) => state.tasks.taskLists);

  useEffect(() => {
    const getTaskCountText = (tasks, filter) => {
      const count = filteredTasks(tasks, filter).length;

      return (() => {
        if (filter !== "all" && count > 1) {
          return `You have ${count} ${filter} tasks`;
        } else if (filter !== "all" && count === 1) {
          return `You have ${count} ${filter} task`;
        } else if (filter && count === 0) {
          return "You don't have any tasks";
        } else if (filter === "all" && count > 1) {
          return `You have ${count} tasks`;
        } else {
          return `You have ${count} task`;
        }
      })();
    };

    const updatedTaskCountText = {};
    taskLists.forEach((taskList) => {
      updatedTaskCountText[taskList.id] = getTaskCountText(
        taskList.tasks,
        filters[taskList.id] || "all"
      );
    });
    setTaskCountText(updatedTaskCountText);
  }, [taskLists, filters]);

  const handleSubmitList = (e) => {
    e.preventDefault();
    if (listTitle.trim() !== "") {
      dispatch(addTaskList(listTitle));
      setNewListTitle("");
      setEmptyInputSubmitted(false);
    } else {
      setEmptyInputSubmitted(true);
    }
  };

  const handleSubmitTask = (e, listId) => {
    e.preventDefault();
    const taskTitle = newTaskTitles[listId] || "";
    if (taskTitle.trim() !== "") {
      dispatch(
        addTaskToList({ listId, task: { title: taskTitle, isDone: false } })
      );
      setNewTaskTitles({ ...newTaskTitles, [listId]: "" });
      setEmptySecondInputSubmitted({
        ...emptySecondInputSubmitted,
        [listId]: false,
      });
    } else {
      setEmptySecondInputSubmitted({
        ...emptySecondInputSubmitted,
        [listId]: true,
      }); // Set state to true if empty input is submitted
    }
  };

  const handleTaskTitleChange = (e, listId) => {
    const { value } = e.target;
    setNewTaskTitles({ ...newTaskTitles, [listId]: value });
  };

  const handleFilterChange = (listId, filter) => {
    setFilters({ ...filters, [listId]: filter });
  };

  const filteredTasks = (tasks, filter) => {
    if (filter === "completed") {
      return tasks.filter((task) => task.isDone);
    } else if (filter === "current") {
      return tasks.filter((task) => !task.isDone);
    } else {
      return tasks;
    }
  };
  const handleRemoveTask = (listId, taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(removeTask({ listId, taskId }));
    }
  };

  const handleRemoveTaskList = (listId) => {
    if (window.confirm("Are you sure you want to delete this task list?")) {
      dispatch(removeTaskList({ listId }));
    }
  };

  return (
    <Container>
      <Col>
        <Form onSubmit={handleSubmitList} className="main-form">
          <Col>
            <Form.Control
              className="main-form-control"
              type="text"
              placeholder="Enter new list title"
              value={listTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              style={{
                borderColor:
                  emptyInputSubmitted && !listTitle.trim() ? "red" : "",
              }}
            />
            {emptyInputSubmitted && !listTitle.trim() && (
              <p style={{ color: "red" }}>List title cannot be empty</p>
            )}
          </Col>
          <Col>
            <Button type="submit">Add Task List</Button>
          </Col>
        </Form>
      </Col>
      <Row className="lists-container">
        {taskLists.map((taskList) => (
          <Col
            key={taskList.id}
            className="lists"
            style={{
              border: "1px solid black",
              padding: "10px",
              paddingRight: "30px",
              marginBottom: "10px",
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)", // Increased shadow
            }}
          >
            <div className="list-form">
              <div className="header-list">
                <h3>{taskList.title}</h3>
                <span
                  title="delete list?"
                  className="delete-icon"
                  onClick={() => handleRemoveTaskList(taskList.id)}
                >
                  <FaTrashAlt />
                </span>
              </div>
              <Form onSubmit={(e) => handleSubmitTask(e, taskList.id)}>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter new task title"
                    value={newTaskTitles[taskList.id] || ""}
                    onChange={(e) => handleTaskTitleChange(e, taskList.id)}
                    style={{
                      borderColor:
                        emptySecondInputSubmitted[taskList.id] &&
                        !newTaskTitles[taskList.id]?.trim()
                          ? "red"
                          : "",
                    }}
                  />
                  {emptySecondInputSubmitted[taskList.id] &&
                    (!newTaskTitles[taskList.id]?.trim() ||
                      newTaskTitles[taskList.id]?.trim() === "") && ( // Show message if empty input is submitted for task
                      <p style={{ color: "red" }}>Task title cannot be empty</p>
                    )}
                </Col>
                <Col>
                  <Button type="submit">Add Task</Button>
                </Col>
              </Form>
            </div>

            <div className="tasks">
              <ListGroup>
                {filteredTasks(
                  taskList.tasks,
                  filters[taskList.id] || "all"
                ).map((task) => (
                  <ListGroup.Item key={task.id}>
                    <Form.Check
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() =>
                        dispatch(
                          toggleTaskStatus({
                            listId: taskList.id,
                            taskId: task.id,
                          })
                        )
                      }
                      label={
                        <span
                          onClick={() =>
                            dispatch(
                              toggleTaskStatus({
                                listId: taskList.id,
                                taskId: task.id,
                              })
                            )
                          }
                          style={{
                            textDecoration: task.isDone
                              ? "line-through"
                              : "none",
                            cursor: "pointer",
                            position: "absolute",
                            marginTop: "6px",
                          }}
                        >
                          {task.title}
                          <span
                            className="delete-task-icon"
                            onClick={() =>
                              handleRemoveTask(taskList.id, task.id)
                            }
                          >
                            <FaTimes />
                          </span>
                        </span>
                      }
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div
                className="task-count"
                style={{
                  borderBottom: "1px solid black",
                  borderTop: "1px solid black",
                  width: "113.5%",
                  marginLeft: "-11px",
                }}
              >
                {taskCountText[taskList.id]}
              </div>
            </div>
            <div className="list-buttons">
              <Button onClick={() => handleFilterChange(taskList.id, "all")}>
                All
              </Button>
              <Button
                onClick={() => handleFilterChange(taskList.id, "completed")}
              >
                Completed
              </Button>
              <Button
                onClick={() => handleFilterChange(taskList.id, "current")}
              >
                Current
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AddListForm;
