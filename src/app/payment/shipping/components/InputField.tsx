interface InputFieldProps {
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
}) => (
  <div className="relative z-0 w-full mb-5 group">
    <input
      type={type}
      name={name}
      id={`floating_${name}`}
      className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder={placeholder}
      required
      onChange={onChange}
      value={value}
    />
    <label
      htmlFor={`floating_${name}`}
      className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);

export default InputField;
