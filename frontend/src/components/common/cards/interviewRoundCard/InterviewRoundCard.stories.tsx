import { Meta, Story } from "@storybook/react"; // make sure to import Story from @storybook/react
import InterviewRoundCard, {
  InterviewRoundCardProps,
} from "./InterviewRoundCard";

export default {
  title: "common/cards/InterviewRoundCard",
  component: InterviewRoundCard,
} as Meta;

// Here we create a new type 'Template' that uses the 'Story' type provided by Storybook. 'Story' type is a generic type that takes the type of your component's props
const Template: Story<InterviewRoundCardProps> = (args) => (
  <InterviewRoundCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  image: "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
  title: "Coding Round",
  numberOfQuestions: "26 questions",
  roundId: "round1",
};

export const Hover = Template.bind({});
Hover.args = {
  image: "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
  title: "Coding Round",
  numberOfQuestions: "26 questions",
  roundId: "round1",
};

export const Selected = Template.bind({});
Selected.args = {
  image: "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
  title: "Coding Round",
  numberOfQuestions: "26 questions",
  roundId: "round1",
  selected: true, // Set selected prop to true
};
