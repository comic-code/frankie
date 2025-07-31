import styled from 'styled-components';

export const FMContainer = styled.div`
  position: relative;
`;

export const FMOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: transparent;
`;

export const FMMenuWrapper = styled.div`
  position: fixed;
  bottom: 64px;
  right: 8px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FMMenuButton = styled.button`
  position: absolute;
  background: #fff;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s, transform 0.3s, pointer-events 0.3s;
  background-color: var(--orange-alt);
`;

export const FMIcon = styled.span`
  font-size: 1.5rem;
`;

export const FMMainButton = styled.button`
  position: relative;
  background: var(--background);
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  transition: background 0.2s;
  border: 2px solid var(--orange-alt);
  &:active {
    background: #444;
  }
`;

export const FMMainIcon = styled.span`
  font-size: 2.2rem;
`