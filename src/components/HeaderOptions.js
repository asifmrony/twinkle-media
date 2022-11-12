import React from 'react'

const HeaderOptions = ({Icon, label, isMenuActive, setIsMenuActive}) => {
    return (
        <li className={`${isMenuActive === label && 'nav__link--active' } nav__link`}>
            <a href="#" id={label} className='flex flex-col items-center px-3 py-1' onClick={(e) => {setIsMenuActive(e.currentTarget.id)}}>
                {<Icon className='h-6 w-6' />}
                <span className=''>{label}</span>
            </a>
        </li>
    )
}

export default HeaderOptions