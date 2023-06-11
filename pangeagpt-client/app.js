import axios from "axios";

const serverUrl = "http://localhost:3000";

window.addEventListener("load", () => {
  const chatbotForm = document.querySelector("#chatbot-form");
  const chatbotInput = document.querySelector("#chatbot-input");
  const chatbotBody = document.querySelector("#chatbot-body");

  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatbotInput.value.trim();
    if (message === "") return;

    // Add user chat
    addChatMessageAndScrollToBottom("user-message", message);
    chatbotInput.value = "";

    // Add bot response
    try {
      console.log(message);
      var msg = { data: message };
      var botResponse = getBotResponse(msg);
      // console.log(`botResponse: ${botResponse}`);
      // addChatMessageAndScrollToBottom("bot-message", botResponse.data);
    } catch (err) {
      addChatMessageAndScrollToBottom(
        "bot-message",
        "Sorry, an error occurred. Please try again"
      );
      console.log(err);
    }
  });

  function getBotResponse(msg) {
    try {
      axios.post(`${serverUrl}/botresponse`, msg).then((res) => {
        console.log(res);
        addChatMessageAndScrollToBottom("bot-message", res.data);
        return res;
      });
    } catch (err) {
      console.log(err);
      addChatMessageAndScrollToBottom(
        "bot-message",
        "Sorry, an error occurred. Please try again"
      );
    }
  }

  // "Scroll" in quotes of course!
  function addChatMessageAndScrollToBottom(className, text) {
    var isScrolledToBottom =
      chatbotBody.scrollHeight - chatbotBody.clientHeight <=
      chatbotBody.scrollTop + 1;

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-message", className);

    const messageText = document.createElement("p");
    messageText.innerText = text;

    messageContainer.appendChild(messageText);
    chatbotBody.appendChild(messageContainer);

    if (isScrolledToBottom)
      chatbotBody.scrollTop =
        chatbotBody.scrollHeight - chatbotBody.clientHeight;
  }
});
