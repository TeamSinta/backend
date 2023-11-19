import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  width: 300px; /* Set a suitable width */
  border: 1px solid #ccc;
  overflow: hidden;
`;

const ChatMessages = styled.div`
  max-height: 300px; /* Set a maximum height for overflow */
  overflow-y: auto; /* Enable vertical scrolling for overflow */
  padding: 10px;
`;

const ChatInput = styled.div`
  border-top: 1px solid #ccc;
  padding: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: none;
  resize: none; /* Disable textarea resizing */
  overflow-y: auto; /* Enable vertical scrolling for overflow within the textarea */
  max-height: 100px; /* Set a maximum height for the input box */
`;

const Chat = () => {
  const [messages, setMessages] = useState<{ text: string; editing: boolean }[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      const trimmedText = inputText.trim();
      if (trimmedText !== '') {
        setMessages([...messages, { text: trimmedText, editing: false }]);
        setInputText('');
      }
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container after rendering new messages
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEditClick = (index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].editing = true;
    setMessages(updatedMessages);
  };

  const handleEditChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = e.target.value;
    setMessages(updatedMessages);
  };

  const handleEditBlur = (index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].editing = false;
    setMessages(updatedMessages);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditBlur(index);
    }
  };

  return (
    <ChatContainer>
      <ChatMessages ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.editing ? (
              <Textarea
                value={message.text}
                onChange={(e) => handleEditChange(e, index)}
                onBlur={() => handleEditBlur(index)}
                onKeyDown={(e) => handleEditKeyDown(e, index)}
                rows={Math.max(message.text.split('\n').length, 1)} // Calculate the number of lines
              />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div> // Allow multiple lines to wrap
            )}
            <button onClick={() => handleEditClick(index)}>Edit</button>
          </div>
        ))}
      </ChatMessages>
      <ChatInput>
        <Textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
      </ChatInput>
    </ChatContainer>
  );
};

export default Chat;
