
import './App.css'
import AreaChart from './components/AreaChart';

import Barchart from "./components/Barchart"
import LineChart from './components/LineChart';
import NavBar from './components/NavBar';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import LineChartPressure from './components/LineChartPressure';
import AreaChartHumidity from './components/AreaChartHumidity';
import Histogram from './components/WindSpeedHist';
import WeatherMap from './components/Leafleat';

function App() {
  const metrics = ["mean", "sum", "min", "max"]
  return (
    <>
      {/* <NavBar/> */}
      <div className='w-fit' >
        <h2 className='text-right text-fuchsia-400'>Tableau de Bord</h2>
                       <div className='grid grid-row gap-7 justify-around '>
          {metrics.map(m => (
            <div className='bg-amber-400 w-20 h-10 rounded-2xl'>
              {m}
            </div>
          ))}
        </div>

      </div>

      <div className='flex flex-row justify-around mt-5'>
        <div className='w-100 h-100'>
          <WeatherMap />
        </div>

 



        <div >
          <div className='flex flex-row w-80 justify-around gap-10  ml-10' >
            <Barchart />
                    <PieChart />



          </div>

          <div className='flex flex-row w-80 justify-around gap-9 ml-10' >
            <AreaChartHumidity />
            <LineChart />


          </div>

        </div>
      </div>


      <div className='flex flex-row w-100 mt-5 gap-10'>

        <AreaChart />
        <Histogram />
        <RadarChart />
        <LineChartPressure />





      </div>



    </>
  );
}

export default App;



