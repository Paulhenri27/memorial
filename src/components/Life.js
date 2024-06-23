import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/Life.css';

const Life = () => {
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosCollection = collection(db, 'images');
      const photosSnapshot = await getDocs(photosCollection);
      const photosList = photosSnapshot.docs.map(doc => doc.data());
      setPhotos(photosList);
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % photos.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="life-page">
      <div className="life-container">
        <div className="life-content">
          <div className="story">
            <span className="new-label">NEW</span>
            <h2>Mme Nguetemo née MANGO Félicité</h2>
            <p>June 17 · by FELICITE MANGO VEUVE NGUETEMO</p>
            <p>* Née le 08 Décembre 1947 à Dschang</p>
            <p>* Décédée le 3 Mai 2024 à Djerba-Tunisie</p>
            <h3>VIE PROFESSIONNELLE</h3>
            <p>* Hôtesse d'accueil à la Délégation du Tourisme de Garoua</p>
            <h3>VIE ASSOCIATIVE</h3>
            <p>* Membre de plusieurs associations</p>
            <h3>VIE RELIGIEUSE</h3>
            <p>* Chrétienne engagée catholique</p>
            <h3>VIE FAMILIALE</h3>
            <p>* Veuve, mère de plusieurs enfants, petits-fils et arrières petits fils.</p>
          </div>
        </div>
        <div className="life-sidebar">
          <div className="diaporama-box">
            <h3>Photos</h3>
            {photos.length > 0 && (
              <img src={photos[currentSlide].imageUrl} alt="Slideshow" />
            )}
          </div>
          <div className="updates-box">
            <h3>Recent updates</h3>
            <ul>
              <li>June 18 - JANE EPITCHOP shared a story.</li>
              <li>June 18 - JANE EPITCHOP left a tribute.</li>
              <li>June 17 - FELICITE MANGO VEUVE NGUETEMO added 21 stories.</li>
              <li>June 17 - FELICITE MANGO VEUVE NGUETEMO left 2 tributes.</li>
              <li>June 17 - FELICITE MANGO VEUVE NGUETEMO added 5 photos.</li>
            </ul>
            <button className="btn show-more-btn">Show more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Life;
