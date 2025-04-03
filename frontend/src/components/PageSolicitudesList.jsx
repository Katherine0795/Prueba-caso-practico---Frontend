import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PageSolicitudesList = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterFecha, setFilterFecha] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "idSolicitud", direction: "asc" });

  const handleList = () => {
    fetch("http://localhost:8090/solicitudes")
      .then((response) => response.json())
      .then((data) => {
        setSolicitudes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las solicitudes:", error);
        setLoading(false);
      });
  };

  const exportCSV = () => {
    fetch("http://localhost:8090/solicitudes/exportar")
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "solicitudes.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error al exportar las solicitudes a CSV:", error));
  };

  const handleOpenModal = (solicitudId) => {
    const solicitud = solicitudes.find((sol) => sol.idSolicitud === solicitudId);
    setSelectedSolicitud(solicitud);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSolicitud(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSolicitudes = [...solicitudes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredSolicitudes = sortedSolicitudes.filter((solicitud) => {
    const matchesFecha = filterFecha ? solicitud.fechaEnvio.includes(filterFecha) : true;
    const matchesTipo = filterTipo ? solicitud.tipoSolicitud.includes(filterTipo) : true;
    return matchesFecha && matchesTipo;
  });

  useEffect(() => {
    handleList();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Lista de Solicitudes</h2>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="filterFecha" className="block font-semibold text-lg mb-2">Filtro por Fecha</label>
          <input
            type="date"
            id="filterFecha"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="filterTipo" className="block font-semibold text-lg mb-2">Filtro por Tipo de Solicitud</label>
          <input
            type="text"
            id="filterTipo"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="p-2 border rounded"
            placeholder="Buscar por tipo..."
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <Link to="/nuevo">
          <button className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600">
            Crear Nueva Solicitud
          </button>
        </Link>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Exportar a CSV
        </button>
      </div>

      {loading ? (
        <p className="text-lg text-gray-700">Cargando...</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("idSolicitud")}>
                  ID {sortConfig.key === "idSolicitud" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("marca")}>
                  Marca {sortConfig.key === "marca" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("tipoSolicitud")}>
                  Tipo de Solicitud {sortConfig.key === "tipoSolicitud" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("fechaEnvio")}>
                  Fecha de Envío {sortConfig.key === "fechaEnvio" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.map((solicitud, index) => (
                <tr
                  key={solicitud.idSolicitud}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition duration-200`}
                >
                  <td className="p-3 border">
                    <button
                      onClick={() => handleOpenModal(solicitud.idSolicitud)}
                      className="text-blue-600 hover:underline"
                    >
                      {solicitud.idSolicitud}
                    </button>
                  </td>
                  <td className="p-3 border">{solicitud.marca}</td>
                  <td className="p-3 border">{solicitud.tipoSolicitud}</td>
                  <td className="p-3 border">{solicitud.fechaEnvio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && selectedSolicitud && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Detalle de Solicitud</h3>
            <div className="mb-4">
              <strong>ID Solicitud:</strong> {selectedSolicitud.idSolicitud}
            </div>
            <div className="mb-4">
              <strong>Marca:</strong> {selectedSolicitud.marca}
            </div>
            <div className="mb-4">
              <strong>Tipo de Solicitud:</strong> {selectedSolicitud.tipoSolicitud}
            </div>
            <div className="mb-4">
              <strong>Fecha de Envío:</strong> {selectedSolicitud.fechaEnvio}
            </div>
            <h4 className="text-xl font-semibold mb-2">Contactos:</h4>
            <ul>
              {selectedSolicitud.contactos.map((contacto) => (
                <li key={contacto.idContacto}>
                  <div>
                    <strong>Nombre:</strong> {contacto.nombreContacto}
                  </div>
                  <div>
                    <strong>Contacto:</strong> {contacto.numeroContacto}
                  </div>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSolicitudesList;
