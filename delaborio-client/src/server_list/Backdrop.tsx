import { ReactNode } from "react";

interface BackdropProps {
  children: ReactNode;
}

export default function Backdrop(props: BackdropProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-align-center">
      {props.children}
    </div>
  )
}