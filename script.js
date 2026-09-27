const questionInput = document.getElementById("question");
const askButton = document.getElementById("askButton");
const answerBox = document.getElementById("answer");

askButton.addEventListener("click", askAI);

async function askAI() {
    const question = questionInput.value.trim();

    if (!question) {
        answerBox.textContent = "Please enter a question first.";
        questionInput.focus();
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    answerBox.textContent = "Please wait...";

    try {
        const response = await fetch(
            "https://pashyasgpt.onrender.com/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }

        answerBox.textContent = data.answer;

    } catch (error) {
        console.error("AI Request Error:", error);

        answerBox.textContent =
            "Unable to connect to the AI server. Please try again in a moment.";
    }

    askButton.disabled = false;
    askButton.textContent = "Ask AI";
}


// Ctrl + Enter → Ask AI
questionInput.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "Enter") {
        askAI();
    }
});