import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNote, getAllNotes, NoteType } from '../../services/notes';
import Swal from 'sweetalert2';

interface OptionsProps {
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  id: number;
}

const Options: React.FC<OptionsProps> = ({ setShowOptions, id, setNotes }) => {
  const optionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleNoteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/note/${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowOptions]);

  const onDeleteNote = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    Swal.fire({
      title: "¿Estas seguro de borrar la nota?",
      text: "Una vez eliminado no podras recuperarla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No, por favor',
      confirmButtonText: "Si, estoy seguro"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const confirmationDelete = await deleteNote(id); // Llama a la función de eliminación
          const notesData: NoteType[] = await getAllNotes(); // Obtén la lista actualizada de notas
          setNotes(notesData); // Actualiza el estado de notas
          if(confirmationDelete!== 404){
            Swal.fire({
              title: "Borrado",
              text: "La nota fue eliminada",
              icon: "success"
            });
          }else{
            Swal.fire({
              title: "Error!",
              text: "No se encontro el recurso a borrar",
              icon: "error"
            });
          }
          
        } catch (error) {
          console.error('Error deleting note:', error);
          Swal.fire({
            title: "Error!",
            text: "Problemas de conexiòn",
            icon: "error"
          });
        }
      }
    });
  };

  return (
    <div
      ref={optionsRef}
      className='absolute right-0 w-24 text-white bg-black bottom-2'
    >
      <div
        className='w-full pl-3 hover:bg-slate-900 hover:cursor-pointer'
        onClick={handleNoteClick}
      >
        <p>Abrir</p>
      </div>
      <div
        className='w-full pl-3 hover:bg-slate-900 hover:cursor-pointer'
        onClick={onDeleteNote} // Llama a la función de eliminación
      >
        <p>Eliminar</p>
      </div>
    </div>
  );
};

export default Options;
