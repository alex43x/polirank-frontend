import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from 'primereact/multiselect';

export default function StudentDialog({ 
    visible, 
    onHide, 
    mode = "", // "create", "edit"
    student = {},
    onSave = () => {}
}) {
    const roles = [
        { id: 1, nombre: "ADMIN" },
        { id: 2, nombre: "STUDENT" },
        { id: 3, nombre: "GUEST" },
        { id: 4, nombre: "STUDENT" }
    ];

    const carreras = [
            {
                id: 1,
                nombre: "IIN",
            },
            {
                id: 2,
                nombre: "LCIK",
            },
            {
                id: 6,
                nombre: "IEK",
            },
            {
                id: 7,
                nombre: "ISP",
            },
            {
                id: 8,
                nombre: "IMK",
            },
            {
                id: 9,
                nombre: "IEL",
            },  
            {
                id: 10,
                nombre: "IEN",
            },
            {
                id: 11,
                nombre: "ICM",
            },
            {
                id: 12,
                nombre: "IAE",
            },
            {
                id: 13,
                nombre: "LCA",
            },
            {
                id: 14,
                nombre: "LEL",
            },
            {
                id: 15,
                nombre: "LCI",
            },
            {
                id: 16,
                nombre: "LGH",
            }
    ];

    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        rol: null,
        carreras: []
    });

    const [errors, setErrors] = useState({});

    // Cargar datos del estudiante cuando cambia
    useEffect(() => {
        if (student && mode !== "create") {
            const rolObj = student.Rol ? roles.find(r => r.id === student.Rol.id) || { id: student.Rol.id, nombre: student.Rol.nombre } : null;
            setFormData({
                nombre: student.nombre || "",
                correo: student.correo || "",
                rol: rolObj,
                carreras: student.Matriculacions?.map(m => m.Carrera) || []
            });
        } else if (mode === "create") {
            setFormData({
                nombre: "",
                correo: "",
                password: "",
                rol: null,
                carreras: []
            });
        }
        setErrors({});
    }, [student, mode, visible]);

    const isCreate = mode === "create";

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es requerido";
        }
        if (!formData.correo.trim()) {
            newErrors.correo = "El correo es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = "El correo no es válido";
        }
        
        if (isCreate) {
            if (!formData.password.trim()) {
                newErrors.password = "La contraseña es requerida";
            }
            if (!formData.rol) {
                newErrors.rol = "El rol es requerido";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            let dataToSend = {};
            
            if (isCreate) {
                // Para crear: enviar nombre, correo, password, rol, matriculaciones
                dataToSend = {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    password: formData.password,
                    rol: formData.rol.id,
                    carreras: formData.carreras.map(m => m.id)
                };
            } else {
                // Para editar: enviar todos excepto password
                dataToSend = {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    rol: formData.rol ? formData.rol.id : null,
                    carreras: formData.carreras.map(m => m.id)
                };
            }
            
            onSave(dataToSend);
            onHide();
        }
    };

    const getTitle = () => {
        switch (mode) {
            case "create":
                return "Crear Nuevo Estudiante";
            case "edit":
                return "Editar Estudiante";
            default:
                return "";
        }
    };

    const getFooter = () => {
        return (
            <div className="flex gap-2 justify-end">
                <Button
                    label="Cancelar"
                    onClick={onHide}
                    className="p-button-secondary"
                />
                <Button
                    label={isCreate ? "Crear" : "Guardar"}
                    onClick={handleSave}
                    className="p-button-primary"
                />
            </div>
        );
    };

    return (
        <Dialog
            visible={visible}
            style={{ width: "95vw", maxWidth: "700px", maxHeight: "90vh" }}
            onHide={onHide}
            dismissableMask={true}
            modal={true}
            header={getTitle()}
            footer={getFooter()}
            contentClassName="p-0 overflow-y-auto"
            maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            pt={{
                root: { className: "rounded-lg" },
                header: {
                    className: "bg-navy text-white px-6 py-4 rounded-t-lg text-2xl font-medium",
                },
                content: { className: "p-0 overflow-y-auto" },
                closeButton: {
                    className: "text-white hover:bg-dark-navy rounded-md transition-colors",
                },
                footer: {
                    className: "bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-2"
                }
            }}
        >
            <div className="p-6 bg-white">
                {/* Campo Nombre */}
                <div className="field mb-4">
                    <label htmlFor="nombre" className="block mb-2 font-medium text-gray-700">
                        Nombre
                    </label>
                    <InputText
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        type="text"
                        className={`w-full ${errors.nombre ? "p-invalid" : ""}`}
                        placeholder={"Ingrese el nombre"}
                    />
                    {errors.nombre && (
                        <small className="p-error block mt-1">{errors.nombre}</small>
                    )}
                </div>

                {/* Campo Correo */}
                <div className="field mb-4">
                    <label htmlFor="correo" className="block mb-2 font-medium text-gray-700">
                        Correo
                    </label>
                    <InputText
                        id="correo"
                        value={formData.correo}
                        onChange={(e) => handleChange("correo", e.target.value)}
                        type="email"
                        className={`w-full ${errors.correo ? "p-invalid" : ""}`}
                        placeholder={"Ingrese el correo"}
                    />
                    {errors.correo && (
                        <small className="p-error block mt-1">{errors.correo}</small>
                    )}
                </div>

                {/* Campo Contraseña - solo para crear */}
                {isCreate && (
                    <div className="field mb-4">
                        <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                            Contraseña
                        </label>
                        <InputText
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            type="password"
                            className={`w-full ${errors.password ? "p-invalid" : ""}`}
                            placeholder={"Ingrese la contraseña"}
                        />
                        {errors.password && (
                            <small className="p-error block mt-1">{errors.password}</small>
                        )}
                    </div>
                )}

                {/* Campo Rol */}
                <div className="field mb-4">
                    <label htmlFor="rol" className="block mb-2 font-medium text-gray-700">
                        Rol
                    </label>
                        <Dropdown
                            id="rol"
                            value={formData.rol}
                            onChange={(e) => handleChange("rol", e.value)}
                            options={roles}
                            optionLabel="nombre"
                            placeholder="Seleccionar rol"
                            className="w-full border rounded-md border-[#e0e0e0] font-medium bg-neutral-50 pr-2"
                            pt={{
                                input: {
                                className: "py-2 px-3 bg-neutral-50 text-neutral-500 rounded-md",
                                },
                                panel: {
                                className:
                                    "bg-neutral-50 border border-[#e0e0e0] text-neutral-600  rounded-md",
                                },
                                item: {
                                className: "text-neutral-900 hover:bg-blue-200 p-2",
                                },
                            }}
                        />
                    {errors.rol && (
                        <small className="p-error block mt-1">{errors.rol}</small>
                    )}
                </div>

                {/* Campo Carrera */}
                <div className="field mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="carreras" className="block font-medium text-gray-700">
                            Carreras
                        </label>
                        {formData.carreras.length > 0 && (
                            <button
                                type="button"
                                onClick={() => handleChange("carreras", [])}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Limpiar carreras
                            </button>
                        )}
                    </div>
                    <MultiSelect   
                        id="carreras"
                        value={formData.carreras}
                        options={carreras}
                        optionLabel="nombre" 
                        onChange={(e) => handleChange("carreras", e.value)}
                        placeholder="Seleccionar carreras"
                        className="w-full"
                        panelClassName="custom-multiselect-panel"
                        pt={{
                            root: {
                            className: "bg-neutral-50 border border-[#e0e0e0] rounded-md w-full"
                        },
                        labelContainer: {
                            className: "py-2 px-3"
                        },
                        label: {
                            className: "text-neutral-500 font-medium"
                        },
                        trigger: {
                            className: "text-neutral-600 pr-2"
                        },
                        panel: {
                            className: "bg-neutral-50 border border-[#e0e0e0] text-neutral-600 rounded-md mt-1"
                        },
                        header: {
                            display: "none"
                        },
                        item: ({ context }) => {
                            const option = context.option;
                            const isSelected = option && formData.carreras.some(c => c.id === option.id);
                            return {
                                className: `p-3 cursor-pointer transition-colors ${
                                    isSelected
                                        ? 'bg-blue-50 text-blue-900 font-medium' 
                                        : 'hover:bg-neutral-100'
                                }`
                            };
                        },
                        checkboxContainer: {
                            className: "hidden"
                        }
                        }}
                    />
                    {formData.carreras.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Carreras seleccionadas:</p>
                            <div className="flex flex-wrap gap-2">
                                {formData.carreras.map(carrera => (
                                    <div
                                        key={carrera.id}
                                        className="flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{carrera.nombre}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleChange("carreras", formData.carreras.filter(c => c.id !== carrera.id))}
                                            className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                                            title="Eliminar carrera"
                                        >
                                            <span className="text-blue-900 font-bold">×</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
