import React from 'react';

interface InputGroup1Props {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  disabled?: boolean;
}

const InputGroup1: React.FC<InputGroup1Props> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false,
}) => {
  return (
    <div className="relative z-0 mb-6 w-full group">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        placeholder=" "
        disabled={disabled}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

export default InputGroup1;
