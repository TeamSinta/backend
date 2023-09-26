import { AppDispatch } from "@/app/store";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { IQuestion } from "@/features/interviews/interviewsInterface";
import {
  resetQuestionBank,
  selectInterview,
  setSelectedQuestion,
} from "@/features/interviews/interviewsSlice";
import { closeModal } from "@/features/modal/modalSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IconBtnM } from "../../buttons/iconBtn/IconBtn";
import { TextBtnL } from "../../buttons/textBtn/TextBtn";
import { TextIconBtnL } from "../../buttons/textIconBtn/TextIconBtn";
import Competencies from "../../elements/competencies/Competencies";
import { CloseIcon, PlusIcon } from "../../svgIcons/Icons";
import {
  BodyLBold,
  BodyLMedium,
  H2Bold,
} from "../../typeScale/StyledTypeScale";
import {
  QuestionBody,
  QuestionLayout,
  QuestionListWrap,
  QuestionNumber,
  QuestionsFilterWrap,
  SelectedQuestionList,
  SelectedQuestionListWrap,
  TemplateBody,
  TemplateLayout,
} from "./StyledModalContents";
import TemplateList from "./TemplateList";
import QuestionList from "./QuestionList";

const SelectTemplate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedQuestion, selectedQuestionBank } =
    useSelector(selectInterview);
  const navigate = useNavigate();

  useEffect(() => {}, [selectedQuestion, selectedQuestionBank]);

  return (
    <>
      {/* ===== Templates Start ===== */}
      <TemplateLayout>
        <H2Bold>Templates</H2Bold>
        <TemplateBody>
          {selectedQuestionBank.id === 0 ? <TemplateList /> : <QuestionList />}
          <Outlet />
        </TemplateBody>
      </TemplateLayout>
      {/* ===== Templates End ===== */}
      {/* ===== Questions Start ===== */}
      <QuestionLayout>
        <H2Bold>Added Questions</H2Bold>
        <QuestionBody>
          {selectedQuestion.length === 0 ? (
            <>
              <div className="none-q">
                Here will be the questions that you add from the templates
              </div>
            </>
          ) : (
            <QuestionListWrap>
              <QuestionsFilterWrap>
                <div className="lists">
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                  <Competencies
                    label={"All"}
                    selected={false}
                    onClick={() => {}}
                  ></Competencies>
                </div>
              </QuestionsFilterWrap>
              <SelectedQuestionListWrap>
                {selectedQuestion.map((question: IQuestion, index: number) => (
                  <div className="view">
                    <SelectedQuestionList>
                      <QuestionNumber>{index + 1}</QuestionNumber>
                      <div className="title">
                        <BodyLMedium>{question.title}</BodyLMedium>
                      </div>
                      <ElWrap h={32} w={32}>
                        <IconBtnM
                          icon={<CloseIcon />}
                          disable={false}
                          onClick={() => {
                            dispatch(
                              setSelectedQuestion({
                                selectedQuestion: question,
                              })
                            );
                          }}
                          className={BackgroundColor.WHITE}
                        />
                      </ElWrap>
                    </SelectedQuestionList>
                  </div>
                ))}
              </SelectedQuestionListWrap>
            </QuestionListWrap>
          )}
          <>
            <div className="questions-length">
              <BodyLBold>{selectedQuestion.length} Questions</BodyLBold>
            </div>
            <div className="btn-wrap">
              <TextBtnL
                label="Skip"
                disable={false}
                onClick={() => {}}
                className={BackgroundColor.WHITE}
              />
              <TextIconBtnL
                label="Add to Round"
                disable={false}
                className={BackgroundColor.ACCENT_PURPLE}
                onClick={() => {
                  dispatch(resetQuestionBank());
                  dispatch(closeModal());
                  navigate("/interviews");
                }}
                icon={<PlusIcon />}
              />
            </div>
          </>
        </QuestionBody>
      </QuestionLayout>
      {/* ===== Questions End ===== */}
    </>
  );
};

export default SelectTemplate;
