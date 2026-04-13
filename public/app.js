const form = document.getElementById("ping-form");
const messageInput = document.getElementById("message");
const usernameInput = document.getElementById("username");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const charCount = document.getElementById("char-count");

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.classList.remove("ok", "error");
  if (type) {
    statusEl.classList.add(type);
  }
}

function updateCount() {
  charCount.textContent = `${messageInput.value.length} / 1900`;
}

messageInput.addEventListener("input", updateCount);
updateCount();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  const username = usernameInput.value.trim();

  if (!message) {
    setStatus("Please enter a message before sending.", "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending...");

  try {
    const response = await fetch("/api/send-discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, username })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to send message.");
    }

    setStatus("Your message was sent to Discord.", "ok");
    messageInput.value = "";
    updateCount();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unexpected error.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});
