<template>
  <div class="container py-2" id="chat-wrapper">
    <div>
      <b-sidebar
        width="180px"
        visible
        z-index="5"
        id="sidebar-variant"
        bg-variant="dark"
        text-variant="light"
        no-header
        right
        shadow
      >
        <template #footer="{ hide }">
          <div class="d-flex px-1 bg-dark text-light align-items-center py-2">
            <b-button variant="outline-light" block @click="hide"
              >Close</b-button
            >
          </div>
        </template>
        <div class="py-2 text-center">
          <h4>Conversations</h4>
          <b-button
            size="lg"
            class="m-0"
            block
            v-for="item in conversations"
            :key="item.conversationId"
            variant="dark"
            v-on:click="switchConversation(item)"
            >{{ item.otherUser }}</b-button
          >
        </div>
      </b-sidebar>
    </div>

    <div v-if="activeConversation">
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
                @click.prevent="sendMessage()"
                variant="outline-dark"
                class=""
                >Send</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
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
      youMessage: "",
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
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    openUserProfile() {
      console.log("active", this.activeConversation);
      var username;
      this.activeConversation.participants.forEach((p) => {
        if (p != this.user.userId) {
          username = p;
        }
      });
      this.$router.push("../../user-profile/" + username);
    },
    sendMessage() {
      if (this.youMessage) {
        console.log("active", this.activeConversation);
        db.collection("conversations")
          .doc(this.activeConversation.conversationId)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              createdAt: new Date(),
              creatorId: this.user.userId,
              content: this.youMessage,
            }),
          })
          .then(() => {
            console.log("message saved");
            this.youMessage = "";
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
    initializeChat() {
      var vueInstance = this;
      var userId = null;
      db.collection("conversations")
        .where("participants", "array-contains", this.user.userId)
        .onSnapshot((querySnapshot) => {
          console.log("query");
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
          //open latest conversation
        });
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
      // this.displayName = "";
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
  background-color: #32383e;
}
.chat-area {
  /*   border: 1px solid #ccc; */
  background: white;
  /* height: 50vh; */
  /* height: 550px; */
  height: 78vh;
  border-radius: 5px;
  bottom: 0;
  top: 0;
  padding: 1em;
  overflow-y: auto;
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
  margin-left: 55%;
}
.message-in {
  background: #f1f0f0;
  color: black;
}
.chat-inputs {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
