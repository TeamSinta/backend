import ElWrap from "@/components/layouts/elWrap/ElWrap";

import { BackgroundColor } from "@/features/utils/utilEnum";
import { useState } from "react";
import {
  Card,
  CardButtons,
  CardContent,
  CardCover,
  CardSubTitle,
  CardSubTitleContent,
  CardWrap,
} from "../card/StyledCard";
import { IconBtnM } from "@/components/common/buttons/iconBtn/IconBtn";
import { RightBracketIcon } from "@/components/common/svgIcons/Icons";
import { PhotoIcon, NumberIcon } from "../card/StyledCard";
import {
  BodyMMedium,
  BodySMedium,
  BodySBold,
} from "@/components/common/typeScale/StyledTypeScale";
import Photos from "../../buttons/photo/Photos";
import { InitialsGenerator } from "@/utils/Utils";

interface IMembers {
  member_idx: number;
  member_url: string;
  member_name: string;
}

interface ITemplateHomeCard {
  title: string;
  disable: boolean;
  questions: undefined[];
  members: IMembers[];
  sections: undefined[];
}

const TemplateHomeCard = (props: ITemplateHomeCard) => {
  const [hover, setHover] = useState(false);
  const { title, disable, members, questions, sections } = props;

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
              onClick={() => {}}
              className={BackgroundColor.WHITE}
            />
          </ElWrap>
        </CardButtons>
        <CardCover imgUrl={""}></CardCover>

        <CardWrap>
          <CardContent
            onMouseEnter={() => {
              setHover(disable ? false : true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          >
            <BodyMMedium>{title}</BodyMMedium>
            <CardSubTitle>
              <CardSubTitleContent>
                <BodySMedium>{sections.length} Sections</BodySMedium>
                <div className="dot"></div>
                <BodySMedium>{questions.length} Questions</BodySMedium>
              </CardSubTitleContent>
            </CardSubTitle>
          </CardContent>
          <Photos>
            <>
              {members.slice(0, 4).map((member: IMembers, index) => (
                <ElWrap w={32} h={32} key={index}>
                  <PhotoIcon imgUrl={member.member_url}>
                    <BodySBold>
                      {!member.member_url
                        ? InitialsGenerator(member.member_name)
                        : ""}
                    </BodySBold>
                  </PhotoIcon>
                </ElWrap>
              ))}
            </>
            <>
              {members.length > 4 ? (
                <NumberIcon imgUrl="">
                  <BodySBold>+{members.length - 4}</BodySBold>
                </NumberIcon>
              ) : (
                <></>
              )}
            </>
          </Photos>
        </CardWrap>
      </Card>
    </ElWrap>
  );
};

export default TemplateHomeCard;
