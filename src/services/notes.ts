// services/notes.ts

import Swal from "sweetalert2";

export interface NoteType {
    id: number;
    title: string;
}

export const getAllNotes = async (): Promise<NoteType[]> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.result; // Asegúrate de que 'data.result' es del tipo NoteType[]
    } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error aquí o lanzar el error para que sea manejado por el componente
        throw error; // Lanza el error para que pueda ser capturado en el componente que llama a esta función
    }
};


export const deleteNote = async (id: number) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return 404;
        }

        // Confirmación en consola, opcional
        console.log(`Nota con ID ${id} eliminada con éxito.`);
    } catch (error) {
        console.error('Error deleting resource:', error);
        // Aquí puedes manejar el error de manera más adecuada, como mostrar una notificación al usuario
    }
};

// services/notes.ts

interface UpdateNotePayload {
    title: string;
    content: string;
}

export const updateNote = async (id: number, payload: UpdateNotePayload): Promise<void> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = 'Error interno del servidor';
            
            switch (response.status) {
                case 400:
                    errorMessage = 'Solicitud incorrecta. Asegúrate de que todos los campos estén completos.';
                    break;
                case 404:
                    errorMessage = 'Nota no encontrada. Verifica el ID e inténtalo de nuevo.';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
                    break;
                default:
                    errorMessage = `Error: ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        // Mensaje de éxito
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Nota actualizada",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        // Mensaje de error
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

        console.error('Error updating note:', error);
    }
};


interface CreateNotePayload {
    title: string;
    content: string;
}

export const createNote = async (payload: CreateNotePayload): Promise<any> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Extraer datos de error si los hay
            const errorData = await response.json();
            const errorMessage = errorData.message || response.statusText;
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        // Extraer y retornar los datos del response
        const data = await response.json();
        
        // Mensaje de éxito
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Nota guardada",
            showConfirmButton: false,
            timer: 1500
        });
        return data.result.id;
    } catch (error) {
        let errorMessage = 'No se pudo guardar la nota. Error interno.';

        if (error instanceof Error) {
            console.error('Error creating note:', error.message);

            if (error.message.includes('Bad Request')) {
                errorMessage = 'Todos los datos son requeridos.';
            } else if (error.message.includes('Error')) {
                errorMessage = error.message;
            }
        } else {
            console.error('Unexpected error creating note:', error);
            errorMessage = 'Error inesperado al guardar la nota';
        }

        Swal.fire({
            position: "top-end",
            icon: "error",
            title: errorMessage,
            showConfirmButton: false,
            timer: 1500
        });

        // Retornar un valor nulo o indefinido si ocurre un error
        return null;
    }
};
