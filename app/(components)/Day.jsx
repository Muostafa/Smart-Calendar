import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/material/styles";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: "8px 0",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:before": {
    display: "none", // Remove the default border
  },
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  margin: "4px 0",
  backgroundColor: theme.palette.grey[100],
  borderRadius: "4px",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

// Utility function to format time to 12-hour format
const formatTimeTo12Hour = (time) => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12; // Handle midnight (0 becomes 12)
  return `${hour12}:${minute} ${period}`;
};

const Day = ({ day, timeSlots = [] }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <StyledAccordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {day}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!timeSlots || timeSlots.length === 0 ? (
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              No availability for this day.
            </Typography>
          ) : (
            <Grid container spacing={1}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={12} key={index}>
                  <TimeSlot>
                    <AccessTimeIcon
                      sx={{ marginRight: "8px", color: "primary.main" }}
                      aria-label="Time slot"
                    />
                    <Typography variant="body1">
                      {`${formatTimeTo12Hour(slot.from)} - ${formatTimeTo12Hour(
                        slot.to
                      )}`}
                    </Typography>
                  </TimeSlot>
                </Grid>
              ))}
            </Grid>
          )}
        </AccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

export default Day;
