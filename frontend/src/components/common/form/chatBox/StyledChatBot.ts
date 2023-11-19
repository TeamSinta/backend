import styled from "styled-components";

export const ChatContainer = styled.div`
  width: 300px; /* Set a suitable width */
  border: 1px solid #ccc;
  overflow: hidden;
`;

export const ChatMessages = styled.div`
  max-height: 300px; /* Set a maximum height for overflow */
  overflow-y: auto; /* Enable vertical scrolling for overflow */
  padding: 10px;
`;

export const ChatInput = styled.div`
  border-top: 1px solid #ccc;
  padding: 10px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  border: none;
  resize: none; /* Disable textarea resizing */
  overflow-y: hidden;
  max-height: 100px; /* Set a maximum height for the input box */
`;
