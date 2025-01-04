import CSBackButton from '@/components/inputs/buttons/back-button';
import '@/styles/pages/info-pages.scss';

export default function Privacy() {
  return (
    <div className='info-page-container'>
      <CSBackButton />
      <section className='info-page-content'>
        <h3>Privacy Policy</h3>
        <span>
          Your privacy is important to us. To better protect your sensitive
          information, we provide this notice explaining our online information
          practices and how they relate specifically in regard of what type or
          quantity data might be collected from you by way of using the website
          at any given time during browsing sessions on either desktop
          computers, tablets, or mobile devices.
        </span>
        <h4>Our Commitment</h4>
        <span>
          We do not collect any personal information on this site. Third party
          vendors may use cookies to serve ads based on a user&apos;s prior
          visits to your website or other websites. Google&apos;s use of
          advertising cookies enables it and its partners to serve ads to your
          users based on their visit to your sites and/or other sites on the
          Internet. Users may opt out of personalized advertising.
        </span>
        <h4>Information We Collect</h4>
        <span>
          We collect the IP address and click patterns of our users for a
          period, but this data is never sold or shared with anyone else. We use
          it to see how people interact online so that we can make improvements
          on what they experience in their user interface (UI). Our email
          addresses are kept only as long as necessary; when responding back
          from customer inquiries or feedback - we do not reuse those same
          respondents&apos; names again next time around!
        </span>
        <h4>Third Party Services</h4>
        <span>
          We collect generic website analytics by way of website browser and
          cookies. Our analytics data collected is anonymous. We may work with
          third-party advertising companies to deliver ads when you visit our
          site. These firms may use aggregated information about your internet
          activity and other websites that are visited in order provide
          advertisements relevant for you on this platform only, but not
          including any personal details such as name or address.
        </span>
        <h4>Deleting your data</h4>
        <span>
          If you have created an account with us and would like to delete it,
          please follow the below instructions:
          <ol>
            <li>
              If you haven&apos;t already, sign in to your Costars account using
              the profile icon at the top of the page.
            </li>
            <li>
              When you are signed in, click on the profile at the top of the
              page again.
            </li>
            <li>
              When displaying the account you are logged in with, you will see a
              button to sign out of your account, and a button to delete your
              account.
            </li>
            <li>
              Click on the button to delete your account. Confirm the deletion
              by typing the message displayed on the screen.
            </li>
            <li>
              Once you have confirmed you want to delete your account, all of
              your account information, stats, and data will be deleted from our
              systems, and you will be signed out.
            </li>
          </ol>
          Please note that this is irreversible, and you will lose all of your
          Costars data and stats.
        </span>
        <h4>California Consumer Privacy Act (CCPA)</h4>
        <span>Manage your consent by way of the CCPA.</span>
        <h4>Log Data</h4>
        <span>
          We collect certain log data whenever you access our website or
          services. The information we collect may include your IP address,
          device name and version as well as the time you utilize our service.
          We use these and other statistics to help us provide improvements to
          the website.
        </span>
        <h4>Cookies</h4>
        <span>
          Cookies are files with a small amount of data that are commonly used
          as anonymous unique identifiers. These are sent to your browser from
          the websites that you visit and are stored on your device&apos;s
          internal memory.
        </span>
        <span>
          This Service does not use these “cookies” explicitly. However, the
          app/website may use third party code and libraries that use “cookies”
          to collect information and improve their services. You have the option
          to either accept or refuse these cookies and know when a cookie is
          being sent to your device. If you choose to refuse our cookies, you
          may not be able to use some portions of this Service.
        </span>
        <h4>Contact</h4>
        <span>
          We would love to hear from you! Whether you have a concern or simply
          want to say hello, please get in touch with us.
        </span>
      </section>
    </div>
  );
}
