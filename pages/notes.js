import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import NoteList from "../components/notes/noteList";
import fire from "../config/fire-config";
import useSWR from "swr";
import NoteModal from "../components/notes/Modal";
import { StoreContext } from "../context/StoreContext";
import NotificationContext from '../context/NotificationContext';
import moment from "moment";
import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("../components/notes/MyEditor"), {
	ssr: false,
});

export default function Notes() {
  const { modal, opModal, clModal } = useContext(StoreContext);
  const notificationCtx = useContext(NotificationContext);
  const [catTitle, setCatitle] = useState("home");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState("home");
  const [itemId, setItemId] = useState(0);
  const [notes, setNotes] = useState([]);
  const [loadNotes, setLoadNotes] = useState(false);
  const [notesLenght, setNotesLenght] = useState(0);
  const [name, setName] = useState();
  const [modalType, setModalType] = useState("create");


  const closeModal = () => {
    setModalType("create");
    setTitle("");
    setSummary("");
    clModal();
  };

  const handleEdit = (itemEvent) => {
    setItemId(itemEvent.id);
    setTitle(itemEvent.title);
    setSummary(itemEvent.summary);
    setModalType("edit");
    opModal();
  };

  function fetchCategory(item) {
    setLoadNotes(false);
    setCatitle(item);
    fetchNotes(item);
  }

  const fetchNotes = async (item) => {
    let user = await fire.auth().currentUser;
    let db = await fire.firestore();
    const lists = [];
    db.collection("notes")
      .doc(user.uid)
      .collection("noterows")
      .where("category", "==", item)
      .get()
      .then((querySnapshot) => {
        console.log("Total notes: ", querySnapshot.size);
        setNotesLenght(querySnapshot.size);
        querySnapshot.forEach((doc) => {
          console.log("Total notes: ", doc.data());
          const {
            title,
            summary,
            endDate,
            isCompleted,
            priority,
            order,
            category,
          } = doc.data();
          let end = "";
          if(endDate) {
             end = endDate.toDate().toString();
          }
          lists.push({
            id: doc.id,
            endDate: end,
            title,
            summary,
            isCompleted,
            priority,
            order,
            category,
          });
        });
        setNotes(lists);
        setLoadNotes(true);
      });
  };

  const saveNote = async () => {
    notificationCtx.showNotification({
      title: 'Snimanje',
      message: 'Zadatak se snima...',
      status: 'pending',
    });
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    let endDate = moment(startDate).toDate();
    let eventObj = {
      title: title,
      summary: summary,
      endDate: endDate,
      category: category,
    };
    if (category == catTitle) {
      setNotes((oldEvent) => [...oldEvent, eventObj]);
    }
    if (title != "") {
      return db
        .collection("notes")
        .doc(user.uid)
        .collection("noterows")
        .doc()
        .set({
          title: title,
          summary: summary,
          endDate: endDate,
          isCompleted: false,
          priority: 1,
          order: 1,
          category: category,
        })
        .then(() => {
          closeModal();
          notificationCtx.showNotification({
            title: 'Uspješno!',
            message: 'Zadatak je uspješno snimljen!',
            status: 'success',
          });
        })
        .catch((error) => {
          notificationCtx.showNotification({
            title: 'Greška!',
            message: error.message || 'Došlo je do greške! Pokušajte ponovo!',
            status: 'error',
          });
        });
    }
  };

  const deleteNote = async (id) => {
    notificationCtx.showNotification({
      title: 'Brisanje',
      message: 'Zadatak se briše...',
      status: 'pending',
    });
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    db.collection("notes")
      .doc(user.uid)
      .collection("noterows")
      .doc(id)
      .delete()
      .then(() => {
        closeModal();
        const newData = [...notes];
        const prevIndex = notes.findIndex((item) => item.id === id);
        newData.splice(prevIndex, 1);
        setNotes(newData);
        notificationCtx.showNotification({
          title: 'Uspješno!',
          message: 'Zadatak je uspješno izbrisan!',
          status: 'success',
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: 'Greška!',
          message: error.message || 'Došlo je do greške! Pokušajte ponovo!',
          status: 'error',
        });
      });
  };

  const editNote = async (id) => {
    notificationCtx.showNotification({
      title: 'Uređivanje',
      message: 'Zadatak se uređuje...',
      status: 'pending',
    });
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    let endDate = moment(startDate).toDate();
    let eventObj = {
      title: title,
      summary: summary,
      endDate: endDate,
      category: category,
    };
    db.collection("notes")
      .doc(user.uid)
      .collection("noterows")
      .doc(id)
      .update({
        title: title,
        summary: summary,
        endDate: endDate,
        category: category,
      })
      .then(() => {
        closeModal();
        notificationCtx.showNotification({
          title: 'Uspješno!',
          message: 'Zadatak je uspješno uređen!',
          status: 'success',
        });
        if (category == catTitle) {
          const newItems = notes.filter((it) => it.id != id);
          setNotes(() => [...newItems, eventObj]);
        }
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: 'Greška!',
          message: error.message || 'Došlo je do greške! Pokušajte ponovo!',
          status: 'error',
        });
      });
  };

  useEffect(() => {
    setTimeout(() => {
      fetchNotes("home");
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Zadaci</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.todoMain}>
        <div className={styles.categoryItems}>
          <div
            className={`${styles.categoryItem} ${
              catTitle == "home" ? styles.catActive : ""
            }`}
            onClick={() => fetchCategory("home")}
          >
            <span>Kućna lista</span>
          </div>
          <div
            className={`${styles.categoryItem} ${
              catTitle == "shoping" ? styles.catActive : ""
            }`}
            onClick={() => fetchCategory("shoping")}
          >
            <span>Šoping lista</span>
          </div>
          <div
            className={`${styles.categoryItem} ${
              catTitle == "job" ? styles.catActive : ""
            }`}
            onClick={() => fetchCategory("job")}
          >
            <span>Posao lista</span>
          </div>
          <div
            className={`${styles.categoryItem} ${
              catTitle == "hobby" ? styles.catActive : ""
            }`}
            onClick={() => fetchCategory("hobby")}
          >
            <span>Hobi lista</span>
          </div>
          <div
            className={`${styles.categoryItem} ${
              catTitle == "other" ? styles.catActive : ""
            }`}
            onClick={() => fetchCategory("other")}
          >
            <span>Ostalo</span>
          </div>
        </div>
        {loadNotes ? (
          <NoteList
            handleEdit={handleEdit}
            title={catTitle}
            notes={notes}
            notesLenght={notesLenght}
          />
        ) : null}
        {modal ? (
          <NoteModal
            category={category}
            setCategory={setCategory}
            startDate={startDate}
            setStartDate={setStartDate}
            closeModal={closeModal}
            setTitle={setTitle}
            title={title}
            itemId={itemId}
            modalType={modalType}
            setModalType={setModalType}
            saveNote={saveNote}
            deleteNote={deleteNote}
            editNote={editNote}
            >
               <MyEditor
                 summary={summary}
                 setSummary={setSummary}
               />
          </NoteModal>
        ) : null}
      </main>
    </div>
  );
}
