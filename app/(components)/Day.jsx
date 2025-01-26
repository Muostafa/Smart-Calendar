import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Time from "./Time";
import styles from "../../styles/calendar.module.css";

const Day = ({ day, timeSlots }) => {
  // Check if timeSlots is defined and not empty
  if (!timeSlots || timeSlots.length === 0) {
    return (
      <div className={styles.calendar}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>{day}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>No availability for this day.</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>{day}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {timeSlots.map((slot, index) => (
            <Typography key={`${slot.from}-${slot.to}-${index}`}>
              <Time from={slot.from} to={slot.to} />
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Day;
