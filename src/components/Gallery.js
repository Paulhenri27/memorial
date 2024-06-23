import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreenForm, setShowFullscreenForm] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1300);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosCollection = collection(db, 'images');
      const photoSnapshot = await getDocs(photosCollection);
      const photoList = photoSnapshot.docs.map(doc => doc.data());
      setPhotos(photoList);
    };

    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      setFile(null);
      setFileName('');
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    try {
      const photosCollection = collection(db, 'images');
      await addDoc(photosCollection, { imageUrl: downloadURL, description });
      setPhotos([{ imageUrl: downloadURL, description }, ...photos]);
      setFile(null);
      setFileName('');
      setDescription('');
      setShowFullscreenForm(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleAddPhotoClick = () => {
    if (isSmallScreen) {
      setShowFullscreenForm(true);
    } else {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSmallScreen(screenWidth <= 1300);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="gallery-page">
      <div className="gallery-content-wrapper">
        <div className="main-content">
          <div className="gallery-container">
            <div className="gallery-header">
              <button className="btn" onClick={handleAddPhotoClick}>
                Add photos
              </button>
            </div>
            <div className="photos">
              <ul>
                {photos.map((photo, index) => (
                  <li key={index}>
                    <span className="new-label">NEW</span>
                    <img src={photo.imageUrl} alt="Gallery" />
                    <p>{photo.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {!isSmallScreen && (
            <div ref={formRef} className="photo-form">
              <h2>Add Photos</h2>
              <form onSubmit={handleSubmit}>
                <div className="file-upload" onClick={handleFileUploadClick}>
                  <FontAwesomeIcon icon={faUpload} size="2x" />
                  <label>{fileName || 'Choose file'}</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }}
                  />
                </div>
                <button type="submit" className="btn upload-btn">Upload</button>
              </form>
            </div>
          )}
          {isSmallScreen && showFullscreenForm && (
            <div className={`photo-form fullscreen`}>
              <button className="return-btn" onClick={() => setShowFullscreenForm(false)}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h2>Add Photos</h2>
              <form onSubmit={handleSubmit}>
                <div className="file-upload" onClick={handleFileUploadClick}>
                  <FontAwesomeIcon icon={faUpload} size="2x" />
                  <label>{fileName || 'Choose file'}</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }}
                  />
                </div>
                <button type="submit" className="btn upload-btn">Upload</button>
              </form>
            </div>
          )}
        </div>
        <div className="gallery-sidebar">
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

      {isSmallScreen && (
        <button className="floating-btn" onClick={handleAddPhotoClick}>
          <FontAwesomeIcon icon={faPen} />
          <span className="btn-text">Add Photo</span>
        </button>
      )}
    </div>
  );
};

export default Gallery;
