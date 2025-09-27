'use client'

type MenuItemProps = {
  onClick: () => void
  label: string
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className='cursor-pointer text-[#fff] hover:opacity-60'
    >
      {label}
    </div>
  )
}

export default MenuItem
