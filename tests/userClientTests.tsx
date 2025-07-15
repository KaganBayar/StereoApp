import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
export default function UserTest() {
  const user = useContext(UserContext);
  console.log("UserTest user:", user);
}
