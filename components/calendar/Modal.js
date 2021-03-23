import { useState, useEffect, useContext } from "react";
import moment from "moment";
import styles from "../../styles/Modal.module.scss";
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
import "../../node_modules/react-datetime-picker/dist/DateTimePicker.css";
import "../../node_modules/react-calendar/dist/Calendar.css";
import "../../node_modules/react-clock/dist/Clock.css";

export default function CalendarModal(props) {
  const {
    closeModal,
    saveEvent,
    editEvent,
    deleteEvent,
    itemId,
    setTitle,
    title,
    summary,
    setSummary,
    boja,
    setBoja,
    setStartDate,
    startDate,
    setEndDate,
    endDate,
    textRepeateType,
    setRepeateType,
    setTextRepeateType,
    modalType,
    setModalType,
  } = props;

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div onClick={() => closeModal()}>Zatvori</div>
          <div>Događaj</div>
          {modalType == "create" ? (
            <div onClick={() => saveEvent()}>Snimi</div>
          ) : (
            <div onClick={() => editEvent(itemId)}>Uredi</div>
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
          <div className={styles.modalColors}>
            <div className={styles.colorLabel}>
              <label>Boja</label>
              <div
                style={{ width: 20, height: 20, backgroundColor: boja }}
              ></div>
            </div>
            <div className={styles.modalColor}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#e6add8",
                }}
                onClick={() => setBoja("#e6add8")}
              ></div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#ade6d8",
                }}
                onClick={() => setBoja("#ade6d8")}
              ></div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#d8ade6",
                }}
                onClick={() => setBoja("#d8ade6")}
              ></div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#e6bcad",
                }}
                onClick={() => setBoja("#e6bcad")}
              ></div>
            </div>
          </div>
          <div className={styles.modalPicker}>
            <label>Početak</label>
            <div className={styles.pickerDate}>
              <DateTimePicker onChange={setStartDate} value={startDate} />
            </div>
          </div>
          <div className={styles.modalPicker}>
            <label>Kraj</label>
            <div className={styles.pickerDate}>
              <DateTimePicker onChange={setEndDate} value={endDate} />
            </div>
          </div>
          <div className={styles.modalRepeate}>
            <div className={styles.repeateLabel}>
              <label>Ponavljanje</label>
              <div>{textRepeateType}</div>
            </div>
            <div className={styles.repeateOption}>
              <div
                onClick={() => {
                  setRepeateType("NONE");
                  setTextRepeateType("Ne ponavljati");
                }}
              >
                Ne ponavljati
              </div>
              <div
                onClick={() => {
                  setRepeateType("DAILY");
                  setTextRepeateType("Dnevno");
                }}
              >
                Dnevno
              </div>
              <div
                onClick={() => {
                  setRepeateType("WEEKLY");
                  setTextRepeateType("Sedmično");
                }}
              >
                Sedmično
              </div>
              <div
                onClick={() => {
                  setRepeateType("MONTHLY");
                  setTextRepeateType("Mjesečno");
                }}
              >
                Mjesečno
              </div>
              <div
                onClick={() => {
                  setRepeateType("YEARLY");
                  setTextRepeateType("Godišnje");
                }}
              >
                Godišnje
              </div>
            </div>
          </div>
        </div>
        {modalType == "edit" && (
          <div className={styles.modalFooter} onClick={() => deleteEvent(itemId)}>
            Izbriši događaj
          </div>
        )}
      </div>
    </div>
  );
}
