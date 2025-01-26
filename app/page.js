"use client";
import styles from "../styles/home.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Description from "./(components)/Description";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a valid name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/Tutor`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to create Tutor");
      }

      router.push(`/tutor/${name}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.holder}>
      <div className={styles.text}>
        <Description
          title={"Welcome to Calendar Co-Pilot: Assignment Overview"}
          text={
            "This assignment involves building a system to help tutors set up their availability using natural language. The goal is to simplify the process of creating a weekly schedule by leveraging AI and MongoDB."
          }
        />
        <Description
          title={"Objective"}
          text={
            "The platform connects tutors with students by allowing tutors to describe their availability in natural language. The system will generate a proposed calendar, confirm it with the tutor, and save it to a MongoDB database."
          }
        />
        <Description
          title={"Key Features"}
          text={
            "1. Natural Language Input: Tutors describe their availability in plain English. \n2. AI-Powered Parsing: The system uses AI to extract and structure time slots. \n3. Calendar Proposal: Tutors review and confirm the generated schedule. \n4. MongoDB Integration: Confirmed schedules are securely stored in a noSQL database."
          }
        />
        <Description
          title={"Example Input"}
          text={
            "A tutor can enter: 'I am available between noon and 4pm on weekends, after 7 pm to midnight on Monday and Wednesday, and after 9pm otherwise.' The system will generate a structured calendar for confirmation."
          }
        />
        <Description
          title={"Technologies Used"}
          text={
            "1. Frontend: React.js with Material-UI for the user interface. \n2. Backend: Node.js and Express.js for API handling. \n3. AI: Gemini for natural language processing. \n4. Database: MongoDB for storing tutor profiles and availability."
          }
        />
        <Description
          title={"Next Steps"}
          text={
            "Enter your name to get started. You'll be redirected to a page where you can describe your availability and view your proposed schedule."
          }
        />
      </div>
      <div className={styles.main}>
        <h1 className={styles.test}>Calendar co-pilot</h1>
        <div>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            size="medium"
            aria-label="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="contained"
            size="medium"
            disabled={name === "" || loading}
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
