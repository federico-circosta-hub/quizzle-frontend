import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

const BottomNav = ({ value, handleChange, isAdmin }) => {
  return (
    <BottomNavigation
      className="w-full"
      showLabels
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        value={0}
        label="Punteggi"
        icon={<SportsScoreIcon />}
      />
      <BottomNavigationAction
        value={1}
        label="Domande"
        icon={<QuizRoundedIcon />}
      />
      {isAdmin && (
        <BottomNavigationAction
          value={2}
          label="Sfidanti"
          icon={<PeopleRoundedIcon />}
        />
      )}
    </BottomNavigation>
  );
};

export default BottomNav;
