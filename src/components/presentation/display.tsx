import '@/styles/presentation/display.scss';

interface ICSTextDisplayProps {
  children: React.ReactNode;
  animate?: boolean;
}

export default function CSTextDisplay({
  children,
  animate,
}: ICSTextDisplayProps) {
  return (
    <div className={`text-display-container ${animate ? 'animate' : ''}`}>
      {children}
    </div>
  );
}
