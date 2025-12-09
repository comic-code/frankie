import { useContext } from 'react';

import { GlobalContext } from './GlobalContext';
import Finances from './components/Finances';
import Games from './components/Games';
import Books from './components/Books';
import WhishList from './components/WishList';
import GuitarStudies from './components/GuitarStudies';

export default function RenderController() {
  const { currentSession } = useContext(GlobalContext);
  return (
    <main className='mainContainer'>
      {currentSession === "finances" && <Finances />}
      {currentSession === "games" && <Games />}
      {currentSession === "books" && <Books />}
      {currentSession === "whishList" && <WhishList />}
      {currentSession === "guitar-studies" && <GuitarStudies />}
    </main>
  )
}