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
      await navigator.clipboard.writeText(textToCopy);
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
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Challenger totali
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {challengersData?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Challenger</h2>
          <NewChallengerModal />
        </div>
        <TableContainer className="overflow-auto h-80">
          <Table stickyHeader className="w-full">
            <TableBody className="overflow-auto">
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
