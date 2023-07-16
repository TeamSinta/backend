import ElWrap from "@/components/layouts/elWrap/ElWrap";
import DropdownFilter from "../../filters/dropdownFilter/DropdownFilter";
import SearchInput from "../../form/serchInput/SearchInput";
import { BodySMedium } from "../../typeScale/StyledTypeScale";
import {
  TemplateListContentWrap,
  TemplateListInputWrap,
  TemplateListWrap,
} from "./StyledModalContents";
import TemplateInterviewCard from "../../cards/templateInterviewCard/TemplateInterviewCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { useEffect } from "react";
import {
  getTemplatesAsync,
  selectInterview,
  selectTemplate,
} from "@/features/interviews/interviewsSlice";
import { ITemplates } from "@/features/interviews/interviesInterface";
import { useNavigate } from "react-router-dom";

const TemplateList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates } = useSelector(selectInterview);
  const navigate = useNavigate();

  const onSelecteTemaplate = (template: ITemplates) => {
    navigate(`/interviews/template/${template.template.id}`);
    dispatch(selectTemplate(template));
  };

  useEffect(() => {
    dispatch(getTemplatesAsync());
  }, [dispatch]);

  return (
    <TemplateListWrap>
      <TemplateListInputWrap>
        <ElWrap w={462} h={40}>
          <SearchInput
            disable={false}
            placeholder={"Seach for a questions"}
            error={false}
          />
        </ElWrap>
        <div className="filterWrap">
          <BodySMedium>Role:</BodySMedium>
          <DropdownFilter
            optionArr={[{ name: "Designer", value: "Designer" }]}
            dropdownName={"Role"}
          />
        </div>
      </TemplateListInputWrap>
      <TemplateListContentWrap>
        {templates.map((template: ITemplates) => (
          <TemplateInterviewCard
            title={template.template.title}
            questions={template.questions}
            disable={false}
            key={template.template.id}
            onClick={() => {
              onSelecteTemaplate(template);
            }}
          />
        ))}
      </TemplateListContentWrap>
    </TemplateListWrap>
  );
};

export default TemplateList;
