import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { closeModal } from "../../store/slices/postsSlice";
import PostForm from "../PostForm/PostForm";
import Modal from "../Modal/Modal";

const PostModal = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isOpen, editInfo } = useSelector((state: RootState) => state.posts.modal);

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			title={editInfo ? "Редактировать пост" : "Создать пост"}
			onClose={() => dispatch(closeModal())}
		>
			<PostForm initialData={editInfo} onSuccess={() => dispatch(closeModal())} />
		</Modal>
	);
};
export default PostModal;
