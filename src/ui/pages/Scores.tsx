import React, { useEffect, useState } from "react";
import { useDashboardQuery } from "../../redux/api";
import { scoreType } from "../../types/scores";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAdmin from "../../hooks/useAdmin";

const Scores = () => {
  const { username } = useAdmin();
  const [scoresData, setScoresData] = useState<scoreType[]>();
  const scores = useDashboardQuery(username);

  useEffect(() => {
    if (scores.data) setScoresData(scores.data);
  }, [scores]);

  const calculateProgress = (points: number, totalPoints: number) => {
    if (points === 0) return 0;
    return (points / totalPoints) * 100;
  };

  return (
    <div className="w-11/12 mx-auto flex flex-col h-full justify-start gap-4">
      <div className="grid grid-cols-3 gap-2 mb-2">
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

      <div
        className="bg-white rounded-lg shadow overflow-hidden"
        style={{ height: "100%" }}
      >
        <h2 className="text-xl font-semibold p-4 bg-blue-500 text-white">
          Classifica 🏆
        </h2>
        <TableContainer className="overflow-x-auto" style={{ height: "100%" }}>
          <Table stickyHeader className="w-full">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="py-3 px-4 text-left">#</TableCell>
                <TableCell className="py-3 px-4 text-left">Nome</TableCell>
                <TableCell className="py-3 px-4 text-left">Punteggio</TableCell>
                <TableCell className="py-3 px-4 text-left">Progresso</TableCell>
                <TableCell className="py-3 px-4 text-left">Mancanti</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="overflow-auto">
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
                    {user.name}
                  </TableCell>
                  <TableCell className="py-3 px-4">{user.score}</TableCell>
                  <TableCell className="py-3 px-4 w-1/3">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{
                          width: `${calculateProgress(
                            user.score,
                            user.totalQuestions
                          )}%`,
                        }}
                      />
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
      </div>
    </div>
  );
};

export default Scores;
