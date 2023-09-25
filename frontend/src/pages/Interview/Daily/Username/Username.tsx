import React from "react";
import "./Username.css";
import { useParticipantProperty } from "@daily-co/daily-react";

interface UsernameProps {
  id: string;
  isLocal: boolean;
}

export default function Username({ id, isLocal }: UsernameProps) {
  const username = useParticipantProperty(id, "user_name");

  return (
    <div className="username">
      {username || id} {isLocal && "(you)"}
    </div>
  );
}
