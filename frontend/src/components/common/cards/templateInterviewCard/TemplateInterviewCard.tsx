import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useState } from "react";
import { IconBtnM } from "../../buttons/iconBtn/IconBtn";
import { PlusIcon, RightBracketIcon } from "../../svgIcons/Icons";
import { BodyMBold, BodySMedium } from "../../typeScale/StyledTypeScale";

import { IQuestion } from "@/features/interviews/interviewsInterface";
import {
  Card,
  CardButtons,
  CardContent,
  CardCover,
  CardSubTitle,
} from "../card/StyledCard";

interface ITemplateInterviewCardProps {
  title: string;
  //temporary
  questions: IQuestion[];
  disable: boolean;
  onClick: () => void;
}

const TemplateInterviewCard = (props: ITemplateInterviewCardProps) => {
  const [hover, setHover] = useState(false);
  const { title, questions, disable, onClick } = props;

  return (
    <ElWrap w={312} h={216}>
      <Card
        className={(hover ? "hover" : "").concat(disable ? " disable" : "")}
        onClick={onClick}
      >
        <CardButtons>
          <ElWrap w={32}>
            <IconBtnM
              icon={<RightBracketIcon />}
              disable={false}
              onClick={() => {}}
              className={BackgroundColor.WHITE}
            />
          </ElWrap>
          <ElWrap w={32}>
            <IconBtnM
              icon={<PlusIcon />}
              disable={false}
              onClick={onClick}
              className={BackgroundColor.WHITE}
            />
          </ElWrap>
        </CardButtons>
        <CardCover imgUrl={""}></CardCover>
        <CardContent
          onMouseEnter={() => {
            setHover(disable ? false : true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <BodyMBold>{title}</BodyMBold>
          <CardSubTitle>
            <BodySMedium>{questions.length} Questions</BodySMedium>
          </CardSubTitle>
        </CardContent>
      </Card>
    </ElWrap>
  );
};

export default TemplateInterviewCard;
