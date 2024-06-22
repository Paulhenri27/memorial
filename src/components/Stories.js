import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Stories.css';

const Stories = () => {
  const [showForm, setShowForm] = useState(false);
  const [stories, setStories] = useState([]);
  const [name, setName] = useState('');
  const [story, setStory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      const storiesCollection = collection(db, 'testimonials');
      const storySnapshot = await getDocs(storiesCollection);
      const storyList = storySnapshot.docs.map(doc => doc.data());
      setStories(storyList);
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosCollection = collection(db, 'images');
      const photoSnapshot = await getDocs(photosCollection);
      const photoList = photoSnapshot.docs.map(doc => doc.data());
      setPhotos(photoList);
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString();

    try {
      const storiesCollection = collection(db, 'testimonials');
      await addDoc(storiesCollection, { name, story, date: currentDate });
      setStories([{ name, story, date: currentDate }, ...stories]);
      setName('');
      setStory('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleAddStoryClick = () => {
    setShowForm(true);
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const [expandedStories, setExpandedStories] = useState([]);

  const toggleStory = (index) => {
    if (expandedStories.includes(index)) {
      setExpandedStories(expandedStories.filter(i => i !== index));
    } else {
      setExpandedStories([...expandedStories, index]);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('default', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="stories-page">
      <div className="stories-main">
        <div className="stories-container">
          <div className="stories-header">
            <h2>Share a special moment from FELICITE's life.</h2>
            <button className="btn" onClick={handleAddStoryClick}>
              <FontAwesomeIcon icon={faPen} />
              Write a story
            </button>
          </div>

          <div className="stories">
            <ul>
              {stories.map((s, index) => (
                <li key={index}>
                  <span className="new-label">NEW</span>
                  <FontAwesomeIcon icon={faFeatherAlt} className="story-icon" />
                  <div className="story-header">
                    <small className="date">{formatDate(s.date)}</small>
                    <span className="by">• by </span>
                    <h3>{s.name}</h3>
                  </div>
                  <p className={`story-content ${expandedStories.includes(index) ? 'expanded' : ''}`}>
                    {expandedStories.includes(index) ? s.story : `${s.story.substring(0, 200)}...`}
                    {s.story.length > 200 && (
                      <span className="read-more" onClick={() => toggleStory(index)}>
                        {expandedStories.includes(index) ? ' Show less' : ' Read more'}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div ref={formRef} className="story-form">
            <h2>Share a story</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name (required)"
              />
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
                placeholder="Write your story here..."
              />
              <button type="submit" className="btn">Publish</button>
            </form>
          </div>
        </div>
        <div className="stories-sidebar">
          <div className="diaporama-box">
            <h3>5 Photos</h3>
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

export default Stories;

