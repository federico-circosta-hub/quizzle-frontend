import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import NewChallengerModal from "../../modal/NewChallengerModal";
import { useChallengersQuery } from "../../../redux/api";
import useAdmin from "../../../hooks/useAdmin";
import { Challenger } from "../../../types/challenger";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { snackbarPropsType } from "../../../types/misc";
import CustomizedSnackbar from "../../components/CustomizedSnackbar";
import DeleteChallengerModal from "../../modal/DeleteChallengerModal";

const Challengers = () => {
  const { jwt } = useAdmin();
  const [challengersData, setChallengersData] = useState<Challenger[]>();
  const [accordionExpanded, setAccordionExpanded] = useState<string>();
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const basePath = window.location;
  const challengers = useChallengersQuery(jwt);

  useEffect(() => {
    if (challengers.data) setChallengersData(challengers.data);
  }, [challengers]);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setAccordionExpanded(newExpanded ? panel : undefined);
    };

  const handleCopy = async (textToCopy: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback copy failed:", err);
          throw new Error("Copy not supported");
        } finally {
          document.body.removeChild(textArea);
        }
      }

      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Link challenger copiato",
        severity: "success",
      });
    } catch (err) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Link challenger non copiato",
        severity: "error",
      });
      console.error("Errore nella copia:", err);
    }
  };

  return (
    <div className="w-11/12 mx-auto flex flex-col h-full justify-start gap-4">
      <div className="bg-white rounded-lg shadow flex flex-col h-3/4">
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">{`Challenger (${
            challengersData?.length || 0
          })`}</h2>
          <NewChallengerModal />
        </div>
        <TableContainer className="flex-1 overflow-auto">
          <Table stickyHeader className="w-full">
            <TableBody className="overflow-auto">
              {(!challengersData || challengersData?.length === 0) && (
                <TableRow key="no-question-row" className="bg-gray-50 ">
                  <TableCell>
                    <p className="flex justify-center w-full font-semibold">
                      Non hai ancora creato dei challenger
                    </p>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ padding: 0 }} className="font-medium">
                  {challengersData?.map((c, index) => {
                    const challengerLink = `${basePath
                      .toString()
                      .split("/")
                      .slice(0, 3)
                      .join("/")}/challenger/${c.name}/${c._id}`;
                    return (
                      <Accordion
                        key={c._id}
                        expanded={accordionExpanded === index.toString()}
                        onChange={handleAccordionChange(index.toString())}
                      >
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                          <div className="flex justify-start items-center gap-4">
                            <Avatar alt={c.name} src={c.imgLink}>
                              {c.name[0].toUpperCase()}
                            </Avatar>
                            <Typography component="span">{c.name}</Typography>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            padding={1}
                            fontWeight={500}
                            className="flex justify-between items-center rounded-md"
                          >
                            {`${challengerLink.slice(0, 31)}...`}
                            <IconButton
                              onClick={() => handleCopy(challengerLink)}
                            >
                              <ContentCopyRoundedIcon fontSize="medium" />
                            </IconButton>
                          </Typography>
                          <div className="w-full flex justify-start gap-4">
                            <DeleteChallengerModal challenger={c} />
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </div>
  );
};

export default Challengers;
