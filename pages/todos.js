import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import TodoList from "../components/todos/todoList";
import fire from "../config/fire-config";
import useSWR from "swr";
import TodoModal from "../components/todos/Modal";
import { StoreContext } from "../context/StoreContext";
import NotificationContext from '../context/NotificationContext';
import moment from "moment";

export default function Todos() {
  const { modal, opModal, clModal } = useContext(StoreContext);
  const notificationCtx = useContext(NotificationContext);
  const [catTitle, setCatitle] = useState("home");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState("home");
  const [itemId, setItemId] = useState(0);
  const [todos, setTodos] = useState([]);
  const [loadTodos, setLoadTodos] = useState(false);
  const [todosLenght, setTodosLenhgt] = useState(0);
  const [name, setName] = useState();
  const [modalType, setModalType] = useState("create");

  const { data, error } = useSWR("/api/hello");

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
    setLoadTodos(false);
    setCatitle(item);
    fetchTodos(item);
  }

  const fetchTodos = async (item) => {
    let user = await fire.auth().currentUser;
    let db = await fire.firestore();
    const lists = [];
    db.collection("todos")
      .doc(user.uid)
      .collection("todorows")
      .where("category", "==", item)
      .get()
      .then((querySnapshot) => {
        console.log("Total todos: ", querySnapshot.size);
        setTodosLenhgt(querySnapshot.size);
        querySnapshot.forEach((doc) => {
          console.log("Total todos: ", doc.data());
          const {
            title,
            summary,
            endDate,
            isCompleted,
            priority,
            order,
            category,
          } = doc.data();
          let end = endDate.toDate().toString();
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
        setTodos(lists);
        setLoadTodos(true);
      });
  };

  const saveTodo = async () => {
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
      setTodos((oldEvent) => [...oldEvent, eventObj]);
    }
    if (title != "") {
      return db
        .collection("todos")
        .doc(user.uid)
        .collection("todorows")
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

  const deleteTodo = async (id) => {
    notificationCtx.showNotification({
      title: 'Brisanje',
      message: 'Zadatak se briše...',
      status: 'pending',
    });
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    db.collection("todos")
      .doc(user.uid)
      .collection("todorows")
      .doc(id)
      .delete()
      .then(() => {
        closeModal();
        const newData = [...todos];
        const prevIndex = todos.findIndex((item) => item.id === id);
        newData.splice(prevIndex, 1);
        setTodos(newData);
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

  const editTodo = async (id) => {
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
    db.collection("todos")
      .doc(user.uid)
      .collection("todorows")
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
          const newItems = todos.filter((it) => it.id != id);
          setTodos(() => [...newItems, eventObj]);
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
    if (data) {
      console.log(data);
      setName(data.name);
    }
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      fetchTodos("home");
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
        {loadTodos ? (
          <TodoList
            handleEdit={handleEdit}
            title={catTitle}
            todos={todos}
            todosLenght={todosLenght}
          />
        ) : null}
        {modal ? (
          <TodoModal
            category={category}
            setCategory={setCategory}
            startDate={startDate}
            setStartDate={setStartDate}
            closeModal={closeModal}
            setTitle={setTitle}
            title={title}
            summary={summary}
            setSummary={setSummary}
            itemId={itemId}
            modalType={modalType}
            setModalType={setModalType}
            saveTodo={saveTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ) : null}
      </main>
    </div>
  );
}
