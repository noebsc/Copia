import React from "react";
import styled from "styled-components";

export default function ChatHeader() {
  return <Head>💬 Copia Chat IA</Head>;
}

const Head = styled.div`
  background: #23242f;
  color: white;
  font-size: 1.2em;
  padding: 0.9em 1em;
  border-bottom: 2px solid #42c5f5;
  letter-spacing: 1px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(40,40,80,0.08);
`;
