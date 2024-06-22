// src/components/Images.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Images = () => {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      const imagesCollection = collection(db, 'images');
      const imageSnapshot = await getDocs(imagesCollection);
      const imageList = imageSnapshot.docs.map(doc => doc.data());
      setImages(imageList);
    };

    fetchImages();
  }, []);

  const handleImageUpload = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      
      const imagesCollection = collection(db, 'images');
      await addDoc(imagesCollection, { imageUrl, description });
      
      setImageFile(null);
      setDescription('');
    }
  };

  return (
    <div>
      <h2>Images</h2>
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleImageUpload}>Add Image</button>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <img src={image.imageUrl} alt="image" />
            <p>{image.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Images;
