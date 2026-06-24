import styles from "./ProfilePage.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserRequest } from "../../api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setProfile } from "../../store/slices/profileSlice";
import Loader from "../../components/Loader/Loader";

const ProfilePage = () => {
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.profile.profile);

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		document.title = "Страница пользователя";
	}, []);

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			const { data } = await getUserRequest(id!);
			dispatch(setProfile(data));
			setLoading(false);
		};

		fetchProfile();
	}, [id]);

	return (
		<>
			{loading && (
				<div>
					<Loader />
				</div>
			)}
			{profile && (
				<div className={styles.profile}>
					<div className={styles.profile__info}>
						<h1>{profile.nickname}</h1>
						<p>{profile.firstName}</p>
						<p>{profile.lastName}</p>
					</div>
				</div>
			)}
		</>
	);
};
export default ProfilePage;
