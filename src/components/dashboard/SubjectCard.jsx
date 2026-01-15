
export default function SubjectCard({ subject }){
    return (
        <div className="border border-greige text-navy bg-white rounded-lg p-6 h-fit hover:bg-navy hover:text-white transition shadow-md">
            <span className=" font-medium">{subject.Departamento.nombre}</span>
            <h1 className="lg:text-3xl md:text-2xl font-semibold my-2">{subject.nombre}</h1>
        </div>
    )
} 