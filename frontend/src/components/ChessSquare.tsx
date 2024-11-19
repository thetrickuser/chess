import { Square } from "chess.js";

const ChessSquare = ({position, color, } : {position: string, color: string, square: Square}) => {
    return <>
    <div
              key={position}
              className={`${color} w-16 h-16 text-2xl border border-black flex justify-center items-center`}
              
            >
              {square ? square.type : ""}
            </div></>
}

export default ChessSquare;