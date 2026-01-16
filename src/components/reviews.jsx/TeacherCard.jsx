
export default function TeacherCard({ teacher, selected }) {
  return (
    <div
      className={`
        border border-greige rounded-lg p-6 h-fit shadow-md cursor-pointer transition
        ${selected
          ? "bg-dark-navy text-white"
          : "bg-white text-navy hover:bg-navy hover:text-white"}
      `}
    >
      <span className="font-medium">{teacher.correo}</span>
      <h1 className="lg:text-3xl md:text-2xl font-semibold my-2">
        {teacher.nombre}
      </h1>
    </div>
  );
}
