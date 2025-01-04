import '@/styles/presentation/display.scss';

interface ICSTextDisplayProps {
  children: React.ReactNode;
}

export default function CSTextDisplay({ children }: ICSTextDisplayProps) {
  return <div className='text-display-container'>{children}</div>;
}
