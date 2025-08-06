import React from "react";
import styled from "styled-components";

export default function MessageBubble({ msg, isMine }) {
  return (
    <Bubble $user={isMine}>
      <span>{isMine ? "Moi" : "Copia"}</span>
      <div>{msg.content}</div>
    </Bubble>
  );
}

const Bubble = styled.div`
  background: ${p => p.$user ? "#42c5f5" : "#fff"};
  color: ${p => p.$user ? "#fff" : "#23252c"};
  margin: 0.6em 0;
  max-width: 70%;
  border-radius: 16px;
  padding: 1em;
  align-self: ${p => p.$user ? "flex-end" : "flex-start"};
  box-shadow: 0 2px 8px rgba(40,40,80,0.07);
  animation: fadeIn 0.35s;
  span {
    font-size: 0.6em;
    opacity: 0.7;
  }
  @keyframes fadeIn {
    from {
      transform: translateY(15px);
      opacity: 0;
    } to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
