import React, { useState, useRef, useEffect } from "react";
import {
  StyledCommentBox,
  StyledCommentInput,
  StyledCommentList,
} from "./StyledNotes";
import { PencilIcon } from "@/components/common/svgIcons/Icons";
import ElWrap from "@/components/layouts/elWrap/ElWrap";

type Comment = {
  timestamp: string;
  timeDelta: string;
  comment: string;
};

function Notes(props: any) {
  const { elapsedTime, reactClicked } = props;
  const [comments, setComments] = useState<Comment[]>([]);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("CLICKED ", reactClicked?.clicked);
    if (reactClicked?.clicked >= 1) {
      handleReacts(reactClicked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactClicked]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInputRef.current) {
      const commentInput = commentInputRef.current;
      const comment = commentInput.value.trim();
      if (comment) {
        const timestamp = getCurrentTime();
        const timeDelta = calculateTimeDelta(timestamp);
        const newComment: Comment = { timestamp, timeDelta, comment };
        setComments((prevComments) => [...prevComments, newComment]);
        commentInput.value = "";
        //Put this in API. timestamp ,timeDelta, newComment.
      }
    }
  };
  const handleReacts = (reactClicked: any = "") => {
    const comment = reactClicked?.message ?? "";
    if (comment) {
      const timestamp = getCurrentTime();
      const timeDelta = calculateTimeDelta(timestamp);
      const newComment: Comment = { timestamp, timeDelta, comment };
      setComments((prevComments) => [...prevComments, newComment]);
      //Put this in API. timestamp ,timeDelta, newComment.
    }
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const calculateTimeDelta = (timestamp: string): string => {
    const initialTime = convertToSeconds(elapsedTime);
    const currentTime = convertToSeconds(timestamp);
    const delta = currentTime - initialTime;
    return formatTime(delta);
  };

  const convertToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":");
    return +hours * 3600 + +minutes * 60 + +seconds;
  };
  function formatTime(time: any) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div>
      <StyledCommentList>
        {comments.map((c, index) => (
          <div
            className="comment"
            key={index}
            style={{
              marginBottom: "10px",
              paddingBottom: "10px",
              border: "none",
            }}
          >
            <span
              className="timestamp"
              style={{
                color: "#848487",
                fontWeight: "normal",
                marginBottom: "10px",
              }}
            >
              {c.timeDelta}
            </span>
            <br />
            <p
              className="commentText"
              style={{
                color: "black",
                fontWeight: "normal",
              }}
            >
              {c.comment}
            </p>
          </div>
        ))}
      </StyledCommentList>
      <StyledCommentBox style={{}} className="inputContainer">
        <ElWrap w={35}>
          <PencilIcon />
        </ElWrap>
        <StyledCommentInput
          ref={commentInputRef}
          type="text"
          name="comment"
          placeholder="Write your comment"
          className="commentInput"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommentSubmit(e);
            }
          }}
        />
      </StyledCommentBox>
    </div>
  );
}

export default Notes;
