import { createContext, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectUser } from "../features/userSlice";

export const SocketContext = createContext();

export function SocketContextProvider({ children }) {
    const currentUser = useSelector(selectUser);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:5000"));
    }, [])

    useEffect(() => {
        socket?.emit("newUser", currentUser.displayName)
    }, [socket, currentUser.displayName])

    return <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
}
