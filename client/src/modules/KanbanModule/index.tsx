import { Route, Routes } from "react-router-dom";
import Board from "./components/Board";

const Kanban = () => {
    return (
        <Routes>
            <Route path='/:id' element={<Board />} />
            <Route path='*' element={<div>не найден проект</div>} />
        </Routes>
    )
}

export default Kanban;