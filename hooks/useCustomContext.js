import { useContext } from "react";
import Context from "../context/Context";

export default function useCustomContext(){
    return useContext( Context )
}