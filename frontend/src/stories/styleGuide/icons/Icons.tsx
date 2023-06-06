import React from "react";
import {
  ArrowDownIcon,
  AsteriskIcon,
  BinIcon,
  CalendarIcon,
  CallIcon,
  CandidateIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  CloseIcon,
  DashboardIcon,
  DocumentIcon,
  DoorIcon,
  EditIcon,
  GoogleIcon,
  GraphIcon,
  HambergerIcon,
  InfoIcon,
  LocationIcon,
  MessageIcon,
  PaperIcon,
  PlusIcon,
  RightBracketIcon,
  RoleIcon,
  SettingIcon,
  StarIcon,
  TimeIcon,
} from "@/components/common/svgIcons/Icons";
import { iconLB, iconMB, iconSB } from "@/components/common/svgIcons/iconType";
import { H2Bold } from "@/components/common/typeScale/StyledTypeScale";
import styled from "styled-components";

const IconDiv = styled.div`
  text-align: center;
`;

const Icons = (): JSX.Element => {
  return (
    <>
      <div>
        <H2Bold>S/Line Icons</H2Bold>
        <hr />
        <div
          style={{
            display: "grid",
            marginTop: "20px",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          <IconDiv>
            <GoogleIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>GoggleIcon</div>
          </IconDiv>
          <IconDiv>
            <PlusIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>PlusIcon</div>
          </IconDiv>
          <IconDiv>
            <AsteriskIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>AsteriskIcon</div>
          </IconDiv>
          <IconDiv>
            <RightBracketIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>RightBracketIcon</div>
          </IconDiv>
          <IconDiv>
            <CardIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>CardIcon</div>
          </IconDiv>
          <IconDiv>
            <HambergerIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>HambergerIcon</div>
          </IconDiv>
          <IconDiv>
            <DocumentIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>DocumentIcon</div>
          </IconDiv>
          <IconDiv>
            <CalendarIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>CalendarIcon</div>
          </IconDiv>
          <IconDiv>
            <PaperIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>PaperIcon</div>
          </IconDiv>
          <IconDiv>
            <ChatIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>ChatIcon</div>
          </IconDiv>
          <IconDiv>
            <CheckIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>CheckIcon</div>
          </IconDiv>
          <IconDiv>
            <BinIcon {...iconSB} />
            <div style={{ marginTop: "10px" }}>BinIcon</div>
          </IconDiv>
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        <H2Bold>M/Line Icons</H2Bold>
        <hr />
        <div
          style={{
            display: "grid",
            marginTop: "20px",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          <IconDiv>
            <TimeIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>TimeIcon</div>
          </IconDiv>
          <IconDiv>
            <GraphIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>GraphIcon</div>
          </IconDiv>
          <IconDiv>
            <PaperIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>PaperIcon</div>
          </IconDiv>
          <IconDiv>
            <StarIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>StarIcon</div>
          </IconDiv>
          <IconDiv>
            <MessageIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>MessageIcon</div>
          </IconDiv>
          <IconDiv>
            <LocationIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>LocationIcon</div>
          </IconDiv>
          <IconDiv>
            <CallIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>CallIcon</div>
          </IconDiv>
          <IconDiv>
            <InfoIcon {...iconMB} />
            <div style={{ marginTop: "10px" }}>InfoIcon</div>
          </IconDiv>
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        <H2Bold>L/Line Icons</H2Bold>
        <hr />
        <div
          style={{
            display: "grid",
            marginTop: "20px",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          <IconDiv>
            <DashboardIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>DashboardIcon</div>
          </IconDiv>
          <IconDiv>
            <RoleIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>RoleIcon</div>
          </IconDiv>
          <IconDiv>
            <CandidateIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>CandidateIcon</div>
          </IconDiv>
          <IconDiv>
            <CalendarIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>CalendarIcon</div>
          </IconDiv>
          <IconDiv>
            <SettingIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>SettingIcon</div>
          </IconDiv>
          <IconDiv>
            <DoorIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>DoorIcon</div>
          </IconDiv>
          <IconDiv>
            <EditIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>EditIcon</div>
          </IconDiv>
          <IconDiv>
            <PlusIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>PlusIcon</div>
          </IconDiv>
          <IconDiv>
            <CloseIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>CloseIcon</div>
          </IconDiv>
          <IconDiv>
            <ArrowDownIcon {...iconLB} />
            <div style={{ marginTop: "10px" }}>ArrowDownIcon</div>
          </IconDiv>
        </div>
      </div>
    </>
  );
};

export default Icons;
