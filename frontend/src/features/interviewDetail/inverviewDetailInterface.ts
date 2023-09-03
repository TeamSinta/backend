import { IQuestion } from "../interviews/interviewsInterface";
import { IMockMembers } from "../roles/rolesInterface";

export interface IInterviewDetailStaging {
  interviewer: IMockMembers[];
  section: ISection[];
}

export interface ISection {
  id: number;
  title: string;
  time: number;
  questions: IQuestion[];
}
