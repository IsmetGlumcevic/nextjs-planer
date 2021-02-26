import React, { createContext, useState, useEffect, useContext } from "react";
import moment from "moment";
import fire from "../config/fire-config";
import { UserContext } from "./UserContext";
import { RRule, RRuleSet, rrulestr } from "rrule";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const { loggedIn, userInfo } = useContext(UserContext);
  const [items, setItems] = useState([]);

  const refreshData = () => {
    const lists = [];
    const result = {};
    fire
      .firestore()
      .collection("events")
      .doc(userInfo.uid)
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
        result.timeline = lists;
        result.notification = repeatLists;
      });
    setItems(result);
  };

  useEffect(() => {
    console.log(loggedIn, userInfo);
  });

  return (
    <StoreContext.Provider
      value={{
        items,
        setItems,
        refreshData,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
