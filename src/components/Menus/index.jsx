import React, { useContext, useEffect } from "react";
//import TranslationContext from "src/context/Translation";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";

export default function Menus(props) {
  const { challenges, setChallenge, challenge, setColorBy } = props;
  const [challengeList, setChallengeList] = React.useState([]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [species, setSpecies] = React.useState("total");
  const [obsRich, setObsRich] = React.useState("OBS");

  useEffect(() => {
    setChallengeList(
      challenges.map((c) => <MenuItem value={c.name}>{c.name}</MenuItem>),
    );
  }, [challenges]);

  useEffect(() => {
    setColorBy(obsRich + "_" + species);
  }, [species, obsRich]);

  return <div></div>;
}
