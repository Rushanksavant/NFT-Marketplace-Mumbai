import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';

import Mynft from './routes/Mynft';
import CreatorDashboard from './routes/CreatorDashboard';
import CreateNFT from './routes/CreateNFT';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="my-nft" element={<Mynft />} />
      <Route path="creator-dashboard" element={<CreatorDashboard />} />
      <Route path="create-item" element={<CreateNFT />} />
    </Routes>
    {/* <App /> */}
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

