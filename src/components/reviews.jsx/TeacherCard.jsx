
export default function TeacherCard({ teacher, selected,reviews="-",score="-",position=0}) {
  return (
    <div
      className={`
        border border-greige rounded-lg lg:p-6 md:p-4 p-3 h-full shadow-md cursor-pointer transition
        ${selected
          ? "bg-dark-navy text-white"
          : "bg-white text-navy hover:bg-navy hover:text-white"}
      `}
    >
      <div className="font-bold text-sm  flex justify-between  ">{position===1?(<p>Mejor Calificado ☆</p>):(<p></p>)}Puntaje: {score.toFixed(2)}</div>
      <h1 className="lg:text-3xl md:text-2xl text-lg font-semibold my-2">
        {teacher.nombre}
      </h1>
      <div className="font-medium  text-sm  mt-auto">{reviews} review(s)</div>

    </div>
  );
}
