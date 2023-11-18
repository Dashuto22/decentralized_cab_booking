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
        title: 'Reports',
        path: '/Reports',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    }

]