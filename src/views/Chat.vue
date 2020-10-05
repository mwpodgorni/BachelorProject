<template>
  <div class="container mt-2">
    <div>
      <b-button variant="dark" block v-b-toggle.sidebar-variant
        >Conversations</b-button
      >
      <b-sidebar
        id="sidebar-variant"
        title="Conversations"
        bg-variant="dark"
        text-variant="light"
        right
        shadow
      >
        <div class="py-2">
          <b-list-group>
            <b-list-group-item variant="dark">Conversation</b-list-group-item>
            <b-list-group-item variant="dark">Conversation</b-list-group-item>
            <b-list-group-item variant="dark">Conversation</b-list-group-item>
            <b-list-group-item variant="dark">Conversation</b-list-group-item>
            <b-list-group-item variant="dark">Conversation</b-list-group-item>
          </b-list-group>
        </div>
      </b-sidebar>
    </div>

    <section ref="chatArea" class="chat-area">
      <p
        v-for="message in messages"
        :key="message.body"
        class="message"
        :class="{
          'message-out': message.author === 'you',
          'message-in': message.author !== 'you',
        }"
      >
        {{ message.body }}
      </p>
    </section>

    <section class="chat-inputs">
      <b-form-group id="person2-form">
        <div class="row">
          <div class="col-9">
            <b-form-input
              v-model="youMessage"
              id="person2-form"
              placeholder="Type your message"
              type="text"
            ></b-form-input>
          </div>
          <div class="col-2">
            <b-button
              @click.prevent="sendMessage('out')"
              variant="outline-light"
              class=""
              >Save</b-button
            >
          </div>
        </div>
      </b-form-group>
    </section>
  </div>
</template>
<script>
export default {
  name: "Chat",
  data() {
    return {
      youMessage: "",
      messages: [
        {
          body: "Welcome to the chat, I'm Bob!",
          author: "bob",
        },
        {
          body: "Thank you Bob",
          author: "you",
        },
        {
          body: "You're most welcome",
          author: "bob",
        },
      ],
    };
  },
  methods: {
    sendMessage(direction) {
      if (!this.youMessage) {
        return;
      }

      this.messages.push({ body: this.youMessage, author: "you" });
      this.youMessage = "";
    },
  },
};
</script>
<style>
.chat-area {
  /*   border: 1px solid #ccc; */
  background: white;
  /* height: 50vh; */
  height: 550px;
  padding: 1em;
  overflow: auto;
  /* max-width: 350px; */
  margin: 0s auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.message {
  width: 45%;
  border-radius: 10px;
  padding: 0.5em;
  /*   margin-bottom: .5em; */
  font-size: 0.8em;
}
.message-out {
  background: #407fff;
  color: white;
  margin-left: 50%;
}
.message-in {
  background: #f1f0f0;
  color: black;
}
.chat-inputs {
  position: absolute;
  bottom: 0;
  width: 90%;
  /* display: flex; */
}
#person1-input {
  padding: 0.5em;
}
#person2-input {
  padding: 0.5em;
}
</style>