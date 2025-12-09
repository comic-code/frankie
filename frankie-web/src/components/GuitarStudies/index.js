import React, { useState, useEffect, useContext } from 'react';
import { getGuitarStudies, saveNewGuitarStudy, updateGuitarStudy, deleteGuitarStudy } from '../../services/frankieNotion';
import { GlobalContext } from '../../GlobalContext';
import GuitarStudyForm from './GuitarStudyForm';
import GuitarStudyCard from './GuitarStudyCard';
import {
  Container,
  Header,
  Title,
  AddButton,
  StudiesGrid,
  EmptyState,
  LoadingSpinner
} from './styles';

export default function GuitarStudies() {
  const { loadingArea, setLoadingArea } = useContext(GlobalContext);
  const [studies, setStudies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    setLoadingArea('guitar-studies');
    try {
      const data = await getGuitarStudies();
      setStudies(data);
      console.log(data);
    } catch (error) {
      console.error('Error loading guitar studies:', error);
    } finally {
      setLoadingArea(null);
    }
  };

  const handleAddStudy = async (studyData) => {
    setLoadingArea('guitar-studies');
    try {
      const newStudy = await saveNewGuitarStudy(studyData);
      setStudies(prev => [...prev, newStudy]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding guitar study:', error);
    } finally {
      setLoadingArea(null);
    }
  };

  const handleUpdateStudy = async (studyData) => {
    setLoadingArea('guitar-studies');
    try {
      await updateGuitarStudy(studyData);
      setStudies(prev => prev.map(study => 
        study.id === studyData.id ? { ...study, ...studyData } : study
      ));
      setEditingStudy(null);
    } catch (error) {
      console.error('Error updating guitar study:', error);
    } finally {
      setLoadingArea(null);
    }
  };

  const handleDeleteStudy = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este estudo?')) {
      setLoadingArea('guitar-studies');
      try {
        await deleteGuitarStudy(id);
        setStudies(prev => prev.filter(study => study.id !== id));
      } catch (error) {
        console.error('Error deleting guitar study:', error);
      } finally {
        setLoadingArea(null);
      }
    }
  };

  const handleEditStudy = (study) => {
    setEditingStudy(study);
    setShowForm(true);
  };

  const filteredStudies = studies.filter(study => {
    if (filter === 'all') return true;
    return study.status === filter;
  });

  return (
    <Container>
      <Header>
        <Title>Guitarra</Title>
        <button className="new" onClick={() => setShowForm(true)}>
          Nova Sessão
        </button>
      </Header>

      {showForm && (
        <GuitarStudyForm
          study={editingStudy}
          onSubmit={editingStudy ? handleUpdateStudy : handleAddStudy}
          onCancel={() => {
            setShowForm(false);
            setEditingStudy(null);
          }}
        />
      )}

          <StudiesGrid>
          {filteredStudies.map(study => (
            <GuitarStudyCard
              key={study.id}
              study={study}
              onEdit={() => handleEditStudy(study)}
              onDelete={() => handleDeleteStudy(study.id)}
              onUpdate={handleUpdateStudy}
            />
          ))}
        </StudiesGrid>
    </Container>
  );
} 