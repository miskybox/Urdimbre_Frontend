import React from "react";
import ProfessionalsCard from "../../components/professionalsCard/ProfessionalsCard";
import MainLayout from "../../components/mainLayout/MainLayout";

const ProfessionalsPage = () => {
  return (
    <MainLayout>
      <div className="p-6 flex flex-col items-center">
        <ProfessionalsCard
          image="https://randomuser.me/api/portraits/women/44.jpg"
          nProfesional="Lucía Martín"
          description="Psicóloga especializada en trauma y acompañamiento LGBTQIA+."
          location="El Prat de Llobregat"
          price="50"
        />
      </div>
    </MainLayout>
  );
};

export default ProfessionalsPage;
