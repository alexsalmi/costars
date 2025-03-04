'use client';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import CSButton from '@/components/inputs/buttons/button';
import Link from 'next/link';
import '@/styles/pages/errors.scss';

export default function Error() {
  return (
    <>
      <Header showLogo />
      <main>
        <div className='error-container'>
          <h3>Sorry, something went wrong.</h3>
          <Link href='/'>
            <CSButton>Click here to go to the home page</CSButton>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
