import axios from "axios";
import config from "@/config.json";
import { useState, useEffect } from "react";

const ConclusionData = () => {
  const [summaryInfo, setSummaryInfo] = useState([]);
  const [questionsTranscript, setQuestionsTranscript] = useState([]);
  const [summarizedAnswers, setSummarizedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Swap out '1' with the interview ID.

  const questionsTranscriptAPI = `${config.apiURL}/transcription/get_transcripts_for_questions/1/`;
  const summarizedAnswersAPI = `${config.apiURL}/question_response/question_summarized_answers/1/`;
  const summaryInfoAPI = `${config.apiURL}/summary/generate/1/`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(questionsTranscriptAPI);
        const response2 = await axios.get(summarizedAnswersAPI);
        const response3 = await axios.get(summaryInfoAPI);

        setQuestionsTranscript(response1.data);
        setSummarizedAnswers(response2.data);
        setSummaryInfo(response3.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return [summarizedAnswers, questionsTranscript, summaryInfo, loading, error];
};

export default ConclusionData;
