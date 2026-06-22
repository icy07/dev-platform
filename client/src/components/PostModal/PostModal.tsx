import styles from "./PostModal.module.scss";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { closeModal } from "../../store/slices/postsSlice";
import PostForm from "../PostForm/PostForm";
import { useEffect } from "react";

const PostModal = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isOpen, editInfo } = useSelector((state: RootState) => state.posts.modal);

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
		<div className={styles.overlay} onClick={() => dispatch(closeModal())}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modal__header}>
					<h2 className={styles.modal__title}>
						{editInfo ? "Редактировать пост" : "Создать пост"}
					</h2>
					<div className={styles.modal__close} onClick={() => dispatch(closeModal())}>
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
				<PostForm initialData={editInfo} onSuccess={() => dispatch(closeModal())} />
			</div>
		</div>
	);
};
export default PostModal;
