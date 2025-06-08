import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './light.css';
//import './dark.css';

import CanvasArea from './components/CanvasArea';
import ForceEditor from './components/ForceEditor';
import InteractionMatrix from './components/InteractionMatrix';
// import ParticleControls from './components/ParticleControls';
// import AppearanceEditor from './components/AppearanceEditor';
// import SimulationControls from './components/SimulationControls';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="container-fluid">
        <div className="row">
          {/* Left Column: Canvas */}
          <div className="col-md-6">
            <CanvasArea />
          </div>

          {/* Right Column: Controls */}
          <div className="col-md-6 d-flex flex-column gap-3">
            <ForceEditor />
            <InteractionMatrix />
            {/* <ParticleControls />
            <AppearanceEditor />
            <SimulationControls onToggleTheme={toggleTheme} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
