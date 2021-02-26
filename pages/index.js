import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { StoreContext } from "../context/StoreContext";
import fire from "../config/fire-config";
import { RRule, RRuleSet, rrulestr } from "rrule";

moment.locale("bs-BS");
const localizer = momentLocalizer(moment);

export default function Home() {
  const { items, setItems } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [boja, setBoja] = useState('#dddddd');
  const [repeateType, setRepeateType] = useState('NONE');
  const [notification, setNotification] = useState(null);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("New Event name");
    let eventObj = {
      start,
      end,
      title,
      allDay: false,
    };
    if (title) {
      setEvents((oldEvent) => [...oldEvent, eventObj]);
      saveEvent(eventObj)
    }
  };

  const saveEvent = async (event) => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    return db
      .collection('events')
      .doc(user.uid)
      .collection('eventrows')
      .doc()
      .set({
        title: event.title,
        summary: 'summary',
        date: new Date(),
        startDate: event.start,
        endDate: event.end,
        createdAt: new Date(),
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
        setNotification('Uspješno ste snimili event!');
      });
  };

  const fun = async () => {
    let user = await fire.auth().currentUser;
    let db = fire.firestore();
    if (user) {
      const lists = [];
      const data = await db.collection("events")
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
          setItems(lists)
        });
    } else {
      console.log("nema");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fun();
    }, 2000);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Kalendar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          {notification}
          {loader ? (
            <h1>loading......</h1>
          ) : (
            <Calendar
              localizer={localizer}
              events={items}
              selectable
              onSelectEvent={(event) => alert(event.title)}
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
