import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Nav from '../components/Nav.jsx';
import '../styles/Homes.css';

function Homes() {
    const [products, setProducts] = useState([]);
    const username = localStorage.getItem('username'); // Assuming you stored the username

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';
        } else {
            api.get('/myapp/products/')
                .then(res => {
                    setProducts(res.data);
                })
                .catch(err => {
                    console.error('Error fetching products:', err);
                });
        }
    }, []);

    return (
        <html>
            <head>
                <title>Horas™ Website</title>
            </head>
            <body>
                    <Nav/>
                    <div class="welcome-overlay" id="welcomeOverlay">
                        <div class="welcome-text">Welcome to our website</div> 
                        {/* <div class="welcome-detail">Horas 2024 Company</div> */}
                    </div>

                    <div className='hero-section'>
                        <img src='src/images/logo-white_horas.png' alt='' className='white-logo' />
                        <div className='heroshadow'></div>
                        <img src="/src/images/hero-section.png" alt="" className='hero-img' />
                    </div>

                    <div className='main-section'>
                        <div class="gallery-container">
                            <img src="" alt="" />
                                
                        </div>
                    </div>
            </body>
        </html>

    );
}

export default Homes;
