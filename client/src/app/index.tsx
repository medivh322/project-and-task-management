import { BrowserRouter, Routes, Route } from "react-router-dom";
import { selectSignIn } from "../redux/sign/selectors";
import { useAppSelector } from "../redux/store";
import SignRouter from "../router/SignRouter";
import AppRouter from "../router/AppRouter";

function App() {
  const { isLoggenIn } = useAppSelector(selectSignIn);

  if (!isLoggenIn) return <SignRouter />

  return (
    <AppRouter />
  );
}

export default App;
