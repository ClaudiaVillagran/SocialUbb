import ReactDOM from 'react-dom/client';
import App from './App.jsx';

//importar assets (recursos: hojas de estilo, imagenes, fuentes)
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

//arrancar app de react
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
