import React, { useEffect, useState } from "react";
import { useQuestionsQuery } from "../../../redux/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import NewQuestionModal from "../../modal/NewQuestionModal";
import useAdmin from "../../../hooks/useAdmin";

const Questions = () => {
  const { username } = useAdmin();
  const [questionsData, setQuestionsData] = useState<Question[]>();
  const [accordionExpanded, setAccordionExpanded] = useState<string>();
  const questions = useQuestionsQuery(username);

  useEffect(() => {
    if (questions.data) setQuestionsData(questions.data);
  }, [questions]);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setAccordionExpanded(newExpanded ? panel : undefined);
    };

  return (
    <div className="w-11/12 mx-auto flex flex-col h-full justify-start gap-4">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Domande totali
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {questionsData?.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Domande</h2>
          <NewQuestionModal />
        </div>
        <TableContainer className="overflow-auto h-80">
          <Table stickyHeader className="w-full">
            <TableBody className="overflow-auto">
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
                        <Typography component="span">{q.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {q.options.map((op, opInd) => (
                          <Typography
                            padding={1}
                            fontWeight={500}
                            className={`flex justify-between items-center rounded-md ${
                              opInd === q.correctOpt && "bg-green-200"
                            }`}
                          >
                            - {op}
                            {opInd === q.correctOpt && (
                              <CheckCircleRoundedIcon
                                fontSize="small"
                                color="success"
                              />
                            )}
                          </Typography>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Questions;
