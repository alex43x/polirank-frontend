import { useContext } from "react";
import  CourseContext  from "../context/subjects/CourseContext";

export const useCourse = () => useContext(CourseContext);