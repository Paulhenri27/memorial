import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faFireAlt, faLeaf, faFeatherAlt, faThumbtack, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/About.css';

const About = () => {
  const [tributes, setTributes] = useState([]);
  const [name, setName] = useState('');
  const [tribute, setTribute] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stories, setStories] = useState([]);
  const [storyCount, setStoryCount] = useState(0);
  const [showFullscreenForm, setShowFullscreenForm] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTributes = async () => {
      const tributesCollection = collection(db, 'tributes');
      const tributeSnapshot = await getDocs(tributesCollection);
      const tributeList = tributeSnapshot.docs.map(doc => doc.data());
      tributeList.sort((a, b) => b.pin - a.pin || new Date(b.date) - new Date(a.date)); // Sort by pin status and date
      setTributes(tributeList);
    };

    fetchTributes();
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
    const fetchStories = async () => {
      const storiesCollection = collection(db, 'testimonials');
      const storiesSnapshot = await getDocs(storiesCollection);
      const storiesList = storiesSnapshot.docs.map(doc => doc.data());
      storiesList.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
      setStories(storiesList.slice(0, 3)); // Get the last three stories
      setStoryCount(storiesList.length); // Set the total number of stories
    };

    fetchStories();
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
      const tributesCollection = collection(db, 'tributes');
      await addDoc(tributesCollection, { name, tribute, date: currentDate, icon: selectedIcon, pin: false });
      const newTribute = { name, tribute, date: currentDate, icon: selectedIcon, pin: false };
      const updatedTributes = [newTribute, ...tributes];
      updatedTributes.sort((a, b) => b.pin - a.pin || new Date(b.date) - new Date(a.date)); // Sort by pin status and date
      setTributes(updatedTributes);
      setName('');
      setTribute('');
      setSelectedIcon('');
      setShowFullscreenForm(false); // Close the fullscreen form after submission
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleAddTributeClick = () => {
    if (window.innerWidth <= 1300) {
      setShowFullscreenForm(true);
    } else {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('default', { month: 'long', day: 'numeric' });
  };

  const toggleTribute = (index) => {
    const updatedTributes = [...tributes];
    updatedTributes[index].expanded = !updatedTributes[index].expanded;
    setTributes(updatedTributes);
  };

  const toggleStory = (index) => {
    const updatedStories = [...stories];
    updatedStories[index].expanded = !updatedStories[index].expanded;
    setStories(updatedStories);
  };

  const handleViewAllStoriesClick = () => {
    navigate('/stories');
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const gallerySection = document.querySelector('.gallery-section');
      const herLifeSection = document.querySelector('.her-life-section');
      const recentStoriesSection = document.querySelector('.recent-stories-section');

      if (gallerySection && herLifeSection && recentStoriesSection) {
        if (screenWidth <= 1300) {
          gallerySection.style.display = 'block';
          herLifeSection.style.display = 'block';
          recentStoriesSection.style.display = 'block';
        } else {
          gallerySection.style.display = 'none';
          herLifeSection.style.display = 'none';
          recentStoriesSection.style.display = 'none';
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="about-page">
      <div className="about-content-wrapper">
        <div className="about-container">
          <div className="about-content">
            <h1>Let the memory of FELICITE be with us forever.</h1>
            <ul>
              <li>76 years old</li>
              <li>Born on December 8, 1947 in Dschang, West Region, Cameroon</li>
              <li>Passed away on May 3, 2024 in Jerba Ajim, Tunisia, Médenine Governorate, Tunisia</li>
            </ul>
            <p>
              Ce site des obsèques a été créé à la mémoire de notre bien-aimé, FELICITE MANGO VEUVE NGUETEMO.
              Nous nous souviendrons d'elle pour toujours.
            </p>
          </div>

          <div className="tributes-header">
            <h2>Tributes</h2>
            <button className="btn" onClick={handleAddTributeClick}>
              <FontAwesomeIcon icon={faPen} className="pen-icon" />
              Leave a tribute
            </button>
          </div>

          <div className="tributes">
            <ul>
              {tributes.map((t, index) => (
                <li key={index} className={t.pin ? 'pinned-tribute' : ''}>
                  <div className="tribute-header">
                    {t.icon && <FontAwesomeIcon icon={t.icon === 'candle' ? faFireAlt : t.icon === 'flower' ? faLeaf : faFeatherAlt} className="tribute-icon" />}
                    <div className="name-date-container">
                      <h3>{t.name}</h3>
                      <small className="date">{formatDate(t.date)}</small>
                    </div>
                    {t.pin && <FontAwesomeIcon icon={faThumbtack} className="pin-icon" />}
                  </div>
                  <p className="tribute-content">
                    {t.tribute && (t.expanded ? t.tribute : `${t.tribute.substring(0, 200)}...`)}
                    {t.tribute && t.tribute.length > 200 && (
                      <span className="read-more" onClick={() => toggleTribute(index)}>
                        {t.expanded ? ' Show less' : ' Read more'}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div ref={formRef} className={`tribute-form ${showFullscreenForm ? 'fullscreen' : ''}`}>
            {showFullscreenForm && (
              <button className="return-btn" onClick={() => setShowFullscreenForm(false)}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <h2>Leave a Tribute</h2>
            <div className="icon-selection">
              <div className={`icon-wrapper ${selectedIcon === 'candle' ? 'selected' : ''}`} onClick={() => setSelectedIcon('candle')}>
                <FontAwesomeIcon icon={faFireAlt} className="icon" />
                <p>Light a Candle</p>
              </div>
              <div className={`icon-wrapper ${selectedIcon === 'flower' ? 'selected' : ''}`} onClick={() => setSelectedIcon('flower')}>
                <FontAwesomeIcon icon={faLeaf} className="icon" />
                <p>Lay a Flower</p>
              </div>
              <div className={`icon-wrapper ${selectedIcon === 'feather' ? 'selected' : ''}`} onClick={() => setSelectedIcon('feather')}>
                <FontAwesomeIcon icon={faFeatherAlt} className="icon" />
                <p>Leave a Note</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Name (required)"
                />
              </div>
              <div>
                <textarea
                  value={tribute}
                  onChange={(e) => setTribute(e.target.value)}
                  required
                  placeholder="Add your tribute text here..."
                />
              </div>
              <button type="submit" className="btn">Publish</button>
            </form>
          </div>

          {/* Additional Sections for screens below 1300px */}
          <div className="gallery-section">
            <h2>Gallery</h2>
            <div className="photos">
              <ul>
                {photos.map((photo, index) => (
                  <li key={index}>
                    <img src={photo.imageUrl} alt="Gallery" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="her-life-section">
            <h2>Her Life</h2>
            <div className="life-content">
              <p>Mme Nguetemo née MANGO Félicité</p>
              <p>* Née le 08 Décembre 1947 à Dschang</p>
              <p>* Décédée le 3 Mai 2024 à Djerba-Tunisie</p>
              <p>VIE PROFESSIONNELLE</p>
              <p>* Hôtesse d'accueil à la Délégation du Tourisme de Garoua</p>
              <p>VIE ASSOCIATIVE</p>
              <p>* Membre de plusieurs associations</p>
              <p>VIE RELIGIEUSE</p>
              <p>* Chrétienne engagée... read more</p>
            </div>
          </div>

          <div className="recent-stories-section">
            <h2>Recent Stories</h2>
            <ul>
              {stories.map((story, index) => (
                <li key={index}>
                  <div className="story-header">
                    <h3>{story.name}</h3>
                    <small className="date">{formatDate(story.date)}</small>
                  </div>
                  <p className="story-content">
                    {story.story && (story.expanded ? story.story : `${story.story.substring(0, 200)}...`)}
                    {story.story && story.story.length > 200 && (
                      <span className="read-more" onClick={() => toggleStory(index)}>
                        {story.expanded ? ' Show less' : ' Read more'}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
            <button className="btn show-more-btn" onClick={handleViewAllStoriesClick}>View all {storyCount} stories</button>
          </div>
        </div>
        <div className="about-sidebar">
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

      {window.innerWidth <= 1300 && (
        <button className="floating-btn" onClick={handleAddTributeClick}>
          <FontAwesomeIcon icon={faPen} />
          <span className="btn-text">Add Tribute</span>
        </button>
      )}
    </div>
  );
};

export default About;
