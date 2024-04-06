
import React from 'react';
import  { useState } from 'react';


interface InputGroup1Props {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string; // Ici, type est optionnel et a une valeur par défaut de "text"
  disabled?: boolean; // disabled est aussi optionnel
}

function InputGroup1({
    label,
    name,
    value,
    onChange,
    type = "text",
    disabled,
}: InputGroup1Props) {

    return (
      <div className="relative z-0 w-full">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] ${
            disabled ? "border-gray-300" : "border-gray-400"
          }`}
          placeholder=" "
          disabled={disabled}
        />
        <label
          htmlFor={name}
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
        >
          {label}
        </label>
      </div>
    );
  }
  
  function InputGroup1Presentation() {
    // Si vous avez besoin de gérer l'état, vous pouvez définir les états ici.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // Gestionnaires d'événements factices pour la présentation
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    };
  
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    };
  
    return (
      <div className="flex flex-col bg-white w-full p-5 sm:p-10 gap-8 rounded-md">
        <InputGroup1
          name="name"
          label="Name"
          value={name} // Ces valeurs sont maintenant gérées par l'état
          onChange={handleNameChange}
        />
        <InputGroup1
          name="email"
          label="Email *"
          type="email"
          value={email} // et ces fonctions d'événement
          onChange={handleEmailChange}
        />
        <InputGroup1
          name="password"
          label="Password *"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Le champ désactivé n'a pas besoin de valeur ou de onChange */}
        <InputGroup1
          name="disabled"
          label="Disabled"
          disabled
          value="" // vous pouvez toujours fournir une chaîne vide pour la valeur
          onChange={() => {}} // et une fonction vide pour onChange
        />
      </div>
    );
  }
  
  export { InputGroup1Presentation };
  