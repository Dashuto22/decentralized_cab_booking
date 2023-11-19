import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { MdOutlinePayment } from "react-icons/md";


export const SidebarData = [
    {
        title: 'Add Credits',
        path: '/payment',
        icon: <MdOutlinePayment />,
        cName: 'nav-text'
    },
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'XRP',
        path: '/xrp',
        icon: <FaIcons.FaCrown />,
        cName: 'nav-text'
    }

]