"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/home.module.css";
import TextField from "@mui/material/TextField";
import Calendar from "@/app/(components)/Calendar";
import Confirmation from "@/app/(components)/Confirmation";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";

import {
  isEmpty,
  toStr,
  combineTimeslots,
} from "../../../utils/availabilityUtils";

import {
  fetchTutorAvailability,
  updateTutorAvailability,
  convertTextToAvailability,
} from "../../../service/availabilityService";

const page = ({ params }) => {
  const router = useRouter();
  const [found, setFound] = useState(true);
  const [res, setRes] = useState("");
  const [text, setText] = useState("");
  const [apires, setApires] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    fetchTutorAvailability(params.name)
      .then((result) => {
        setFound(isEmpty(result.tutors));
        setRes(result.tutors[0]);
      })
      .catch(console.log);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const availability = await convertTextToAvailability(text);
      setApires(availability);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      const firstAvailability = apires;
      const secondAvailability = toStr({ ...res.availability });

      const newAvailability =
        secondAvailability === `{"availability": ]}`
          ? firstAvailability
          : toStr(
              combineTimeslots(
                JSON.parse(firstAvailability).availability,
                JSON.parse(secondAvailability).availability
              )
            );

      await updateTutorAvailability(params.name, JSON.parse(newAvailability));
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      {found ? (
        <div className={styles.main}>Loading...</div>
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>Hello {decodeURI(params.name)}</h1>
          <h1 className={styles.title}>I am available at</h1>
          <Calendar {...res.availability} />
          <TextField
            className={styles.text2}
            id="standard-multiline-static"
            label="When are you available"
            multiline
            onChange={(e) => setText(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            size="medium"
            onClick={handleSubmit}
            disabled={text === ""}
            loading={loading}
          >
            Submit
          </LoadingButton>

          <Confirmation availability={apires} />
          <LoadingButton
            variant="contained"
            size="medium"
            onClick={handleConfirm}
            disabled={apires === "{}"}
            loading={loading2}
          >
            Confirm
          </LoadingButton>
        </div>
      )}
    </>
  );
};

export default page;
