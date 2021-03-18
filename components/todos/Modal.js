import { useState, useEffect, useContext } from "react";
import styles from "../../styles/Home.module.scss";
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
import "../../node_modules/react-datetime-picker/dist/DateTimePicker.css";
import "../../node_modules/react-calendar/dist/Calendar.css";
import "../../node_modules/react-clock/dist/Clock.css";

export default function TodoModal(props) {
  const {
    closeModal,
    modalType,
    setTitle,
    title,
    summary,
    setSummary,
    setStartDate,
    startDate,
    category,
    setCategory,
    setNotification,
    saveTodo,
    deleteTodo,
    editTodo,
    itemId
  } = props;

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div onClick={() => closeModal()}>Zatvori</div>
          <div>Zadatak</div>
          {modalType == "create" ? (
            <div onClick={() => saveTodo()}>Snimi</div>
          ) : (
            <div onClick={() => editTodo(itemId)}>Uredi</div>
          )}
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalInput}>
            <label>Naziv</label>
            <input
              type="text"
              placeholder="Upiši naziv događaja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.modalInput}>
            <label>Opis</label>
            <input
              type="text"
              placeholder="Upiši opis događaja"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className={styles.modalPicker}>
            <label>Početak</label>
            <div className={styles.pickerDate}>
              <DateTimePicker onChange={setStartDate} value={startDate} />
            </div>
          </div>
          <div className={styles.categoryWrapper}>
              <div>Izaberi kategoriju</div>
            <div className={styles.categoryItems}>
              <div
                className={`${styles.categoryItem} ${
                  category == "home" ? styles.catActive : ""
                }`}
                onClick={() => setCategory("home")}
              >
                <span>Kućna lista</span>
              </div>
              <div
                className={`${styles.categoryItem} ${
                  category == "shoping" ? styles.catActive : ""
                }`}
                onClick={() => setCategory("shoping")}
              >
                <span>Šoping lista</span>
              </div>
              <div
                className={`${styles.categoryItem} ${
                  category == "job" ? styles.catActive : ""
                }`}
                onClick={() => setCategory("job")}
              >
                <span>Posao lista</span>
              </div>
              <div
                className={`${styles.categoryItem} ${
                  category == "hobby" ? styles.catActive : ""
                }`}
                onClick={() => setCategory("hobby")}
              >
                <span>Hobi lista</span>
              </div>
              <div
                className={`${styles.categoryItem} ${
                  category == "other" ? styles.catActive : ""
                }`}
                onClick={() => setCategory("other")}
              >
                <span>Ostalo</span>
              </div>
            </div>
          </div>
        </div>
        {modalType == "edit" && (
          <div
            className={styles.modalFooter}
            onClick={() => deleteTodo(itemId)}
          >
            Izbriši zadatak
          </div>
        )}
      </div>
    </div>
  );
}
