
import React, { useState, useEffect } from 'react'; // เพิ่ม useEffect
import '../styles/blackinfo.css';


function blackinfo({ username }) {

  return (
    <>
        <div className='black-container'>
            <div className='black-title'>SOCIAL MEDIA</div>
            <div className='black-description'>
              <p className='black-dee'>Instagram</p>
              <p className='black-dee'>Facebook</p>
              <p className='black-dee'>Onlyfans</p>
              <p className='black-dee'>Website</p>
            </div>
        </div>
    </>
  );
}

export default blackinfo;