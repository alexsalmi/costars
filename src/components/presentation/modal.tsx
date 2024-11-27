import '@/styles/components/modal.scss'

interface ICSModalProps {
	children: React.ReactNode,
	isOpen: boolean
}

export default function CSModal({children, isOpen}: ICSModalProps) {
	if(!isOpen) return <></>;

  return (
		<div className='modal-background'>
			<div className='modal-container'>
				{children}
			</div>
		</div>
  );
}
