// import { useState, useEffect } from "react";
// import api from "../api";
// import Note from "../components/Note"
// import "../styles/Home.css"

// function Home() {
//     const [notes, setNotes] = useState([]);
//     const [content, setContent] = useState("");
//     const [title, setTitle] = useState("");

//     useEffect(() => {
//         getNotes();
//     }, []);

//     const getNotes = () => {
//         api
//             .get("/myapp/notes/")
//             .then((res) => res.data)
//             .then((data) => {
//                 setNotes(data);
//                 console.log(data);
//             })
//             .catch((err) => alert(err));
//     };

//     const deleteNote = (id) => {
//         api
//             .delete(`/myapp/notes/delete/${id}/`)
//             .then((res) => {
//                 if (res.status === 204) alert("Note deleted!");
//                 else alert("Failed to delete note.");
//                 getNotes();
//             })
//             .catch((error) => alert(error));
//     };

//     const createNote = (e) => {
//         e.preventDefault();
//         api
//             .post("/myapp/notes/", { content, title })
//             .then((res) => {
//                 if (res.status === 201) alert("Note created!");
//                 else alert("Failed to make note.");
//                 getNotes();
//             })
//             .catch((err) => alert(err));
//     };

//     return (
//         <div>
//             <div>
//                 <h2>Notes</h2>
//                 {notes.map((note) => (
//                     <Note note={note} onDelete={deleteNote} key={note.id} />
//                 ))}
//             </div>
//             <h2>Create a Note</h2>
//             <form onSubmit={createNote}>
//                 <label htmlFor="title">Title:</label>
//                 <br />
//                 <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     required
//                     onChange={(e) => setTitle(e.target.value)}
//                     value={title}
//                 />
//                 <label htmlFor="content">Content:</label>
//                 <br />
//                 <textarea
//                     id="content"
//                     name="content"
//                     required
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                 ></textarea>
//                 <br />
//                 <input type="submit" value="Submit"></input>
//             </form>
//         </div>
//     );
// }

// export default Home;






// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

function Home() {
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
    <div>
      <Navbar username={username} />
      <div className="home-container">
        <h1>HORAS</h1>
        <h1>bangkok2024</h1>
        <div className="product-list">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="product-item">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                {/* Display other product details */}
              </div>
            ))
          ) : (
            <p>ไม่มีสินค้าที่จะแสดง</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
