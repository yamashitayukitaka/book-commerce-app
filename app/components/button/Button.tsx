'use client'

import { IconType } from 'react-icons'

type ButtonProps = {
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  outline?: boolean
  del?: boolean
  icon?: IconType
}

// ボタン
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, outline, del, icon: Icon }) => {

  return (
    <button
      disabled={disabled}

      onClick={onClick}
      className={`relative w-full border py-2 font-semibold hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70 
      ${outline
          ? 'border-neutral-400 bg-white text-black'
          : del
            ? 'border-red-500 bg-red-500 text-white'
            : 'bg-[rgb(11,_23,_39)] text-white'
        }
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4" />}
      {label}
    </button>
  )
}

export default Button