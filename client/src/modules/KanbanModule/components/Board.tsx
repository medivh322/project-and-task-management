import { useParams } from "react-router-dom";

const Board = () => {
    const param = useParams();
    return <div>{param.id}</div>
}

export default Board;