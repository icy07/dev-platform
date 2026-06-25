import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import Modal from "../Modal/Modal";
import { closeProfileModal, closeProjectModal } from "../../store/slices/profileSlice";
import ProfileEditForm from "../ProfileEditForm/ProfileEditForm";
import ProjectForm from "../ProjectForm/ProjectForm";

const ProfileModal = () => {
	const { profileModal, projectModal } = useSelector((state: RootState) => state.profile);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<Modal
				isOpen={profileModal.isOpen}
				title="Редактировать профиль"
				onClose={() => dispatch(closeProfileModal())}
			>
				<ProfileEditForm onSuccess={() => dispatch(closeProfileModal())} />
			</Modal>
			<Modal
				isOpen={projectModal.isOpen}
				title={projectModal.editInfo ? "Редактировать проект" : "Добавить проект"}
				onClose={() => dispatch(closeProjectModal())}
			>
				<ProjectForm
					initialData={projectModal.editInfo}
					onSuccess={() => dispatch(closeProjectModal())}
				/>
			</Modal>
		</>
	);
};
export default ProfileModal;
