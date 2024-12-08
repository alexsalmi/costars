import '@/styles/components/modal.scss'

interface ICSModalProps {
	children: React.ReactNode,
	isOpen: boolean,
	className?: string
}

export default function CSModal({children, isOpen, className}: ICSModalProps) {
	if(!isOpen) return <></>;

  return (
		<div className='modal-background'>
			<div className={`modal-container ${className || ''}`}>
				{children}
			</div>
		</div>
  );
}
