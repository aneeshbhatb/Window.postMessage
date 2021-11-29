const chatBox = document.getElementById("chat-messages");
const chatInput = document.getElementById("message");
const chatSend = document.getElementById("send");
const frame = document.getElementById("frame");

const dateStringOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
}

const getDateTime = () => {
    return new Date().toLocaleString('en-US', dateStringOptions).replace(/,/g, "");
}

const genMessage = (message, type) => {
    let msgDateTime = getDateTime();
    let msgClass = "outgoing-message";
    if (type === "incoming") {
        msgClass = "incoming-message";
    }
    let wrap = document.createElement("div");
    wrap.classList.add("message-wrap");
    wrap.innerHTML = `
            <div class="message `+msgClass+`">
                <div class="content">`+message+`</div>
                <div class="chat-time">`+msgDateTime+`</div>
            </div>
    `;
    return wrap;
}

const scrollToBottom = () => {
    chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
}

const sendMessage = () => {
    if (!document.querySelector(".message-wrap")) {
        chatBox.innerHTML = "";
    }

    let message = chatInput.value;
    if (message.length) {
        frame.contentWindow.postMessage(message, "http://localhost:1413");
        chatBox.appendChild(genMessage(message, "outgoing"));
        chatInput.value = "";
        chatInput.focus();
    };
    scrollToBottom();

}

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keyup", function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        chatSend.click();
    }
});

window.addEventListener("message", (event) => {
    console.log(event);
    if (event.origin !== "http://localhost:1413")
      return;

    if (!document.querySelector(".message-wrap")) {
        chatBox.innerHTML = "";
    }
    chatBox.appendChild(genMessage(event.data, "incoming"));
    scrollToBottom();
}, false);