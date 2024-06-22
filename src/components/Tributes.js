import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Tributes.css';

const Tributes = () => {
  const [tributes, setTributes] = useState([]);

  useEffect(() => {
    const fetchTributes = async () => {
      const tributesCollection = collection(db, 'tributes');
      const tributeSnapshot = await getDocs(tributesCollection);
      const tributeList = tributeSnapshot.docs.map(doc => doc.data());
      setTributes(tributeList);
    };

    fetchTributes();
  }, []);

  return (
    <div className="tributes">
      <h2>Tributes</h2>
      <ul>
        {tributes.map((tribute, index) => (
          <li key={index}>
            <h3>{tribute.name}</h3>
            <p>{tribute.tribute}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tributes;

