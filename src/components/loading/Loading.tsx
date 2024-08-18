import React from "react";

import "./style.css";

// Componente de Carga
const Loading: React.FC = () => {
  return (
    <div className="overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
