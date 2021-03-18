import { useState, useEffect, useContext } from "react";
import styles from "../../styles/Home.module.scss";

export default function TodoList(props) {
   const {todos, todosLenght, handleEdit} = props;

    useEffect(() => {
    }, [])

  return (
    <div className={styles.todoList}>
         <ul className={styles.todoListItems}>
         {todosLenght > 0 ? todos.map(todo => {
            return (
                <li key={todo.id} onClick={() => handleEdit(todo)}>{todo.title}</li>
            )
         }) : <div>Nema zadataka za ovu kategoriju</div>}
         </ul>
    </div>
  );
}
