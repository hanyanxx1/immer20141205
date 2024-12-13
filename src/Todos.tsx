import React from "react";
import { useImmerState } from "./immer";

let id = 1;

const Todos = () => {
  const [todos, setTodos] = useImmerState({
    list: [],
  });
  const addTodo = () =>
    setTodos((draft) => {
      draft.list.push(id++);
    });
  return (
    <>
      <button onClick={addTodo}>增加</button>
      <ul>
        {todos.list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
};

export default Todos;
