// src/components/Testimonials.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState('');
  const [story, setStory] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = collection(db, 'testimonials');
      const testimonialSnapshot = await getDocs(testimonialsCollection);
      const testimonialList = testimonialSnapshot.docs.map(doc => doc.data());
      setTestimonials(testimonialList);
    };

    fetchTestimonials();
  }, []);

  const addTestimonial = async () => {
    const testimonialsCollection = collection(db, 'testimonials');
    await addDoc(testimonialsCollection, { name, story });
    setName('');
    setStory('');
  };

  return (
    <div>
      <h2>Testimonials</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Story"
        value={story}
        onChange={(e) => setStory(e.target.value)}
      ></textarea>
      <button onClick={addTestimonial}>Add Testimonial</button>
      <ul>
        {testimonials.map((testimonial, index) => (
          <li key={index}>
            <h3>{testimonial.name}</h3>
            <p>{testimonial.story}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Testimonials;
