import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useState } from "react";
import { IconBtnM } from "../../buttons/iconBtn/IconBtn";
import { PlusIcon, RightBracketIcon } from "../../svgIcons/Icons";
import { BodyMBold, BodySMedium } from "../../typeScale/StyledTypeScale";
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
  questions: undefined[];
  disable: boolean;
}

const TemplateInterviewCard = (props: ITemplateInterviewCardProps) => {
  const [hover, setHover] = useState(false);
  const { title, questions, disable } = props;

  return (
    <ElWrap w={370} h={216}>
      <Card
        className={(hover ? "hover" : "").concat(disable ? " disable" : "")}
      >
        <CardButtons>
          <ElWrap w={32}>
            <IconBtnM
              icon={<RightBracketIcon />}
              disable={false}
              onClick={() => {
                console.log("here");
              }}
              className={BackgroundColor.WHITE}
            />
          </ElWrap>
          <ElWrap w={32}>
            <IconBtnM
              icon={<PlusIcon />}
              disable={false}
              onClick={() => {}}
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
