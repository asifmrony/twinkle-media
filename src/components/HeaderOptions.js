import React from 'react'

const HeaderOptions = ({Icon, label, isMenuActive, setIsMenuActive}) => {
    return (
        <li className={`${isMenuActive === label && 'nav__link--active' } nav__link`}>
            <a href="#" id={label} className='flex flex-col items-center px-3 py-[0.45rem]' onClick={(e) => {setIsMenuActive(e.currentTarget.id)}}>
                <Icon className='h-5 w-5' />
                <span className=''>{label}</span>
            </a>
        </li>
    )
}

export default HeaderOptions