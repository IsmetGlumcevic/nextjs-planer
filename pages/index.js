import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { StoreContext } from "../context/StoreContext";
import fire from "../config/fire-config";
import { RRule, RRuleSet, rrulestr } from "rrule";
import CalendarModal from "../components/calendar/Modal";

moment.locale("bs-BS");
const localizer = momentLocalizer(moment);

export default function Home() {
  const { items, setItems, modal, opModal, clModal } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [boja, setBoja] = useState("#dddddd");
  const [repeateType, setRepeateType] = useState("NONE");
  const [textRepeateType, setTextRepeateType] = useState("Ne ponavljati");
  const [notification, setNotification] = useState(null);
  // const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("create");

  const handleSelect = ({ start, end }) => {
    setStartDate(moment(start).toDate());
    setEndDate(moment(end).toDate());
    opModal();
  };

  const closeModal = () => {
    setModalType("create");
    setTitle("");
    setSummary("");
    setStartDate(new Date());
    setEndDate(new Date());
    setBoja("#dddddd");
    setRepeateType("NONE");
    setTextRepeateType("Ne ponavljati");
    clModal();
  };

  const saveEvent = async (event) => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    let starts = moment(startDate).toDate();
    let ends = moment(endDate).toDate();
    const isoDate = new Date(startDate);
    let eventObj = {
      start: starts,
      end: ends,
      title,
      allDay: false,
    };
    setItems((oldEvent) => [...oldEvent, eventObj]);
    if (title != "") {
      return db
        .collection("events")
        .doc(user.uid)
        .collection("eventrows")
        .doc()
        .set({
          title: title,
          summary: summary,
          date: isoDate.toISOString().split('T')[0],
          startDate: starts,
          endDate: ends,
          createdAt: new Date(),
          selected: true,
          marked: true,
          duration: "",
          color: boja,
          dotColor: "#fffff",
          textColor: "#33333",
          repeateType: repeateType,
          repeate: repeateType == "NONE" ? false : true,
        })
        .then(() => {
          setModal(false);
          setNotification("Uspješno ste snimili event!");
        });
    }
  };

  const handleEdit = (itemEvent) => {
    setItemId(itemEvent.id);
    setTitle(itemEvent.title);
    setSummary(itemEvent.summary);
    setStartDate(itemEvent.start);
    setEndDate(itemEvent.end);
    setBoja(itemEvent.color);
    setRepeateType(itemEvent.repeateType);
    if (itemEvent.repeateType == "DAILY") {
      setTextRepeateType("Dnevno");
    } else if (itemEvent.repeateType == "WEEKLY") {
      setTextRepeateType("Sedmično");
    } else if (itemEvent.repeateType == "MONTHLY") {
      setTextRepeateType("Mjesečno");
    } else if (itemEvent.repeateType == "YEARLY") {
      setTextRepeateType("Godišnje");
    }
    setModalType("edit");
    opModal();
  };

  const editEvent = async (id) => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    let starts = moment(startDate).toDate();
    let ends = moment(endDate).toDate();
    const isoDate = new Date(startDate);
    let eventObj = {
      start: starts,
      end: ends,
      title,
      allDay: false,
    };
    return db
      .collection('events')
      .doc(user.uid)
      .collection('eventrows')
      .doc(id)
      .update({
        title: title,
        summary: summary,
        startDate: starts,
        date: isoDate.toISOString().split('T')[0],
        endDate: ends,
        editedAt: new Date(),
        selected: true,
        marked: true,
        duration: '',
        color: boja,
        dotColor: '#fffff',
        textColor: '#33333',
        repeateType: repeateType,
        repeate: repeateType == 'NONE' ? false : true,
      })
      .then(() => {
        const newItems = items.filter(it => it.id != id)
        setItems(() => [...newItems, eventObj]);
        closeModal();
        setNotification('Uspješno ste uredili događaj!');
      });
  };

  const deleteEvent = async (id) => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    return db
      .collection('events')
      .doc(user.uid)
      .collection('eventrows')
      .doc(id)
      .delete()
      .then(() => {
        const newItems = items.filter(it => it.id != id)
        setItems(newItems);
        closeModal();
        setNotification('Uspješno ste izbisali događaj!');
      });
  };

  const fun = async () => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    if (user) {
      const lists = [];
      const data = await db
        .collection("events")
        .doc(user.uid)
        .collection("eventrows")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              title,
              summary,
              date,
              startDate,
              endDate,
              marked,
              selected,
              color,
              dotColor,
              repeateType,
              repeate,
            } = doc.data();
            let start = startDate.toDate().toString();
            let end = endDate.toDate().toString();
            let formatStart = moment(start).format("yy-MM-DD hh:mm:ss");
            let formatEnd = moment(end).format("yy-MM-DD hh:mm:ss");
            lists.push({
              id: doc.id,
              textColor: dotColor,
              start: start,
              end: end,
              startDate,
              endDate,
              title,
              summary,
              date,
              marked,
              selected,
              color,
              repeateType,
              repeate,
            });
          });
          const repeateList = lists.filter((list) => list.repeate == true);
          const repeatLists = [];
          const repeateListObj = repeateList.map((item) => {
            if (item.repeateType == "DAILY") {
              const rule = new RRule({
                freq: RRule.DAILY,
                dtstart: new Date(item.start),
                until: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 3)
                ),
              });
              let rullAll = rule.all();
              rullAll.map((rul) => {
                let isoDate = new Date(rul);
                let newStart = rul;
                let newDate = isoDate.toISOString().split("T")[0];
                repeatLists.push({
                  id: item.id,
                  textColor: item.dotColor,
                  start: newStart,
                  end: item.end,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  title: item.title,
                  summary: item.summary,
                  date: newDate,
                  marked: item.marked,
                  selected: "",
                  color: item.color,
                  repeateType: item.repeateType,
                  repeate: item.repeate,
                });
              });
            } else if (item.repeateType == "WEEKLY") {
              const rule = new RRule({
                freq: RRule.WEEKLY,
                dtstart: new Date(item.start),
                until: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 3)
                ),
              });
              let rullAll = rule.all();
              rullAll.map((rul) => {
                let isoDate = new Date(rul);
                let newStart = rul;
                let newDate = isoDate.toISOString().split("T")[0];
                repeatLists.push({
                  id: item.id,
                  textColor: item.dotColor,
                  start: newStart,
                  end: item.end,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  title: item.title,
                  summary: item.summary,
                  date: newDate,
                  marked: item.marked,
                  selected: "",
                  color: item.color,
                  repeateType: item.repeateType,
                  repeate: item.repeate,
                });
              });
            } else if (item.repeateType == "MONTHLY") {
              const rule = new RRule({
                freq: RRule.MONTHLY,
                dtstart: new Date(item.start),
                until: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 3)
                ),
              });
              let rullAll = rule.all();
              rullAll.map((rul) => {
                let isoDate = new Date(rul);
                let newStart = rul;
                let newDate = isoDate.toISOString().split("T")[0];
                repeatLists.push({
                  id: item.id,
                  textColor: item.dotColor,
                  start: newStart,
                  end: item.end,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  title: item.title,
                  summary: item.summary,
                  date: newDate,
                  marked: item.marked,
                  selected: item.selected,
                  color: item.color,
                  repeateType: item.repeateType,
                  repeate: item.repeate,
                });
              });
            } else if (item.repeateType == "YEARLY") {
              const rule = new RRule({
                freq: RRule.YEARLY,
                dtstart: new Date(item.start),
                until: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 3)
                ),
              });
              let rullAll = rule.all();
              rullAll.map((rul) => {
                let isoDate = new Date(rul);
                let newStart = rul;
                let newDate = isoDate.toISOString().split("T")[0];
                repeatLists.push({
                  id: item.id,
                  textColor: item.dotColor,
                  start: newStart,
                  end: item.end,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  title: item.title,
                  summary: item.summary,
                  date: newDate,
                  marked: item.marked,
                  selected: item.selected,
                  color: item.color,
                  repeateType: item.repeateType,
                  repeate: item.repeate,
                });
              });
            }
          });
          setEvents(lists);
          setLoader(false);
          setItems(lists);
        });
    } else {
      console.log("nema");
    }
  };

  const openModal = () => {
    opModal();
  };

  useEffect(() => {
    setTimeout(() => {
      fun();
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Kalendar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          {modal ? (
            <CalendarModal
              closeModal={closeModal}
              saveEvent={saveEvent}
              editEvent={editEvent}
              deleteEvent={deleteEvent}
              itemId={itemId}
              setTitle={setTitle}
              title={title}
              summary={summary}
              setSummary={setSummary}
              boja={boja}
              setBoja={setBoja}
              setStartDate={setStartDate}
              startDate={startDate}
              setEndDate={setEndDate}
              endDate={endDate}
              textRepeateType={textRepeateType}
              setRepeateType={setRepeateType}
              setTextRepeateType={setTextRepeateType}
              modalType={modalType}
              setModalType={setModalType}
            />
          ) : null}
          {notification}
          {loader ? (
            <h1>loading......</h1>
          ) : (
            <Calendar
              localizer={localizer}
              events={items}
              selectable
              onSelectEvent={(itemEvent) => handleEdit(itemEvent)}
              onSelectSlot={handleSelect}
              style={{ height: 500 }}
              culture="bs"
              messages={{
                date: "Datum",
                time: "Vrijeme",
                event: "Događaj",
                allDay: "All Day",
                week: "Semica",
                work_week: "Radna sedmica",
                day: "Dan",
                month: "Mjesec",
                previous: "Nazad",
                next: "Naprijed",
                yesterday: "Jučer",
                tomorrow: "Sutra",
                today: "Danas",
                agenda: "Agenda",
                noEventsInRange: "Nema događaja.",
                showMore: function (e) {
                  return "+" + e + " više";
                },
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
