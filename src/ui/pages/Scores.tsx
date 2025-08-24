import React, { useEffect, useState } from "react";
import { useDashboardQuery } from "../../redux/api";
import { scoreType } from "../../types/scores";
import {
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SyncIcon from "@mui/icons-material/Sync";
import useAdmin from "../../hooks/useAdmin";
import Loading from "../components/Loading";

const Scores = () => {
  const { username } = useAdmin();
  const [scoresData, setScoresData] = useState<scoreType[]>();
  const [rotating, setRotating] = useState<boolean>();
  const {
    data: scores,
    isLoading,
    isFetching,
    refetch,
  } = useDashboardQuery(username);
  console.log("scores", scores);
  const handleUpdate = async () => {
    setRotating(true);
    await refetch();
    setTimeout(() => setRotating(false), 1500);
  };

  useEffect(() => {
    if (scores) {
      setScoresData(scores);
    }
  }, [scores]);

  const calculateProgress = (points: number, totalPoints: number) => {
    if (points === 0) return 0;
    return (points / totalPoints) * 100;
  };

  return (
    <div className="w-11/12 h-full mx-auto flex flex-col justify-start gap-1">
      <div className="grid grid-cols-3 gap-2 mb-2 flex-shrink-0">
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Challengers Totali
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {scoresData?.length || 0}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Punteggio Medio
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {!scoresData || scoresData?.length === 0
              ? 0
              : (
                  (scoresData || [])?.reduce(
                    (sum, user) => sum + user.score,
                    0
                  ) / (scoresData || [])?.length
                ).toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow text-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Punteggio Massimo
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {!scoresData || scoresData?.length === 0
              ? 0
              : Math.max(...(scoresData?.map((user) => user.score) || []))}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-2/3">
        <div className="flex justify-between w-full bg-blue-500 items-center flex-shrink-0">
          <h2 className="text-xl font-semibold p-4 text-white">
            Classifica 🏆
          </h2>
          <IconButton
            style={{ marginRight: "16px" }}
            color="primary"
            size="large"
            onClick={() => handleUpdate()}
            className={`h-[48px] w-[48px] ${
              rotating ? "animate-rotate-once" : "shadow-lg"
            }`}
            disabled={isFetching || isLoading || rotating}
          >
            <SyncIcon color="info" />
          </IconButton>
        </div>

        {isFetching || isLoading || rotating ? (
          <Loading />
        ) : (
          <TableContainer className="overflow-auto">
            <Table stickyHeader className="w-full">
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="py-3 px-4 text-left">#</TableCell>
                  <TableCell className="py-3 px-4 text-left">
                    Challenger
                  </TableCell>
                  <TableCell className="py-3 px-4 text-left">
                    Progresso
                  </TableCell>
                  <TableCell className="py-3 px-4 text-left">
                    Mancanti
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!scoresData || scoresData?.length === 0) && (
                  <TableRow key="no-user-row" className="bg-gray-50 ">
                    <TableCell colSpan={5}>
                      <p className="flex justify-center w-full font-semibold">
                        Non sono presenti challenger
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {scoresData?.map((user, index) => (
                  <TableRow
                    key={user.name}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <TableCell className="py-3 px-4 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-medium">
                      <div className="w-full flex gap-2 items-center">
                        <Avatar alt={user.name} src={user.imgLink}>
                          {user?.name[0]?.toUpperCase() || "x"}
                        </Avatar>
                        <div>{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 w-1/3">
                      <div
                        style={{ position: "relative" }}
                        className="w-full bg-gray-200 rounded-full h-6 text-white font-bold"
                      >
                        <div
                          className="bg-blue-500 h-6 rounded-full"
                          style={{
                            width: `${calculateProgress(
                              user.score,
                              user.totalQuestions
                            )}%`,
                          }}
                        />
                        <div
                          className="-translate-x-1/2"
                          style={{
                            position: "absolute",
                            bottom: "1px",
                            left: "50%",
                          }}
                        >{`${user.score || "0"}/${user.totalQuestions}`}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {user.notAnsweredQuestions > 0 ? (
                        <Typography color="error" fontWeight={700}>
                          {user.notAnsweredQuestions}
                        </Typography>
                      ) : (
                        <CheckCircleOutlineIcon color="success" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Scores;
