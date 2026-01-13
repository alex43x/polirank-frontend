import { useContext } from "react";
import  SubjectContext  from "../context/subjects/SubjectContext";

export const useSubject = () => useContext(SubjectContext);