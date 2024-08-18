import { useNavigate, useParams } from "react-router-dom";
import saveIcon from "../assets/icons/guardar-instagram.png";
import backIcon from "../assets/icons/volver.png";
import { useEffect, useState } from "react";
import { createNote, updateNote } from "../services/notes";
import Loading from "../components/loading/Loading";
import Swal from "sweetalert2";

function NoteDetails() {
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Sin Titulo");
  const [load, setLoad] = useState(false);
  const [initialContent, setInitialContent] = useState(content);
  const navigate = useNavigate();

  useEffect(() => {
    // Si el id es 'new', no se necesita cargar ninguna nota
    if (id === "new") return;

    const fetchNote = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContent(data.note.content);
        setTitle(data.note.title);
        setInitialContent(data.note.content);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error al cargar la nota",
          showConfirmButton: false,
          timer: 1500
        });
      }
    };

    fetchNote();
  }, [id]); // Dependencia agregada para que se ejecute cuando `id` cambie

  const onResetTitle = () => {
    if (title === "") {
      setTitle("Sin Titulo");
    }
  };

  const onSaveNote = async () => {
    if(title === 'Sin Titulo'){
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Ingrese un titulo",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    setLoad(true);
    try {
      if (id === "new") {
        const idConfirmationCreate = await createNote({
          title,
          content,
        });

        if (idConfirmationCreate !== undefined) {
          navigate(`/note/${idConfirmationCreate}`);
        }
      } else if (id) {
        const numericId: number = parseInt(id, 10);
        await updateNote(numericId, {
          title,
          content,
        });
        setInitialContent('update')
      } else {
        console.error("ID no está definido");
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "ID no definido",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoad(false); // Asegúrate de desactivar el estado de carga sin importar el resultado
    }
  };

  const onBack = () => {
    if (content === initialContent) {
      navigate(`/`);
    } else {
      if(initialContent === 'update'){ 
        navigate(`/`)
        return;
      };
      Swal.fire({
        title: "¿Deseas guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No guardar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await onSaveNote();
            navigate(`/`);
          } catch (error) {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error inesperado al guardar la nota",
              showConfirmButton: false,
              timer: 1500
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Cambios no guardados", "", "info");
          navigate(`/`);
        }
      });
    }
  };

  return (
    <>
      {load && <Loading />}
      <div className="flex items-center justify-between w-2/4 h-16 m-6 mx-auto bg-transparent shadow-md">
        <div
          onClick={onBack}
          className="w-12 h-12 ml-8 hover:cursor-pointer"
        >
          <img src={backIcon} alt="back" />
        </div>
        <input
          onBlur={onResetTitle}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-3/5 text-4xl text-center bg-transparent outline-none"
        />
        <div
          onClick={onSaveNote}
          className="w-12 h-12 mr-8 hover:cursor-pointer"
        >
          <img src={saveIcon} alt="save" />
        </div>
      </div>
      <div className="grid w-full place-items-center">
        <textarea
          value={content}
          autoComplete="off"
          onChange={(e) => setContent(e.target.value)}
          className="w-2/4 p-5 bg-yellow-100 outline-none resize-none h-96"
          name="content"
        ></textarea>
      </div>
    </>
  );
}

export default NoteDetails;
