// import { AppDispatch } from "@/app/store";
import { IconBtnM } from "@/components/common/buttons/iconBtn/IconBtn";
import Photo from "@/components/common/buttons/photo/Photo";
import Photos from "@/components/common/buttons/photo/Photos";
import { EditIcon } from "@/components/common/svgIcons/Icons";
import { H3Bold } from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import {
  // getInterviewDetailAsync,
  selectInterviewDetail,
} from "@/features/interviewDetail/interviewDetailSlice";
import { IMockMembers } from "@/features/roles/rolesInterface";
import { BackgroundColor, PhotoType } from "@/features/utils/utilEnum";
// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Title } from "../StyledInterview";
import { OverviewInterviewers } from "./StyledOverviewInterviewer";

const InterviewOverviewInterviewer = () => {
  const { template } = useSelector(selectInterviewDetail); // Use the correct selector to access interviewers

  const interviewer = template.interviewers; // Access interviewers from the template

  return (
    <OverviewInterviewers>
      <Title>
        <H3Bold>Interviewers</H3Bold>
        <ElWrap w={32} h={32}>
          <IconBtnM
            icon={<EditIcon />}
            disable={false}
            className={BackgroundColor.WHITE}
            onClick={() => {}}
          />
        </ElWrap>
      </Title>
      <Photos>
        {interviewer.length > 0 ? (
          interviewer.map((interview: IMockMembers, index: number) => (
            <ElWrap w={40} h={40} key={index}>
              <Photo
                photoType={PhotoType.L}
                onSelect={() => {}}
                member_idx={interview.member_idx}
                member_name={interview.member_name}
                member_url={interview.member_url}
                selected={false}
              />
            </ElWrap>
          ))
        ) : (
          <></>
        )}
        {/* <ElWrap w={40} h={40}>
          <Photo
            photoType={PhotoType.L}
            onSelect={() => {}}
            member_idx={1}
            member_name={"Mattias Welamsson"}
            member_url={""}
            selected={false}
          />
        </ElWrap>
        <ElWrap w={40} h={40}>
          <Photo
            photoType={PhotoType.L}
            onSelect={() => {}}
            member_idx={1}
            member_name={"Mohamed Shegow"}
            member_url={
              "https://ca.slack-edge.com/T04C82XCPRU-U04D4BRG8CQ-c4ccf8605ed3-512"
            }
            selected={false}
          />
        </ElWrap> */}
      </Photos>
    </OverviewInterviewers>
  );
};

export default InterviewOverviewInterviewer;
