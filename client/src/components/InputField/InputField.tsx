import styles from "./InputField.module.scss";

type InputType = {
	label: string;
	type: string;
	value: string;
	name: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	error: string | undefined;
};

const InputField = ({ label, placeholder, name, onChange, type, value, error }: InputType) => {
	return (
		<label className={`${styles.inputField} ${error ? styles._error : ""}`}>
			<p>
				{label} <span>*</span>
			</p>
			<span className={styles.inputField__errorText}>{error}</span>
			<input
				className={styles.inputField__input}
				autoComplete="off"
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</label>
	);
};
export default InputField;
