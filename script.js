const questionInput = document.getElementById("question");
const askButton = document.getElementById("askButton");
const answerBox = document.getElementById("answer");

askButton.addEventListener("click", askAI);

async function askAI() {
    const question = questionInput.value.trim();

    // Check if question is empty
    if (!question) {
        answerBox.textContent = "Please enter a question first.";
        questionInput.focus();
        return;
    }

    // Disable button while AI is thinking
    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    answerBox.textContent = "Please wait...";

    try {
        const response = await fetch("http://localhost:5000/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        answerBox.textContent = data.answer;

    } catch (error) {
        console.error(error);

        answerBox.textContent =
            "Unable to connect to the AI server. Please make sure the backend server is running.";
    }

    // Enable button again
    askButton.disabled = false;
    askButton.textContent = "Ask AI";
}


// Press Ctrl + Enter to ask
questionInput.addEventListener("keydown", function(event) {

    if (event.ctrlKey && event.key === "Enter") {
        askAI();
    }

});