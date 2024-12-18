import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Nav from '../components/Nav.jsx';
import '../styles/Homes.css';
import { useNavigate } from 'react-router-dom';
import Black from '../components/blackinfo.jsx';

function Homes() {
    const [products, setProducts] = useState([]);
    const [isVideoOpen, setIsVideoOpen] = useState(false); // State to toggle video overlay
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/login');
        } else {
            api.get('/myapp/products/')
                .then(res => {
                    setProducts(res.data);
                })
                .catch(err => {
                    console.error('Error fetching products:', err);
                });
        }
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const overlay = document.getElementById('welcomeOverlay');
            if (overlay) {
                overlay.style.transition = 'opacity 1s';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Nav username={username} />
            <div className="welcome-overlay" id="welcomeOverlay">
                <div className="welcome-text">Welcome to our website</div>
            </div>

            <div className='hero-section'>
                <img src='src/images/logo-white_horas.png' alt='Logo' className='white-logo' />
                <div className='heroshadow'></div>
                <img src="/src/images/hero-section.png" alt="Hero" className='hero-img' />
            </div>

            <div className='news-section'>
                <div className='news-title'>NEWS</div>
                <div className='news-gallery'>
                    <div className='news1-gallery' onClick={() => setIsVideoOpen(true)}>
                        <div className='gradient-shadow'></div>
                        <video autoPlay loop muted className='news-video'>
                            <source src="src/videos/horas.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

            {isVideoOpen && (
                <VideoOverlay onClose={() => setIsVideoOpen(false)} />
            )}
             <Black />
        </div>
       
    );
}

function VideoOverlay({ onClose }) {
    return (
        <div className="video-overlay" onClick={onClose}>
            <div className="video-container">
                <video controls autoPlay className="full-video">
                    <source src="src/videos/horas.mp4" type="video/mp4" />
                </video>
                
            </div>

        </div>
    );
}

export default Homes;