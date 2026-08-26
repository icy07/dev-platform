import styles from "./ConfirmationModal.module.scss";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	confirmText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmationModal = ({
	isOpen,
	title,
	description,
	confirmText = "Удалить",
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onCancel}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<h2 className={styles.modal__title}>{title}</h2>
				<p className={styles.modal__description}>{description}</p>
				<div className={styles.modal__actions}>
					<button className={styles.modal__cancel} onClick={onCancel}>
						Отмена
					</button>
					<button className={styles.modal__confirm} onClick={onConfirm}>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
