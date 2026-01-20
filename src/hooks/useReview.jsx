import { useContext } from "react";
import  ReviewContext  from "../context/reviews/ReviewContext";

export const useReview = () => useContext(ReviewContext);