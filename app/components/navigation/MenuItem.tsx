'use client'

type MenuItemProps = {
  onClick: () => void
  label: string
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className='cursor-pointer text-[#fff] hover:opacity-60 max-[768px]:text-[14px]'
    >
      {label}
    </div>
  )
}

export default MenuItem
