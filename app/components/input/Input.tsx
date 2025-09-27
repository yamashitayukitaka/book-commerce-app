'use client'

import { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form'

type InputProps<T extends FieldValues> = {
  id: Path<T>
  label: string
  type?: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

// 入力フォーム

const Input = <T extends FieldValues>({
  id,
  label,
  type = 'text',
  disabled,
  register,
  required,
  errors,
}: InputProps<T>) => {
  return (
    <div className="relative w-full">
      <div className="mb-2 font-bold">{label}</div>
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        type={type}
        className={`w-full border-2 p-4 outline-none transition disabled:cursor-not-allowed disabled:opacity-70
          ${errors[id]
            ? 'border-red-500 focus:border-red-500'
            : 'border-neutral-300 focus:border-sky-500'
          }
        `}
      />

      {errors[id] && (
        <div className="my-3 text-center text-sm text-red-500">{String(errors[id]?.message)}</div>
      )}
    </div>
  )
}

export default Input