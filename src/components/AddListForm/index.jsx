import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Col, ListGroup, Row, Container } from "react-bootstrap";
import {
  addTaskList,
  addTaskToList,
  toggleTaskStatus,
} from "../../slices/taskSlice";

const AddListForm = () => {
  const [listTitle, setNewListTitle] = useState("");
  const [newTaskTitles, setNewTaskTitles] = useState({});
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const taskLists = useSelector((state) => state.tasks.taskLists);

  const handleSubmitList = (e) => {
    e.preventDefault();
    if (listTitle.trim() !== "") {
      dispatch(addTaskList(listTitle));
      setNewListTitle("");
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
            />
          </Col>
          <Col>
            <Button type="submit">Add Task List</Button>
          </Col>
        </Form>
      </Col>
      <Row className="lists-container">
        {taskLists.map((taskList) => (
          <Col key={taskList.id} className="lists">
            <div className="list-form">
              <h3>{taskList.title}</h3>
              <Form onSubmit={(e) => handleSubmitTask(e, taskList.id)}>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter new task title"
                    value={newTaskTitles[taskList.id] || ""}
                    onChange={(e) => handleTaskTitleChange(e, taskList.id)}
                  />
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
                          }}
                        >
                          {task.title}
                        </span>
                      }
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
