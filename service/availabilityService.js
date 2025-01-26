export async function fetchTutorAvailability(name) {
  const response = await fetch(`/api/Tutor/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tutor availability");
  }
  return response.json();
}

export async function updateTutorAvailability(name, availability) {
  const response = await fetch(`/api/Tutor/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availability),
  });
  if (!response.ok) {
    throw new Error("Failed to update tutor availability");
  }
  return response;
}

// availabilityService.js
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Converts natural language text into structured availability data using the Gemini API.
 * @param {string} text - The natural language input describing availability.
 * @returns {Promise<string>} - A JSON string representing the availability.
 * @throws {Error} - If the API request fails.
 */
export async function convertTextToAvailability(text) {
  // Get the current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const currentDay = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const inputPrompt = `I will give you an English statement to convert to a JSON object in this format: 
  {
    "availability": [
      {
        "dayOfWeek": "string",
        "timeSlots": [
          {
            "from": "string",
            "to": "string" 
          }
        ]
      }
    ]
  }

  Rules:
  1. All times must be in 24-hour clock format.
  2. \`from\` must be less than \`to\`.
  3. \`from\` must be greater than or equal to "00:00".
  4. \`to\` must be less than or equal to "23:59".
  5. Each \`dayOfWeek\` must have at least one \`timeSlot\`.
  6. If a day does not have any \`timeSlots\`, do not include it in the output.
  7. If the input statement does not contain relevant information, return 1 random time slot on a random day.
  8. The output must be a valid JSON object, starting with '{' and ending with '}'.
  9. Never add comments to the output JSON object as It will be parsed by a program.
  10. End of day is 23:59. If from or to is equal to 24:00, make it equal 23:59.
  11. dayOfWeek must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday.
  12. The current time is ${currentTime}, and today is ${currentDay}. 

  Additional Instructions:
  - If the statement contains relative time references like "today" or "tomorrow," calculate the correct day based on the current date and time.
  - If the statement contains a duration like "for 2 hours," calculate the end time based on the start time.
  - If the statement contains a start time like "from 8pm," use it as the start time.
  - If no specific time is mentioned, assume a default duration of 1 hour.
  - If no specific day is mentioned, assume the current day.

  Example 1:
  Input: "I am available tomorrow for 2 hours from 8pm"
  Output: {
    "availability": [
      {
        "dayOfWeek": "wednesday",
        "timeSlots": [
          {
            "from": "20:00",
            "to": "22:00"
          }
        ]
      }
    ]
  }

  Example 2:
  Input: "I am available today from 3pm to 5pm"
  Output: {
    "availability": [
      {
        "dayOfWeek": "tuesday",
        "timeSlots": [
          {
            "from": "15:00",
            "to": "17:00"
          }
        ]
      }
    ]
  }

  Example 3:
  Input: "I am available this Friday at 10am for 1 hour"
  Output: {
    "availability": [
      {
        "dayOfWeek": "friday",
        "timeSlots": [
          {
            "from": "10:00",
            "to": "11:00"
          }
        ]
      }
    ]
  }

  Now, convert the following English statement: "${text}"`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: inputPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Ensure the response is valid JSON
    try {
      console.log(generatedText);
      JSON.parse(generatedText);
      return generatedText;
    } catch (error) {
      throw new Error("Gemini API returned invalid JSON");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to convert text to availability");
  }
}
