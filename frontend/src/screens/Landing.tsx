import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          <div>
            <img src="./chessboard.png" alt="Chess Board" />
          </div>
          <div className="pt-16">
            <div className="flex justify-center">
              <h1 className="text-4xl font-bold text-white">
                Play Chess Online at #2 site!
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="mt-4">
                <Button onClick={() => navigate("/game")}>
                  Play Online
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
