import { useState } from 'react'
import Note from './components/Note';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDatails';
import Page404 from './components/Page404';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}


function App() {

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Notes/>} />
        <Route path="/note/:id" element={<NoteDetails />} />
        <Route path="*" element={<Page404/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
