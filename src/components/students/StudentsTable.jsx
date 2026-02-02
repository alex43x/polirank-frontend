import React, { useContext, useEffect, useState } from "react";
import StudentContext from "../../context/students/StudentContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from "primereact/inputicon";
import StudentDialog from "./StudentDialog";


export default function StudentsTable() {
    const { students, loading, fetchStudents, total, page, totalPages, limit, createStudent, updateStudent, deleteStudent } =
        useContext(StudentContext);

    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [studentDialog, setStudentDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);


    // Traer estudiantes al montar el componente
    useEffect(() => {
        fetchStudents({ page: 1, limit: rowsPerPage });
    }, []);

    // Obtener estudiantes cuando cambia la página o el número de filas
    useEffect(() => {
        if (currentPage > 0 || rowsPerPage !== 20) {
            fetchStudents({ 
                page: currentPage + 1, 
                limit: rowsPerPage,
                ...(searchValue.trim() && { search: searchValue })
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, rowsPerPage]);

    const openNewStudentDialog = () => {
        setSelectedStudent(null);
        setDialogMode("create");
        setStudentDialog(true);
    }

    // Manejar búsqueda
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setCurrentPage(0);
        
        // Si hay búsqueda, enviar el parámetro al backend
        if (value.trim()) {
            fetchStudents({ page: 1, limit: rowsPerPage, search: value });
        } else {
            fetchStudents({ page: 1, limit: rowsPerPage });
        }
    };

    // Manejadores de paginación
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber - 1); // Convertir a índice 0
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Función para generar los números de página visibles
    const getPageNumbers = () => {
        const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // Primera página
                i === totalPages || // Última página
                (i >= currentPage - delta && i <= currentPage + delta) // Páginas cercanas a la actual
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    };

    const editStudent = (student) => {
        setSelectedStudent(student);
        setDialogMode("edit");
        setStudentDialog(true);
    };

    const confirmDeleteStudent = (student) => {
        if (window.confirm(`¿Está seguro de que desea eliminar a ${student.nombre}?`)) {
            handleDeleteStudent(student.id);
        }
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await deleteStudent(studentId);
            // Recargar estudiantes después de eliminar
            await fetchStudents({ page: currentPage + 1, limit: rowsPerPage });
        } catch (error) {
            console.error("Error al eliminar estudiante:", error);
            alert("Error al eliminar estudiante");
        }
    };

    const handleSaveStudent = async (formData) => {
        try {
            if (dialogMode === "create") {
                await createStudent(formData);
                // Recargar estudiantes después de crear
                await fetchStudents({ page: 1, limit: rowsPerPage });
            } else if (dialogMode === "edit") {
                await updateStudent(selectedStudent.id, formData);
                // Recargar estudiantes después de actualizar
                await fetchStudents({ page: currentPage + 1, limit: rowsPerPage });
            }
        } catch (error) {
            console.error("Error al guardar estudiante:", error);
            alert("Error al guardar estudiante");
        }
    };

    const handleCloseDialog = () => {
        setStudentDialog(false);
        setSelectedStudent(null);
        setDialogMode("");
    };

    const carrerasTemplate = (rowData) => {
        if (!rowData.Matriculacions || rowData.Matriculacions.length === 0) {
            return <span className="text-neutral-400">Sin carreras</span>;
        }
        return rowData.Matriculacions.map(m => m.Carrera?.nombre).join(", ");
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <button
                    className="
                        bg-navy text-white
                        rounded-lg
                        px-3 py-1.5 sm:px-4 sm:py-2
                        text-sm sm:text-base
                        hover:bg-blue-900 active:bg-blue-950
                        transition
                    "
                    onClick={openNewStudentDialog}
                >
                    New Student +
                </button>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <button
                    className="
                        bg-navy text-white
                        rounded-lg
                        px-3 py-1.5 sm:px-4 sm:py-2
                        text-sm sm:text-base
                        hover:bg-blue-900 active:bg-blue-950
                        transition
                    "
                    //   onClick={exportCSV}
                >
                    Export
                </button>
                <button
                    className="
                        bg-navy text-white
                        rounded-lg
                        px-3 py-1.5 sm:px-4 sm:py-2
                        text-sm sm:text-base
                        hover:bg-blue-900 active:bg-blue-950
                        transition
                    "
                    // onClick={importCSV}
                >
                    Import
                </button>
            </div>
        );
    };

    if (loading && students.length === 0) return <p>Cargando estudiantes...</p>;
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Toolbar
                className="mb-4"
                left={leftToolbarTemplate}
                right={rightToolbarTemplate}
            ></Toolbar>

            <div className="mb-4">
                    <InputText
                        type="search"
                        value={searchValue}
                        onChange={handleSearch}
                        placeholder="Buscar estudiante..."
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
            </div>

            {/* Información de resultados */}
            <div className="mb-4 mt-4 text-sm md:text-base text-neutral-600">
                Mostrando {students.length > 0 ? ((currentPage) * rowsPerPage) + 1 : 0} - {Math.min((currentPage + 1) * rowsPerPage, total)} de {total} estudiantes
            </div>


            <DataTable
                value={students}
                className="p-datatable-sm w-full"
                style={{ minHeight: '400px' }}
                loading={loading}
                lazy
            >
                <Column field="id" header="ID" ></Column>
                <Column field="nombre" header="Nombre" className></Column>
                <Column field="correo" header="Correo" ></Column>
                <Column field="Rol.nombre" header="Rol" ></Column>
                <Column 
                    header="Carreras" 
                    body={carrerasTemplate}
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    body={(rowData) => (
                        <div className="flex gap-4">
                            <Button
                                icon="pi pi-pencil"
                                rounded
                                outlined
                                className="p-button-sm"
                                onClick={() => editStudent(rowData)}
                                title="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                rounded
                                outlined
                                severity="danger"
                                className="p-button-sm"
                                onClick={() => confirmDeleteStudent(rowData)}
                                title="Eliminar"
                            />
                        </div>
                    )}
                    header="Acciones"
                    style={{ width: "20%" }}
                />
            </DataTable>

            {/* Controles de paginación */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 mb-6 px-4">
                    {/* Botón anterior */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
                            currentPage === 0
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-navy text-white hover:bg-blue-900'
                        }`}
                    >
                        ← Anterior
                    </button>

                    {/* Números de página */}
                    <div className="flex gap-1 overflow-x-auto w-full sm:w-auto justify-center pb-2 sm:pb-0">
                        {getPageNumbers().map((pageNum, index) => (
                            pageNum === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 md:px-3 py-2 text-neutral-500 text-sm md:text-base">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageClick(pageNum)}
                                    className={`min-w-[2.5rem] md:w-10 h-9 md:h-10 rounded-lg font-medium text-sm md:text-base flex-shrink-0 ${
                                        currentPage === pageNum - 1
                                            ? 'bg-blue-950 text-white'
                                            : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Botón siguiente */}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
                            currentPage === totalPages - 1
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-navy text-white hover:bg-blue-900'
                        }`}
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            <StudentDialog
                visible={studentDialog}
                onHide={handleCloseDialog}
                mode={dialogMode}
                student={selectedStudent}
                onSave={handleSaveStudent}
            />

                
        </div>
    );
}
