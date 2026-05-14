// function generateEmail() {

//   const topic = document.getElementById("topic").value;

//   const tone = document.getElementById("tone").value;

//   const template = document.getElementById("template").value;

//   const points = document.getElementById("points").value;

//   const email = `
// Subject: ${topic}

// Hello,

// I hope you are doing well.

// This is a ${tone.toLowerCase()} email created using the "${template}" template.

// Key Points:
// ${points}

// Thank you.

// Best Regards,
// John Doe
// `;

//   document.getElementById("result").innerText = email;
// }

// function copyEmail() {

//   const text = document.getElementById("result").innerText;

//   navigator.clipboard.writeText(text);

//   alert("Email copied successfully!");
// }

// function downloadTXT() {

//   const text = document.getElementById("result").innerText;

//   const blob = new Blob([text], {
//     type: "text/plain"
//   });

//   const link = document.createElement("a");

//   link.href = URL.createObjectURL(blob);

//   link.download = "generated-email.txt";

//   link.click();
// }

// function toggleDarkMode() {

//   document.body.classList.toggle("dark-mode");
// }
const API_KEY = "YOUR_OPENAI_API_KEY";

async function generateEmail() {
  const topic = document.getElementById("topic").value.trim();
  const tone = document.getElementById("tone").value;
  const template = document.getElementById("template").value;
  const technique = document.getElementById("technique").value;
  const length = document.getElementById("length").value;
  const points = document.getElementById("points").value.trim();

  const resultBox = document.getElementById("result");
  const promptBox = document.getElementById("promptResult");

  if (!topic || !points) {
    resultBox.innerText = "Please fill in both Email Topic and Key Points.";
    return;
  }

  let prompt = "";

  if (technique === "Role Prompting") {
    prompt = `
You are an expert corporate communication specialist.

Write a ${tone.toLowerCase()} ${template.toLowerCase()} email.

Requirements:
- Email length should be ${length}
- Maintain professional structure
- Use polite and clear language
- Add proper greeting and closing

Topic:
${topic}

Context:
${points}
`;
  } 
  
  else if (technique === "Zero Shot Prompting") {
    prompt = `
Write a ${tone.toLowerCase()} email for ${template}.

Topic:
${topic}

Details:
${points}
`;
  } 
  
  else {
    prompt = `
Example:

Subject: Meeting Request

Hello Team,

I would like to schedule a meeting regarding the current project updates.

Thank you.

Now write a similar ${tone.toLowerCase()} email for:

Topic:
${topic}

Details:
${points}
`;
  }

  promptBox.innerText = prompt;
  resultBox.innerText = "Generating AI email... Please wait.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message
    ) {
      const email = data.choices[0].message.content;
      resultBox.innerText = email;
    } else {
      resultBox.innerText = "Unexpected API response.";
    }

  } catch (error) {
    resultBox.innerText =
      "Error generating email. Please check your API key or internet connection.";

    console.error("Generation Error:", error);
  }
}

function copyEmail() {
  const text = document.getElementById("result").innerText;

  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Email copied successfully!");
    })
    .catch(err => {
      alert("Failed to copy email.");
      console.error(err);
    });
}

function downloadTXT() {
  const text = document.getElementById("result").innerText;

  const blob = new Blob([text], {
    type: "text/plain"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "generated-email.txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}