// src/components/NoteList.tsx
interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  author: {
    email: string;
  };
}

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
}

export default function NoteList({ notes, onDeleteNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have any notes yet.</p>
        <p className="text-sm text-gray-400 mt-1">Create your first note using the form on the right.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
          
          {note.content && (
            <p className="mt-2 text-gray-600">{note.content}</p>
          )}
          
          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            <span>By: {note.author.email}</span>
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}