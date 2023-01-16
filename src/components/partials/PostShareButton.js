const postShareButton = ({icon, label}) => {
    return (
      <div className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md'>
        {icon}
        <p className='text-sm font-medium text-neutral-500 hover:text-blue-600'>{label}</p>
      </div>
    )
  }

export default postShareButton