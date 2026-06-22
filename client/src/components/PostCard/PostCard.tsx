import styles from "./PostCard.module.scss";
import placeholderImg from "../../assets/placeholder.svg";
import { useEffect, useRef, useState } from "react";
import type { Post } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { openModal, removePost, toggleLike } from "../../store/slices/postsSlice";
import { deletePostRequest, likePostRequest, unlikePostRequest } from "../../api/postsApi";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "../../utils/getImgUrl";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const PREVIEW_LENGTH = 500;

interface PostProps {
	post: Post;
}

const PostCard = ({ post }: PostProps) => {
	const isLong = post.content.length > PREVIEW_LENGTH;

	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [contentHeight, setContentHeight] = useState(0);
	const [isAuthor, setIsAuthor] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const contentRef = useRef<HTMLParagraphElement>(null);
	const { user } = useSelector((state: RootState) => state.auth);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, []);

	useEffect(() => {
		const isAuthor = () => {
			setIsAuthor(post.author._id === user?.id);
		};

		isAuthor();
	}, [user]);

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const handleLike = () => {
		if (post.isLikedByUser) {
			unlikePostRequest(post._id);
		} else {
			likePostRequest(post._id);
		}

		dispatch(toggleLike(post._id));
	};

	const handleDelete = async () => {
		await deletePostRequest(post._id);
		dispatch(removePost(post._id));
		setIsConfirmOpen(true);
	};

	return (
		<>
			<div className={styles.card}>
				<div
					className={`${styles.card__image} ${post.previewImage ? "" : styles.card__imgPlaceholder}`}
				>
					<img
						src={post.previewImage ? getImageUrl(post.previewImage) : placeholderImg}
						alt="превью"
					/>
				</div>

				<div className={styles.card__body}>
					<div className={styles.card__meta}>
						<span className={`${styles.card__badge} ${styles.card__badge_type}`}>
							{post.type}
						</span>
						<span className={`${styles.card__badge} ${styles.card__badge_dir}`}>
							{post.direction}
						</span>
					</div>

					<h2 className={styles.card__title}>{post.title}</h2>

					<p className={styles.card__author}>
						Автор: <span>{post.author.nickname}</span> · {formatDate(post.createdAt)}
					</p>

					<div
						className={`${styles.card__contentWrapper} ${isLong && !isExpanded ? styles.card__contentWrapper_notExpanded : ""}`}
						style={{
							maxHeight: isExpanded ? `${contentHeight}px` : "100px",
						}}
					>
						<div className={styles.card__content} ref={contentRef}>
							<ReactMarkdown>{post.content}</ReactMarkdown>
						</div>
					</div>

					{isLong && (
						<button
							className={styles.card__expand}
							onClick={() => setIsExpanded((prev) => !prev)}
						>
							{isExpanded ? "Свернуть" : `Раскрыть`}
						</button>
					)}
				</div>

				<div className={styles.card__footer}>
					<div className={styles.card__actions}>
						<button
							className={`${styles.card__like} ${post.isLikedByUser ? styles.card__like_active : ""}`}
							onClick={handleLike}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							>
								<path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" />
							</svg>
							{post.likes}
						</button>
					</div>

					{isAuthor && (
						<div className={styles.card__ownerActions}>
							<button className={styles.card__btn} onClick={() => dispatch(openModal(post))}>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								>
									<path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
								</svg>
								Редактировать
							</button>
							<button
								className={`${styles.card__btn} ${styles.card__btn_delete}`}
								onClick={() => setIsConfirmOpen(true)}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								>
									<path d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
								</svg>
								Удалить
							</button>
						</div>
					)}
				</div>
			</div>
			<ConfirmationModal
				isOpen={isConfirmOpen}
				title="Удалить пост?"
				description="Это действие нельзя отменить"
				onConfirm={handleDelete}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</>
	);
};
export default PostCard;
