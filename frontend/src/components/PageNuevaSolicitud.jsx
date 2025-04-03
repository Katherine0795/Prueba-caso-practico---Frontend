import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PageNuevaSolicitud = () => {
  const [marca, setMarca] = useState("");
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [fechaEnvio, setFechaEnvio] = useState("");
  const [contactos, setContactos] = useState([]);
  const [numeroContacto, setNumeroContacto] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaSolicitud = { 
      marca, 
      tipoSolicitud, 
      fechaEnvio, 
      contactos 
    };
    console.log('datos enviados: ',JSON.stringify(nuevaSolicitud));
    fetch("http://localhost:8090/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaSolicitud),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Solicitud creada con éxito");
        navigate("/");
      })
      .catch((error) => console.error("Error al crear solicitud:", error));
  };

  const agregarContacto = () => {
    const nuevoContacto = { numeroContacto, nombreContacto };
    setContactos([...contactos, nuevoContacto]);
    setNumeroContacto("");
    setNombreContacto("");
  };

  const eliminarContacto = (index) => {
    const nuevosContactos = contactos.filter((_, i) => i !== index);
    setContactos(nuevosContactos);
  };

  return (
    <div className="flex space-x-10 p-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">Crear Nueva Solicitud</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Marca:</label>
            <input 
              type="text" 
              value={marca} 
              onChange={(e) => setMarca(e.target.value)} 
              required 
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo de Solicitud:</label>
            <input 
              type="text" 
              value={tipoSolicitud} 
              onChange={(e) => setTipoSolicitud(e.target.value)} 
              required 
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Envío:</label>
            <input 
              type="date" 
              value={fechaEnvio} 
              onChange={(e) => setFechaEnvio(e.target.value)} 
              required 
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar Solicitud
          </button>
        </form>

        <button 
          onClick={() => navigate("/")} 
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-black rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>

      <div className="w-1/2 border-l pl-8">
        <h3 className="text-2xl font-bold mb-6">Contactos</h3>
        <div className="space-y-4 mb-4">
          <div>
            <input 
              type="number" 
              placeholder="Número de Contacto" 
              value={numeroContacto} 
              onChange={(e) => setNumeroContacto(e.target.value)} 
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Nombre de Contacto" 
              value={nombreContacto} 
              onChange={(e) => setNombreContacto(e.target.value)} 
              className="p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button 
            onClick={agregarContacto} 
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Agregar Contacto
          </button>
        </div>

        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Número de Contacto</th>
              <th className="px-4 py-2 text-left border-b">Nombre de Contacto</th>
              <th className="px-4 py-2 text-left border-b">Acción</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{contacto.numeroContacto}</td>
                <td className="px-4 py-2 border-b">{contacto.nombreContacto}</td>
                <td className="px-4 py-2 border-b">
                  <button 
                    onClick={() => eliminarContacto(index)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageNuevaSolicitud;
