import { createContext, useReducer } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const currentUser = useSelector(selectUser);
    const INITIAL_STATE = {
        chatUser: {},
        chatId: "",
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    chatUser: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                }
        
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data:state, dispatch }}>
            {children}
        </ChatContext.Provider>
    )
}