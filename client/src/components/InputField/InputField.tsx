import styles from "./InputField.module.scss";

type InputType = {
	label: string;
	type: string;
	value: string;
	name: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	placeholder: string;
	error: string | undefined;
	isTextArea?: boolean;
};

const InputField = ({
	label,
	placeholder,
	name,
	onChange,
	type,
	value,
	error,
	isTextArea = false,
}: InputType) => {
	return (
		<label className={`${styles.inputField} ${error ? styles._error : ""}`}>
			<p>
				{label} <span>*</span>
			</p>
			<span className={styles.inputField__errorText}>{error}</span>

			{isTextArea ? (
				<textarea
					className={`${styles.inputField__input} ${styles.inputField__textarea}`}
					autoComplete="off"
					name={name}
					value={value}
					onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
					placeholder={placeholder}
				/>
			) : (
				<input
					className={styles.inputField__input}
					autoComplete="off"
					type={type}
					name={name}
					value={value}
					onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
					placeholder={placeholder}
				/>
			)}
		</label>
	);
};
export default InputField;
