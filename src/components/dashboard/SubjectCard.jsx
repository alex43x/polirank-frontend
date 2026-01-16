import { useNavigate } from 'react-router-dom';

export default function SubjectCard({ subject }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/reviews/${subject.id}`, { 
            state: { subjectName: subject.nombre } 
        });
    };

    return (
        <div 
            onClick={handleClick}
            className="border border-greige text-navy bg-white rounded-lg p-6 h-fit hover:bg-navy hover:text-white transition shadow-md cursor-pointer"
        >
            <span className="font-medium">{subject.Departamento.nombre}</span>
            <h1 className="lg:text-3xl md:text-2xl font-semibold my-2">{subject.nombre}</h1>
        </div>
    );
}