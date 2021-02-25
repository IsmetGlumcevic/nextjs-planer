import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import fire from "../config/fire-config";

moment.locale("bs-BS");
const localizer = momentLocalizer(moment);

export default function Home() {
  const { loggedIn, userInfo } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("New Event name");
    let eventObj = {
      start,
      end,
      title,
      allDay: false,
    };
    if (title) {
      setEvent((oldEvent) => [...oldEvent, eventObj]);
    }
  };

  useEffect(() => {}, []);

  const fetchingEvents = async () => {
    console.log('tuuu')
    let lists = [];
    try {
      // await the promise
      const querySnapshot = await fire.firestore()
      .collection("events")
      .doc(userInfo.uid)
      .collection("eventrows")
      .get();

      querySnapshot.forEach((doc) => {
        console.log("lista", doc.data());

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
        console.log("lists", lists);
      });
      console.log(lists);
      setEvents(lists);
      setLoader(false);
    } catch (error) {
      // catch part using try/catch
      console.log("Error getting documents: ", error);
      // return something else here, or an empty props, or throw an exception or whatever
    }

    // const lists = [];
    // fire
    //   .firestore()
    //   .collection("events")
    //   .doc(userInfo.uid)
    //   .collection("eventrows")
    //   //.onSnapshot(querySnapshot => {
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       console.log("lista", doc.data());

    //       const {
    //         title,
    //         summary,
    //         date,
    //         startDate,
    //         endDate,
    //         marked,
    //         selected,
    //         color,
    //         dotColor,
    //         repeateType,
    //         repeate,
    //       } = doc.data();
    //       let start = startDate.toDate().toString();
    //       let end = endDate.toDate().toString();
    //       let formatStart = moment(start).format("yy-MM-DD hh:mm:ss");
    //       let formatEnd = moment(end).format("yy-MM-DD hh:mm:ss");
    //       lists.push({
    //         id: doc.id,
    //         textColor: dotColor,
    //         start: start,
    //         end: end,
    //         startDate,
    //         endDate,
    //         title,
    //         summary,
    //         date,
    //         marked,
    //         selected,
    //         color,
    //         repeateType,
    //         repeate,
    //       });
    //       console.log('lists', lists)
    //     });
    //     return lists
    //   })
    //   .then((lists) => {
    //     console.log(lists)
    //     setEvents(lists);
    //     setLoader(false);
    //   })
  };

  useEffect(() => {
    setTimeout(() => {
      fetchingEvents();
    }, 6000)
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Kalendar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          {loader ? (
            <h1>loading......</h1>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
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
