import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--black-alt);
  border-radius: 0.5rem;
  border: 2px solid var(--black-alt);

  button {
    background-color: var(--green);
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid var(--background);
  
    &.new {
      margin-left: auto;
      animation: fade 0.5s ease 0s 1 normal forwards;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

export const Title = styled.h1`
  color: #fff;
  border-left: 2px solid var(--background);
  padding-left: 0.3rem;
  margin-bottom: 0.5rem;
`;

export const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

export const StudiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
`;

// Form styles
export const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const FormTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const MultiSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const Tag = styled.span`
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RemoveTag = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: #dc3545;
  }
`;

export const AddTagInput = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const TagInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

export const AddTagButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #218838;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
`;

export const PrimaryButton = styled(Button)`
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
  }
`;

export const SecondaryButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #545b62;
  }
`;

// Card styles
export const Card = styled.div`
  width: 800px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  flex: 1;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const CardContent = styled.div`
  margin-bottom: 15px;
`;

export const InfoRow = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

export const CardFooter = styled.footer`
  background-color: #fff;
  display: flex;
  position: absolute;
  bottom: 4px;
  right: 4px;
`;

export const InfoLabel = styled.span`
  font-weight: 500;
  color: #666;
`;

export const InfoValue = styled.span`
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;

  &.practiceTime {
    background-color: var(--yellow-alt);
    border: 2px solid #000;
    margin-left: 4px;
  }
`;

export const TagBadge = styled.span`
  background: ${props => props.color || '#e9ecef'};
  color: #fff;
  padding: 2px 4px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 4px;
  border: 2px solid #000;
  font-weight: 900;
`;