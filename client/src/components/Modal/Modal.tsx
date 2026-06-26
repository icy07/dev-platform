import { useEffect } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
	isOpen: boolean;
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modal__header}>
					<h2 className={styles.modal__title}>{title}</h2>
					<div className={styles.modal__close} onClick={onClose}>
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g id="SVGRepo_iconCarrier">
								<path
									d="M16 8L8 16M8.00001 8L16 16"
									stroke="#e6edf3"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								></path>
							</g>
						</svg>
					</div>
				</div>
				{children}
			</div>
		</div>
	);
};
export default Modal;
