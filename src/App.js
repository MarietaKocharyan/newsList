import StoreProvider from './store/StoreProvider';
import NewsPage from './pages/News';

function App() {
  return (
    <StoreProvider>
        <NewsPage />
    </StoreProvider>
  );
}

export default App;
