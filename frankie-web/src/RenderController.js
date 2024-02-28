import { useContext } from 'react';

import Finances from './components/Finances';
import Games from './components/Games';
import { GlobalContext } from './GlobalContext';

export default function RenderController() {
  const { currentSession } = useContext(GlobalContext);
  return (
    <main className='mainContainer'>
      {currentSession === "finances" && <Finances />}
      {currentSession === "games" && <Games />}
    </main>
  )
}