import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardActions, ActionButton, CardContent, InfoRow, InfoLabel, InfoValue, TagBadge, CardFooter} from './styles';
import moment from 'moment';

export default function GuitarStudyCard({ study, onEdit, onDelete, onUpdate }) {
  const [practiceTime, setPracticeTime] = useState(study.practice_time || 0);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const handleStatusChange = (newStatus) => {
    onUpdate({
      id: study.id,
      status: newStatus
    });
  };

  const handlePracticeTimeSave = () => {
    onUpdate({
      id: study.id,
      practice_time: parseInt(practiceTime) || 0
    });
    setIsEditingTime(false);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{study.title}</CardTitle>
        <CardActions>
          <ActionButton onClick={onEdit} title="Editar" style={{ backgroundColor: 'var(--green)' }}>
            ✏️
          </ActionButton>
          <ActionButton onClick={onDelete} title="Excluir" style={{ backgroundColor: 'var(--orange)' }}>
            🗑️
          </ActionButton>
        </CardActions>
      </CardHeader>

      <CardContent>
        <InfoRow>
          <InfoLabel>Categorias:</InfoLabel>
          <InfoValue>
            {study.categories.map((category, index) => (
              <TagBadge key={index} color={category.color}>{category.name}</TagBadge>
            ))}
          </InfoValue>
        </InfoRow>

        {study.obs && (
          <InfoRow>
            <InfoLabel>Observações:</InfoLabel>
            <InfoValue>{study.obs}</InfoValue>
          </InfoRow>
        )}
        <CardFooter>
          <InfoValue>{moment(study.created_date).format('DD/MM/YYYY')}</InfoValue>
          <InfoValue style={{ marginLeft: 8 }}>{study.feeling}</InfoValue>      
          <InfoValue className='practiceTime'>{formatTime(study.practice_time || 0)}</InfoValue>
        </CardFooter>

      </CardContent>
    </Card>
  );
} 