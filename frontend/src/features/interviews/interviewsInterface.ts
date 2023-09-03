export interface IQuestion {
  [key: string]: number | string | string[];
  title: string;
  competencies: string[];
  time: number;
  level: string;
  detail: string;
  id: number;
}

export interface ITemplates {
  template: {
    title: string;
    id: number;
  };
  questions: IQuestion[];
}
