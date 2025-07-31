
import GlobalProvider from './GlobalContext';
import Nav from './components/Nav';
import GlobalStyle from './styles/global';
import RenderController from './RenderController';
import FloatingMenu from './components/FloatingMenu';

function App() {

  return (
    <GlobalProvider>
      <div className="App">
        <GlobalStyle />
        <Nav />
        <FloatingMenu />
        <RenderController />
      </div>
    </GlobalProvider>
  );
}

export default App;
