import React from 'react'
import { Link } from 'react-router-dom'

const HeaderOptions = ({Icon, label, href, isMenuActive, setIsMenuActive}) => {
    return (
        <li className={`${isMenuActive === label && 'nav__link--active' } nav__link`}>
            <Link 
                to={href} 
                id={label} 
                className='flex flex-col items-center px-3 py-[0.45rem]' 
                onClick={(e) => {setIsMenuActive(e.currentTarget.id)}}
            >
                <Icon className='h-5 w-5' />
                <span className=''>{label}</span>
            </Link>
        </li>
    )
}

export default HeaderOptions