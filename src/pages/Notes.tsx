import React, { useEffect, useState, ChangeEvent } from 'react';
import addIcon from '../assets/icons/mas.png';
import Note from '../components/Note';
import SkeletonNote from '../components/SkeletoneNote'; // Importa el componente Skeleton
import { useNavigate } from 'react-router-dom';
import { getAllNotes } from '../services/notes'; // Verifica que la ruta y la extensión sean correctas

// Define una interfaz para la nota
interface NoteType {
  id: number;
  title: string;
}

// Define el componente Title
const Title = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const navigate = useNavigate();

  // Maneja el cambio en el input de búsqueda
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between w-2/4 h-16 m-6 mx-auto bg-transparent shadow-lg">
      <div onClick={() => navigate('/note/new')} className='w-12 h-12 ml-8 hover:cursor-pointer'>
        <img src={addIcon} alt="add" />
      </div>
      <input
        type="search"
        className='w-2/3 h-12 p-4 rounded-full outline-none'
        placeholder='Buscar notas...'
        onChange={handleSearchChange}
      />
      <p className='mr-8 text-4xl font-medium text-black'>Notas</p>
    </div>
  );
};

// Define el componente Notes
const Notes: React.FC = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesData: NoteType[] = await getAllNotes();
        setNotes(notesData); // Actualiza el estado con los datos obtenidos
        setFilteredNotes(notesData); // Inicializa los filtros con todas las notas
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false); // Asegúrate de cambiar el estado de carga al finalizar la solicitud
      }
    };

    fetchNotes();
  }, []); // Dependencias vacías para ejecutar solo al montar el componente

  // Filtra las notas basadas en el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter(note =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, notes]);

  return (
    <>
      <Title onSearch={setSearchTerm} />
      <div className="notes-container">
        {loading ? (
          // Muestra el esqueleto mientras los datos se están cargando
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <SkeletonNote key={index} />
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <Note key={note.id} title={note.title} id={note.id} setNotes={setNotes} />
          ))
        ) : (
          <div className='grid w-full place-items-center'>
            <p>No hay notas disponibles.</p>
          </div>
          
        )}
      </div>
    </>
  );
};

export default Notes;

