import { useContext } from "react";
import  StudentContext  from "../context/students/StudentContext";

export const useStudent = () => useContext(StudentContext);
