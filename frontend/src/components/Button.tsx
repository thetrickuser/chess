export const Button = ({onClick, children}: 
    {onClick: () => void, children: React.ReactNode}) => {
  return (
    <button
      onClick={onClick}
      className="text-3xl bg-green-500 hover:bg-green-400 text-white font-bold rounded h-1/5 w-3/4"
    >
      {children}
    </button>
  );
};
