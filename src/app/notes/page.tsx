// src/app/notes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import NoteList from '../../components/NoteList';
import CreateNoteForm from '../../components/CreateNoteForm';
import UpgradeBanner from '../../components/UpgradeBanner';

interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  author: {
    email: string;
  };
}

export default function NotesPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchNotes();
    }
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setShowUpgradeBanner(false);
        return true;
      } else {
        const errorData = await response.json();
        
        if (errorData.limitReached) {
          setShowUpgradeBanner(true);
        }
        
        console.error('Failed to create note:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Error creating note:', error);
      return false;
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`/api/tenants/${user.tenantId}/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShowUpgradeBanner(false);
        alert('Subscription upgraded to Pro successfully!');
      } else {
        console.error('Failed to upgrade subscription');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">SaaS Notes App</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user.email} ({user.role})
            </p>
            <p className="text-xs text-gray-500">Tenant: {user.tenantId}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showUpgradeBanner && user.role === 'Admin' && (
          <UpgradeBanner onUpgrade={handleUpgrade} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Notes</h2>
              
              {isLoadingNotes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <NoteList 
                  notes={notes} 
                  onDeleteNote={handleDeleteNote} 
                />
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Note</h2>
              <CreateNoteForm onCreateNote={handleCreateNote} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}