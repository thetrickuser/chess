import { useState } from "react";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";

export const CreateGame = () => {
    const socket = useSocket();
    const [payload, setPayload] = useState({});

    function handleNameChange(value: string): void {
        setPayload({ ...payload, name: value });
    }

    function handlePiecesChange(value: string): void {
        setPayload({ ...payload, pieces: value });
    }

  return (
    <div className="flex flex-col justify-center w-1/2 m-auto p-4 rounded gap-4 bg-slate-500 items-center">
      <div className="text-4xl font-bold text-white">create game</div>
      <input
        type="text"
        placeholder="Your Name"
        className="w-1/2 text-black text-4xl"
        onChange={e => handleNameChange(e.target.value)}
      />
      <div className="flex gap-4 justify-center text-3xl">
        <label>Select your pieces</label>
        <select name="pieces" onChange={e => handlePiecesChange(e.target.value)}>
          <option value="white">White</option>
          <option value="custom">Black</option>
        </select>
      </div>
      <Button onClick={() => socket?.send(JSON.stringify({ type: "create_game", payload }))}>Create Game</Button>
    </div>
  );
};
