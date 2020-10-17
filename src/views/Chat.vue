<template>
  <div class="container mt-2">
    <div>
      <!-- <b-button variant="dark" block> Username</b-button> -->
      <b-badge pill variant="dark">Username</b-badge>
      <b-sidebar
        class="mt-5"
        id="sidebar-variant"
        bg-variant="dark"
        text-variant="light"
        right
        shadow
      >
        <div class="py-2 text-center">
          <h4 style="">Conversations</h4>
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

    <div class="row">
      <div class="col">
        <b-input-group style="background-color: white;">
          <b-form-input
            v-model="youMessage"
            id="person2-form"
            placeholder="Type your message"
            type="text"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              @click.prevent="sendMessage('out')"
              variant="outline-dark"
              class=""
              >Send</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
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
  width: 100%;
  /* display: flex; */
}

#person2-input {
  /* padding: 0.5em; */
}
</style>
