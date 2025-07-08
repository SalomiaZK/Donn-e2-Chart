
import './App.css'

import Barchart from "./components/Barchart"
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';

function App() {
  return (
    <div>
      <h1>Tableau de Bord</h1>
      <Barchart />
      <LineChart/>
            <PieChart/>

    </div>
  );
}

export default App;