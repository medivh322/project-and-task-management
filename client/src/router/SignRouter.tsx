import { Suspense } from 'react';
import PageLoader from '../components/PageLoader';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';

const SignRouter = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to={"login"} />} />
                    <Route path='login' element={<LoginPage />} />
                    <Route path='register' element={<RegisterPage />} />
                    <Route path='*' element={<div>не найдено:(</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    )
}

export default SignRouter;