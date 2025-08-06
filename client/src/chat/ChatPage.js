import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import styled from "styled-components";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const API_URL = "https://copia-2vq4.onrender.com/api/ask";

export default function ChatPage() {
  const { logout } = useContext(AuthContext);
  const { conversations, activeConvId, setActiveConvId, messages, newConversation } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConvId) return;

    setLoading(true);

    // Ajoute le message utilisateur
    await addDoc(collection(db, "conversations", activeConvId, "messages"), {
      author: "user",
      content: input,
      createdAt: Date.now(),
    });

    // Message IA "en attente"
    const aiRef = await addDoc(collection(db, "conversations", activeConvId, "messages"), {
      author: "ia",
      content: "⋯",
      createdAt: Date.now() + 1,
    });

    // Appel API backend Copia
    let aiText = "Je n'ai pas pu obtenir de réponse.";
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        body: (() => {
          let fd = new FormData();
          fd.append("questions", input);
          return fd;
        })(),
      });
      const data = await resp.json();
      aiText = data.answers || aiText;
    } catch (e) {}

    // Met à jour le message IA
    await updateDoc(doc(db, "conversations", activeConvId, "messages", aiRef.id), {
      content: aiText,
    });

    setInput("");
    setLoading(false);

    // Met à jour la date conversation
    await updateDoc(doc(db, "conversations", activeConvId), {
      updatedAt: Date.now(),
    });
  };

  return (
    <Page>
      <Sidebar>
        <h3>Discussions</h3>
        <ul>
          {conversations.map((conv) => (
            <li key={conv.id} className={conv.id === activeConvId ? "active" : ""} onClick={() => setActiveConvId(conv.id)}>
              {conv.name || "Sans titre"}
            </li>
          ))}
        </ul>
        <button onClick={newConversation}>+ Nouvelle</button>
        <button onClick={logout}>Déconnexion</button>
      </Sidebar>

      <Content>
        <ChatHeader />
        <Scroller ref={scroller}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} isMine={msg.author === "user"} />
          ))}
          {loading && <Anim>IA réfléchit…</Anim>}
        </Scroller>
        <MsgForm onSubmit={sendMessage}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Envoyer un message..." />
          <button disabled={loading || !input.trim()}>Envoyer</button>
        </MsgForm>
      </Content>
    </Page>
  );
}

const Page = styled.div`display:flex; height:100vh;`;
const Sidebar = styled.div`
  width:220px;
  background:#181824;
  color:#fff;
  padding:1rem;
  display:flex;
  flex-direction:column;
  gap:1rem;
  ul {
    flex:1;
    list-style:none;
    padding:0; margin:0;
    overflow:auto;
  }
  li {
    padding:.5em 0;
    cursor:pointer;
  }
  .active {
    font-weight:bold;
    color:#42c5f5;
  }
  button {
    margin:6px 0;
  }
`;
const Content = styled.div`flex:1; display:flex; flex-direction:column;`;
const Scroller = styled.div`flex:1; overflow-y:auto; padding:2em; background:#e9eaf1;`;
const MsgForm = styled.form`
  display:flex; gap:.5em; padding:1em; background:#fff;
  input { flex:1; padding:.5em;}
`;
const Anim = styled.div`
  color:#42c5f5; padding:1em 0; animation:blink 1s infinite alternate;
  @keyframes blink { to {opacity:.5;} }
`;
