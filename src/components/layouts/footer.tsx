import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <a target="_blank" rel="noopener noreferrer"
        href="https://docs.google.com/forms/d/e/1FAIpQLSd5v14h_cTdERL7mmQd7G6LYUETx1uCv3KTM8ma4UMgAlM5gg/viewform?usp=dialog" >
        Feedback
      </a>
      |
      <Link href="/privacy">
        Privacy Policy
      </Link>
      |
      <Link href="/credits">
        Credits
      </Link>
      |
      <a href="mailto:contact@costarsgame.com">
        Contact Us
      </a>
    </footer>
  );
}
