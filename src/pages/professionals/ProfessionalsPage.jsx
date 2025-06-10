import React from "react";
import { useEffect, useState } from "react";
import ProfessionalsCard from "../../components/professionalsCard/ProfessionalsCard";
import MainLayout from "../../components/mainLayout/MainLayout";

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetch("api/professionals")
      .then((res) => res.json())
      .then((data) => setProfessionals(data))
      .catch((err) => console.error("Error loading professionals:", err));
  }, []);
  return (
    <MainLayout>
      <div className="p-6 flex flex-col items-center gap-4">
        {professionals.map((prof, index) => (
          <ProfessionalsCard
            key={index}
            nProfesional={prof.nombre}
            description={prof.descripcion}
            location={prof.poblacion}
            actividades={prof.actividades}
            price={prof.precio}
            telefono={prof.telefono}
            email={prof.email}
            web={prof.web}
            redes={prof.redes}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default ProfessionalsPage;
