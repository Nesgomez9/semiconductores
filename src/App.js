import './App.scss';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Product from './screens/product/Product';

function App() {
  /* aad */
  return (
    <Router>
      <Sidebar />
      <Switch>
        <Route path="/" exact component={Product} />
      </Switch>
    </Router>
  );
}

export default App;
