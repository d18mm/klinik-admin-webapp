import React, { useEffect } from "react";
import { auth } from "../../firebase";
export default function logout(props) {
  useEffect(() => {
    auth.signOut();
  });
  return <div />;
}
