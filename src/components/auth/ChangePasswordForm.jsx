import React, { useState } from "react";
import { Password } from "primereact/password";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../../hooks/useAuth";

const ChangePasswordForm = ({ 
  isFirstLogin = false, 
  onSuccess, 
  onCancel,
  userName = "Usuario" 
}) => {
  const { user, createPassword, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar la fortaleza de la contraseña
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!hasUpperCase) {
      return "Debe contener al menos una letra mayúscula";
    }
    if (!hasLowerCase) {
      return "Debe contener al menos una letra minúscula";
    }
    if (!hasNumber) {
      return "Debe contener al menos un número";
    }
    if (!hasSpecialChar) {
      return "Debe contener al menos un carácter especial";
    }
    return null;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar contraseña actual (solo si no es primer login)
    if (!isFirstLogin && !formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }

    // Validar nueva contraseña
    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (!isFirstLogin && formData.currentPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isFirstLogin) {
        // Usar el endpoint de crear contraseña para primer login
        await createPassword(user?.correo, formData.newPassword);
      } else {
        // Usar el endpoint de cambiar contraseña para usuarios activos
        await changePassword(formData.currentPassword, formData.newPassword);
      }

      // Limpiar formulario
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Mostrar mensaje de éxito
      alert(
        isFirstLogin
          ? "Contraseña creada exitosamente, por favor inicia sesión nuevamente"
          : "Contraseña cambiada exitosamente"
      );

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = "Error al cambiar la contraseña. Por favor, intenta de nuevo.";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Datos inválidos. Verifica tu contraseña.";
            break;
          case 401:
            errorMessage = "Contraseña actual incorrecta.";
            break;
          case 404:
            errorMessage = "Usuario no encontrado.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmSubmit = () => {
    if (!validateForm()) {
      return;
    }

    confirmDialog({
      message: "¿Estás seguro de que deseas cambiar tu contraseña?",
      header: "Confirmar Cambio de Contraseña",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, cambiar",
      rejectLabel: "Cancelar",
      accept: handleSubmit,
    });
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-lg">
      <ConfirmDialog
        pt={{
          root: { className: "bg-white rounded-lg shadow-xl border border-gray-200" },
          header: { className: "bg-navy text-white px-6 py-4 rounded-t-lg" },
          content: { className: "px-6 py-4 text-gray-700" },
          footer: { className: "px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3 justify-end" },
          acceptButton: {
            className: "bg-navy hover:bg-dark-navy text-white px-6 py-2 rounded-md transition-colors font-medium shadow-md",
          },
          rejectButton: {
            className: "bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-colors font-medium",
          },
          icon: { className: "text-navy text-3xl mr-3" },
        }}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-5xl font-extrabold text-navy mb-2">
          Poli<span className="text-neutral-900">Rank</span>
          <span className="text-xl text-neutral-700 ml-2">Beta</span>
        </h1>
        {isFirstLogin && (
          <div className="bg-blue-50 border-l-4 border-navy p-4 mb-4 rounded">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-navy mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-navy">
                  Primer inicio de sesión
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Por seguridad, debes cambiar tu contraseña antes de continuar.
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-800">
          {isFirstLogin ? "Cambiar Contraseña" : "Actualizar Contraseña"}
        </h2>
        <p className="text-gray-600 mt-1">
          Hola, {userName}. {isFirstLogin ? "Establece" : "Cambia"} tu contraseña de acceso.
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        {/* Contraseña actual (solo si no es primer login) */}
        {!isFirstLogin && (
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Contraseña Actual
            </label>
            <Password
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              feedback={false}
              toggleMask
              placeholder="Ingresa tu contraseña actual"
              className="w-full"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy focus:border-navy"
              pt={{
                input: {
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md",
                },
              }}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>
        )}

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Nueva Contraseña
          </label>
          <Password
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            toggleMask
            placeholder="Ingresa tu nueva contraseña"
            className="w-full"
            promptLabel="Ingresa una contraseña"
            weakLabel="Débil"
            mediumLabel="Media"
            strongLabel="Fuerte"
            feedback={true}
            pt={{
              input: {
                className: "w-full px-3 py-2 border border-gray-300 rounded-md",
              },
              panel: {
                className: "hidden"
              }
            }}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
          )}
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p className="font-semibold">La contraseña debe contener:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Al menos 8 caracteres</li>
              <li>Una letra mayúscula</li>
              <li>Una letra minúscula</li>
              <li>Un número</li>
              <li>Un carácter especial (!@#$%^&*...)</li>
            </ul>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Confirmar Nueva Contraseña
          </label>
          <Password
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            feedback={false}
            toggleMask
            placeholder="Confirma tu nueva contraseña"
            className="w-full"
            pt={{
              input: {
                className: "w-full px-3 py-2 border border-gray-300 rounded-md",
              },
            }}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        {!isFirstLogin && onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          onClick={confirmSubmit}
          disabled={loading}
          className={`${!isFirstLogin && onCancel ? "flex-1" : "w-full"} bg-navy hover:bg-dark-navy text-white px-4 py-2 rounded-md transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;