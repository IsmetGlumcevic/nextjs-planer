import { useState, useEffect, useContext } from "react";
import styles from "../../styles/Home.module.scss";

export default function NoteList(props) {
   const {notes, notesLenght, handleEdit} = props;

    useEffect(() => {
    }, [])

  return (
    <div className={styles.todoList}>
         <ul className={styles.todoListItems}>
         {notesLenght > 0 ? notes.map(note => {
            return (
                <li key={note.id} onClick={() => handleEdit(note)}>{note.title}</li>
            )
         }) : <div>Nema bilješki za ovu kategoriju</div>}
         </ul>
    </div>
  );
}
