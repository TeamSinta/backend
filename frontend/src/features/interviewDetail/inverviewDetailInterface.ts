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

export interface InterviewDetailResponse {
  title: string;
  id: number;
  topics_text: string;
  template_id: number;
  company_id: number;
  time: number;
  questions: number[]; // Assuming 'questions' is a list of foreign keys to Question and of type number[]
}
