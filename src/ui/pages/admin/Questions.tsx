import React, { useEffect, useState } from "react";
import { useQuestionsQuery } from "../../../redux/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Question } from "../../../types/questions";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import PublicIcon from "@mui/icons-material/Public";
import NewQuestionModal from "../../modal/NewQuestionModal";
import useAdmin from "../../../hooks/useAdmin";
import PublishQuestionModal from "../../modal/PublishQuestionModal";
import DeleteQuestionModal from "../../modal/DeleteQuestionModal";
import Loading from "../../components/Loading";

const Questions = () => {
  const { username } = useAdmin();
  const [questionsData, setQuestionsData] = useState<Question[]>();
  const [accordionExpanded, setAccordionExpanded] = useState<string>();

  const {
    data: questions,
    isLoading,
    isFetching,
  } = useQuestionsQuery(username);

  useEffect(() => {
    if (questions) setQuestionsData(questions);
  }, [questions]);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setAccordionExpanded(newExpanded ? panel : undefined);
    };

  return (
    <div className="w-11/12 mx-auto justify-start gap-4 flex flex-col h-full">
      <div className="bg-white rounded-lg shadow flex flex-col h-3/4">
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">{`Domande (${questionsData?.length})`}</h2>
          <NewQuestionModal />
        </div>
        {isFetching || isLoading ? (
          <Loading />
        ) : (
          <TableContainer className="flex-1 overflow-auto">
            <Table stickyHeader className="w-full">
              <TableBody>
                {(!questionsData || questionsData?.length === 0) && (
                  <TableRow key="no-question-row" className="bg-gray-50 ">
                    <TableCell>
                      <p className="flex justify-center w-full font-semibold">
                        Non hai ancora creato delle domande
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ padding: 0 }} className="font-medium">
                    {questionsData?.map((q, index) => (
                      <Accordion
                        key={q._id}
                        expanded={accordionExpanded === index.toString()}
                        onChange={handleAccordionChange(index.toString())}
                      >
                        <AccordionSummary
                          expandIcon={<ArrowDropDownIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex">
                              {q.isPublished ? (
                                <Chip
                                  icon={<PublicIcon />}
                                  size="small"
                                  label="Pubblicata"
                                  color="success"
                                  variant="outlined"
                                />
                              ) : (
                                <Chip
                                  icon={<PublicOffIcon />}
                                  size="small"
                                  label="Non pubblicata"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}
                            </div>
                            <Typography component="span">{`${index + 1}. ${
                              q.question
                            }`}</Typography>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails style={{ paddingTop: 0 }}>
                          {q.media && (
                            <img
                              src={q.media}
                              alt="question media"
                              width={200}
                            />
                          )}
                          {q.options.map((op, opInd) => (
                            <div className="flex w-full" key={opInd}>
                              -
                              <Typography
                                padding="1px"
                                fontWeight={opInd === q.correctOpt ? 700 : 500}
                              >
                                {op}
                                {opInd === q.correctOpt && (
                                  <CheckCircleRoundedIcon
                                    fontSize="small"
                                    color="success"
                                  />
                                )}
                              </Typography>
                            </div>
                          ))}

                          <div className="w-full flex justify-end gap-4">
                            <DeleteQuestionModal question={q} />
                            {!q.isPublished && (
                              <NewQuestionModal question={q} />
                            )}
                            {!q.isPublished && (
                              <PublishQuestionModal question={q} />
                            )}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Questions;
