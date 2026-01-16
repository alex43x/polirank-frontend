import { useContext } from "react";
import CourseContext from "../context/courses/CourseContext";

export const useCourse = () => useContext(CourseContext);