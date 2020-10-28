<template>
  <div class="container px-0" id="chat-wrapper">
    <div>
      <b-sidebar
        width="180px"
        visible
        z-index="5"
        id="sidebar-variant"
        text-variant="light"
        class="color2"
        no-header
        right
        shadow
      >
        <template #footer="{ hide }">
          <div class="d-flex px-1 text-light align-items-center py-2 color2">
            <b-button variant="outline-light" block @click="hide"
              >Close</b-button
            >
          </div>
        </template>
        <div class="py-3 text-center color2">
          <h4>Conversations</h4>
          <b-button
            size="lg"
            class="m-0 sidebar-user"
            block
            v-for="item in conversations"
            :key="item.conversationId"
            v-on:click="switchConversation(item)"
            >{{ item.otherUser }}</b-button
          >
        </div>
      </b-sidebar>
    </div>
    <div v-if="activeConversation" class="color1">
      <b-button
        class="my-1"
        v-on:click="openUserProfile()"
        variant="outline-light"
        block
      >
        {{ displayName }}</b-button
      >
      <section ref="chatArea" class="chat-area" v-chat-scroll>
        <p
          v-for="message in messages"
          :key="message.createdAt.toString()"
          class="message"
          :class="{
            'message-out': message.creatorId === user.userId,
            'message-in': message.creatorId !== user.userId,
          }"
        >
          {{ message.content }}
        </p>
      </section>
      <b-input-group style="background-color: white;">
        <b-form-input
          v-model="message"
          id="input-form"
          placeholder="Type your message"
          type="text"
          @keyup.enter="sendMessage"
        ></b-form-input>
        <b-input-group-append>
          <b-button @click.prevent="sendMessage()" class="send-button"
            >Send</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  name: "Chat",
  data() {
    return {
      message: "",
      displayName: "",
      conversations: [],
      messages: [],
      activeConversation: null,
    };
  },
  created() {
    this.initializeChat();
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    initializeChat() {
      var vueInstance = this;
      var userId = null;
      db.collection("conversations")
        .where("participants", "array-contains", this.user.userId)
        .onSnapshot((querySnapshot) => {
          userId = this.$route.params.userId;
          this.conversations = [];
          querySnapshot.forEach(function (doc) {
            vueInstance.pushConversation(doc.data());
            if (userId) {
              if (doc.data().participants.includes(userId)) {
                vueInstance.openConversation(doc.data());
              }
            }
          });
          if (!userId) {
            this.openLatestConversation();
          }
        });
    },
    openUserProfile() {
      var username;
      this.activeConversation.participants.forEach((p) => {
        if (p != this.user.userId) {
          username = p;
        }
      });
      this.$router.push("../../user-profile/" + username);
    },
    sendMessage() {
      if (this.message) {
        db.collection("conversations")
          .doc(this.activeConversation.conversationId)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              createdAt: new Date(),
              creatorId: this.user.userId,
              content: this.message,
            }),
          })
          .then(() => {
            console.log("message saved");
            this.message = "";
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      }
    },
    pushConversation(data) {
      var otherUser;
      var dataCopy = data;
      dataCopy.usernames.forEach((element) => {
        if (element != this.user.data.displayName) {
          dataCopy.otherUser = element;
        }
      });
      this.conversations.push(dataCopy);
    },

    openLatestConversation() {
      var latestConversation = { id: null, timestamp: null };
      this.conversations.forEach((conversation) => {
        conversation.messages.forEach((message) => {
          if (latestConversation.id) {
            if (
              latestConversation.timestamp.toDate() < message.createdAt.toDate()
            ) {
              latestConversation.id = conversation.conversationId;
              latestConversation.timestamp = message.createdAt;
            }
          } else {
            latestConversation.id = conversation.conversationId;
            latestConversation.timestamp = message.createdAt;
          }
        });
      });
      this.conversations.forEach((conversation) => {
        if (conversation.conversationId == latestConversation.id) {
          this.switchConversation(conversation);
        }
      });
    },
    switchConversation(data) {
      var uid;
      if (data.participants[0] == this.user.data.userId) {
        uid = data.participants[1];
      } else {
        uid = data.participants[0];
      }
      var param = this.$route.params.userId;
      if (uid != param) {
        this.$router.push({
          name: "chat",
          params: { userId: uid },
        });
        this.openConversation(data);
      }
    },
    openConversation(data) {
      this.messages = [];
      this.activeConversation = data;
      if (this.activeConversation.usernames[0] == this.user.data.displayName) {
        this.displayName = this.activeConversation.usernames[1];
      } else {
        this.displayName = this.activeConversation.usernames[0];
      }
      this.initializeConversation();
    },
    initializeConversation() {
      var userId = this.$route.params.userId;
      if (userId && this.activeConversation) {
        this.messages = [];
        this.activeConversation.messages.forEach((m) => {
          this.messages.push(m);
        });
      } else {
      }
    },
  },
};
</script>
<style>
#chat-wrapper {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #133b5c;
}
.chat-area {
  background: #fcdab7;
  height: 80vh;
  border-radius: 5px;
  bottom: 0;
  top: 0;
  padding: 1em;
  overflow-y: auto;
  margin: 0s auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.message {
  width: 45%;
  border-radius: 10px;
  padding: 0.5em;
  font-size: 0.8em;
}
.message-out {
  background: #133b5c;
  color: white;
  margin-left: 55%;
}
.message-in {
  background: #1e5f74;
  color: white;
}
.b-sidebar-body {
  background-color: #133b5c;
}
.sidebar-user {
  background-color: #133b5c !important;
}
.sidebar-user:hover {
  background-color: #1e5f74 !important;
}
.send-button {
  background-color: white !important;
  color: black !important;
}
.send-button:hover {
  background-color: #133b5c !important;
  color: white !important;
}
</style>
