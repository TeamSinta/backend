import React from "react";

export const QuestionCollapsible: React.FC<any> = (data: any) => {
  const { question, index, activeIndex } = data;

  return (
    <div className={` ${activeIndex === index ? "active" : ""}`}>
      <p>
        {question?.question}{" "}
        <span>
          <i
            style={{ marginLeft: "10px" }}
            className={`fa ${
              activeIndex === index ? "fa-angle-up" : "fa-angle-down"
            }`}
          ></i>
        </span>
      </p>
    </div>
  );
};
