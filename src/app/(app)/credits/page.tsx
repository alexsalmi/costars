import Image from 'next/image';
import CSBackButton from '@/components/inputs/back-button';
import '@/styles/pages/info-pages.scss';

export default function Credits() {
  return (
    <div className="info-page-container">
      <CSBackButton />
      <section className='info-page-content'>
        <h3>Costars Credits</h3>
        <span>
          <strong>Created by:</strong> Alex Salmi
        </span>
        <h4>The Movie Database</h4>
        <span className='info-page-image-section'>
          <Image
            src="/tmdb_logo.svg"
            alt="TMDB Logo"
            width={120}
            height={60}
          />  
          <span>
            All data and images related to movies and actors used in Costars are supplied by TMDB (The Movie Database). This product uses the TMDB API but is not endorsed or certified by TMDB.
          </span>
        </span>
      </section>
    </div>
  );
}
