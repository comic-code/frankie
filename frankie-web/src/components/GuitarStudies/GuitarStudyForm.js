import React, { useState, useEffect } from 'react';
import {FormOverlay, FormContainer, FormTitle, FormGroup, Label, Input, TextArea, Select, MultiSelect,Tag, RemoveTag, AddTagInput, TagInput, AddTagButton, FormActions, PrimaryButton, SecondaryButton } from './styles';

export default function GuitarStudyForm({ study, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Beginner',
    genre: [],
    technique: [],
    notes: ''
  });
  const [newGenre, setNewGenre] = useState('');
  const [newTechnique, setNewTechnique] = useState('');

  useEffect(() => {
    if (study) {
      setFormData({
        id: study.id,
        title: study.title || '',
        difficulty: study.difficulty || 'Beginner',
        genre: study.genre?.map(g => g.name) || [],
        technique: study.technique?.map(t => t.name) || [],
        notes: study.notes || ''
      });
    }
  }, [study]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = (type, value, setValue) => {
    if (value.trim() && !formData[type].includes(value.trim())) {
      handleInputChange(type, [...formData[type], value.trim()]);
      setValue('');
    }
  };

  const removeTag = (type, tagToRemove) => {
    handleInputChange(type, formData[type].filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <FormOverlay>
      <FormContainer>
        <FormTitle>
          {study ? 'Editar Estudo' : 'Novo Estudo de Guitarra'}
        </FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Título *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Solo de Sweet Child O' Mine"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Gêneros</Label>
            <MultiSelect>
              {formData.genre.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <RemoveTag onClick={() => removeTag('genre', tag)}>×</RemoveTag>
                </Tag>
              ))}
            </MultiSelect>
            <AddTagInput>
              <TagInput
                type="text"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Adicionar gênero"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('genre', newGenre, setNewGenre);
                  }
                }}
              />
              <AddTagButton
                type="button"
                onClick={() => addTag('genre', newGenre, setNewGenre)}
              >
                +
              </AddTagButton>
            </AddTagInput>
          </FormGroup>

          <FormGroup>
            <Label>Técnicas</Label>
            <MultiSelect>
              {formData.technique.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <RemoveTag onClick={() => removeTag('technique', tag)}>×</RemoveTag>
                </Tag>
              ))}
            </MultiSelect>
            <AddTagInput>
              <TagInput
                type="text"
                value={newTechnique}
                onChange={(e) => setNewTechnique(e.target.value)}
                placeholder="Adicionar técnica"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('technique', newTechnique, setNewTechnique);
                  }
                }}
              />
              <AddTagButton
                type="button"
                onClick={() => addTag('technique', newTechnique, setNewTechnique)}
              >
                +
              </AddTagButton>
            </AddTagInput>
          </FormGroup>

          <FormGroup>
            <Label>Notas</Label>
            <TextArea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Anotações sobre o estudo, dicas, etc."
            />
          </FormGroup>

          <FormActions>
            <SecondaryButton type="button" onClick={onCancel}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit">
              {study ? 'Atualizar' : 'Criar'}
            </PrimaryButton>
          </FormActions>
        </form>
      </FormContainer>
    </FormOverlay>
  );
} 