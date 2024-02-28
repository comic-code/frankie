
import GlobalProvider from './GlobalContext';
import Nav from './components/Nav';
import GlobalStyle from './styles/global';
import RenderController from './RenderController';

function App() {

  return (
    <GlobalProvider>
      <div className="App">
        <GlobalStyle />
        <Nav />
        <RenderController />
      </div>
    </GlobalProvider>
  );
}

export default App;
