export interface IQuestion {
  [key: string]: number | string | string[];
  title: string;
  competency: string;
  time: number;
  level: string;
  detail: string;
  id: number;
}

export interface ITemplates {
  question_bank: {
    title: string;
    id: number;
  };
  questions: IQuestion[];
}
