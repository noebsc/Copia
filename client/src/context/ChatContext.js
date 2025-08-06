import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "conversations"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setConversations(convs);
      setLoadingConvs(false);
      if (convs.length && !activeConvId) setActiveConvId(convs[0].id);
    });
    return unsub;
  }, [user, activeConvId]);

  useEffect(() => {
    if (!activeConvId) return setMessages([]);
    const q = query(
      collection(db, "conversations", activeConvId, "messages"),
      orderBy("createdAt")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
    });
    return unsub;
  }, [activeConvId]);

  const newConversation = async () => {
    if (!user) return null;
    const docRef = await addDoc(collection(db, "conversations"), {
      userId: user.uid,
      name: "Nouvelle discussion",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setActiveConvId(docRef.id);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        loadingConvs,
        activeConvId,
        setActiveConvId,
        messages,
        newConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
