import { useNavigate } from "react-router-dom";

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/reviews/${subject.id}`, {
      state: { subjectName: subject.nombre },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="
        border border-greige bg-white text-navy
        rounded-xl
        p-4 sm:p-5 lg:p-6
        hover:bg-navy hover:text-white
        transition
        shadow-md
        cursor-pointer
        flex flex-col justify-between
        min-h-[110px] sm:min-h-[130px]
      "
    >
      <span className="text-sm sm:text-base font-medium opacity-80">
        {subject.Departamento.nombre}
      </span>

      <h1 className="mt-2 font-semibold leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl">
        {subject.nombre}
      </h1>
    </div>
  );
}
