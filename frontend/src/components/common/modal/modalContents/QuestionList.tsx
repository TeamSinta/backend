import { AppDispatch } from "@/app/store";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { IQuestion } from "@/features/interviews/interviewsInterface";
import {
  resetQuestionBank,
  selectInterview,
  setSelectedQuestion,
} from "@/features/interviews/interviewsSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBtnL, IconBtnM } from "../../buttons/iconBtn/IconBtn";
import { TextIconBtnL } from "../../buttons/textIconBtn/TextIconBtn";
import {
  BinIcon,
  GraphIcon,
  PlusIcon,
  RightBracketIcon,
  SelectArrowOpenIcon,
  TimeIcon,
} from "../../svgIcons/Icons";
import {
  BodyLBold,
  BodySMedium,
  H3Bold,
} from "../../typeScale/StyledTypeScale";
import {
  DetailOpenIcon,
  QeustionHeader,
  QuestionListContentLists,
  QuestionListContentWrap,
  QuestionListWrap,
  QuestionNumber,
  QuestionValue,
} from "./StyledModalContents";


const QuestionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedQuestion, questions, selectedQuestionBank } =
    useSelector(selectInterview);
  const [openItems, setOpenItems] = useState(new Set());
  const [html, setHtml] = useState<string>("");


  const openDetailHandler = (id: number, isOpen: boolean) => {
    const temp = new Set();
    if (!isOpen) {
      temp.add(id);
      setOpenItems(temp);
    } else {
      setOpenItems(temp);
    }
  };

  useEffect(() => {}, [openItems, setOpenItems, html, selectedQuestion]);

  return (
    <QuestionListWrap>
      <QeustionHeader>
        <div className="title">
          <ElWrap w={32}>
            <IconBtnM
              disable={false}
              onClick={() => {
                dispatch(resetQuestionBank());
              }}
              className={BackgroundColor.WHITE}
              icon={<RightBracketIcon />}
            />
          </ElWrap>
          <H3Bold>{selectedQuestionBank.title}</H3Bold>
        </div>
        <ElWrap w={240}>
          <TextIconBtnL
            disable={false}
            onClick={() => {}}
            className={BackgroundColor.ACCENT_PURPLE}
            icon={<PlusIcon />}
            label="Add All Questions"
          />
        </ElWrap>
      </QeustionHeader>
      <QuestionListContentWrap>
        <QuestionListContentLists>
          <div className="lists">
            {questions.map((question: IQuestion, index: number) => (
              <div className="list" key={index}>
                {!selectedQuestion.find(
                  (questionS: IQuestion) => questionS.id === question.id
                ) ? (
                  <div className="iconBtn">
                    <IconBtnL
                      icon={<PlusIcon />}
                      disable={false}
                      onClick={() => {
                        dispatch(
                          setSelectedQuestion({ selectedQuestion: question })
                        );
                      }}
                      className={BackgroundColor.ACCENT_PURPLE}
                    />
                  </div>
                ) : (
                  <div className="added">
                    <BodySMedium>Added</BodySMedium>
                    {/* <div className="iconBtn"> */}
                    <IconBtnL
                      icon={<BinIcon />}
                      disable={false}
                      onClick={() => {
                        dispatch(
                          setSelectedQuestion({ selectedQuestion: question })
                        );
                      }}
                      className={BackgroundColor.WHITE}
                    />
                    {/* </div> */}
                  </div>
                )}
                <div className="title">
                  <QuestionNumber>{index + 1}</QuestionNumber>
                  <BodyLBold>{question.title}</BodyLBold>
                  <DetailOpenIcon
                    open={openItems.has(question.id)}
                    onClick={() => {
                      setHtml(question.detail);
                      openDetailHandler(
                        question.id,
                        openItems.has(question.id)
                      );
                    }}
                    className={openItems.has(question.id) ? "open" : "close"}
                  >
                    <SelectArrowOpenIcon />
                  </DetailOpenIcon>
                </div>
                <div className="body">
                  <QuestionValue>
                    <BodySMedium>{question.competencies}</BodySMedium>
                  </QuestionValue>

                  <div className="iconDiv">
                    <TimeIcon />
                    <BodySMedium>{question.time}min</BodySMedium>
                  </div>
                  <div className="iconDiv">
                    <GraphIcon />
                    <BodySMedium>{question.level}</BodySMedium>
                  </div>
                </div>
                <div
                  className={
                    openItems.has(question.id) ? "detail" : "detail none"
                  }
                >
                  <div dangerouslySetInnerHTML={{ __html: html }}></div>
                </div>
              </div>
            ))}
          </div>
        </QuestionListContentLists>
      </QuestionListContentWrap>
    </QuestionListWrap>
  );
};

export default QuestionList;
