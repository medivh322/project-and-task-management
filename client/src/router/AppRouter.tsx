import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<div>hello</div>} />
                <Route path='/dashboard/*' element={<Dashboard />} />
                <Route path='*' element={<div>не найдено:(</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;