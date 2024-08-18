import React, { useState } from 'react';
import optionsIcon from '../assets/icons/puntos.png';
import { useNavigate } from 'react-router-dom';
import Options from '../pages/notes/Options'; // Asegúrate de que la ruta sea correcta
import { NoteType } from '../services/notes';

interface NoteProps {
  setNotes:React.Dispatch<React.SetStateAction<NoteType[]>>
  title: string,
  id: number
}

const Note: React.FC<NoteProps> = ({ title, id, setNotes}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNoteClick = (id: number) => {
    navigate(`/note/${id}`);
  };

  const onOptions = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Para evitar que el clic en el icono de opciones cierre el menú
    setShowOptions(prev => !prev);
  };

  return (
    <div
      onClick={() => handleNoteClick(id)}
      className="relative flex items-center justify-between w-2/4 h-16 m-6 mx-auto bg-yellow-100 hover:cursor-pointer"
    >
      <p className="ml-8 text-2xl">{title}</p>
      <div className="w-5 h-5 mr-8 hover:cursor-pointer" onClick={onOptions}>
        <img src={optionsIcon} alt="opciones" />
      </div>
      {showOptions && <Options setShowOptions={setShowOptions} id={id} setNotes={setNotes}/>}
    </div>
  );
};

export default Note;
