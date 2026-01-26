import { useContext } from "react";
import  TryContext  from "../context/tries/TryContext";

export const useTry = () => useContext(TryContext);
