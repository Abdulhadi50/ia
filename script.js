document.getElementById("submit-btn").addEventListener("click", function () {
  sendToChatGPT();
});

// sk-KWPbM1hl1XtQStz2zpVR_2NfTgwzgyJewJe_oL9JpHT3BlbkFJJdefqidy0XBjDi0DXCUNnOR8fcVzwJVtXlB8aw4w4A

function sendToChatGPT() {
  let value = document.getElementById("word-input").value;

  let body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: value }],
    tempreture: "1",
  };

  let headers = {
    Authorization: "Bearer sk-KWPbM1hl1XtQStz2zpVR_2NfTgwzgyJewJe_oL9JpHT3BlbkFJJdefqidy0XBjDi0DXCUNnOR8fcVzwJVtXlB8aw4w4A",
  };

  axios
    .post("https://api.openai.com/v1/chat/completions", body, {
      headers: headers,
    })
    .then((response) => {
      let reply = response.data.choices[0].message.content;
      document.getElementById("reply-content").textContent = reply;
    });
}
