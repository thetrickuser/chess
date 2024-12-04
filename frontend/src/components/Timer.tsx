import { useState, useEffect } from "react";
import { Chess } from "chess.js";

const Timer = ({chess, playerColor} : {chess: Chess, playerColor: string }) => {
    const [timer, setTimer] = useState("10:00");

    useEffect(() => {
        if (playerColor.startsWith(chess.turn())) {
        const interval = setInterval(() => {
            const [minutes, seconds] = timer.split(":");
            let sec = parseInt(seconds) - 1;
            if (sec < 0) {
                sec = 59;
                let min = parseInt(minutes) - 1;
                if (min < 0) {
                    min = 59;
                }
                setTimer(`${min}:${sec < 10 ? `0${sec}` : sec}`);
            } else {
                setTimer(`${minutes}:${sec < 10 ? `0${sec}` : sec}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }
    }, [timer, chess]);

    return (
        <div className="text-3xl bg-slate-500 text-white font-bold rounded h-1/6 w-3/4 flex justify-center align-middle">
            <h2 className="self-center">{timer}</h2>
        </div>
    );
}

export default Timer