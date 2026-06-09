import "./InputField.module.scss";

type InputType = {
	placeholder: string;
};

const InputField = ({ placeholder }: InputType) => {
	return <input type="text" placeholder={placeholder} />;
};
export default InputField;
