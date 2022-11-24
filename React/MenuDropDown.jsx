import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import debug from 'sabio-debug';
import toastr from 'toastr';
import * as menusService from '../../services/menusService';
import MenuItemCard from './MenuItemCard';
const _logger = debug.extend('MobileMenu');

function MenuDropDown() {
    const [menus, setMenus] = useState({ menus: [], menuCards: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [showText, setShowText] = useState('');
    const [show, setShow] = useState(false);
    const location = useLocation();
    const orgId = location.state.id;
    _logger(menus, isLoading, showText);

    useEffect(() => {
        menusService.getMenusV2(orgId, 0, 15).then(onGetMenusSuccess).catch(onGetMenusError);
        //setShowText(showText);
    }, []);
    const onGetMenusSuccess = (response) => {
        _logger('MenuDropDown onGetMenusSuccess response', response);
        setMenus((prevState) => {
            const newMenus = { ...prevState };
            newMenus.menus = response.item.pagedItems;
            newMenus.menuCards = newMenus.menus.map(mapMenus);
            if (newMenus.menus.length <= 0) {
                toastr.error('No menus currently available.');
            }
            setIsLoading(false);
            return newMenus;
        });
    };
    const onGetMenusError = (error) => {
        toastr.error('No menus currently available.');
        _logger(error);
        setIsLoading(true);
    };

    const mapMenus = (menu) => {
        _logger('MENU', menu);
        return <MenuItemCard className="text-center" key={`${menu.id}`} item={menu}></MenuItemCard>;
    };

    const filterBreakfast = (menuItem) => {
        let result = false;
        if (menuItem.name === 'Breakfast') {
            result = true;
        }
        return result;
    };

    const filterBrunch = (menuItem) => {
        let result = false;
        if (menuItem.name === 'Brunch') {
            result = true;
        }
        return result;
    };

    const filterLunch = (menuItem) => {
        _logger('menuItem', menuItem);
        let result = false;
        if (menuItem.name === 'Lunch') {
            result = true;
        }
        return result;
    };

    const filterDinner = (menuItem) => {
        let result = false;
        if (menuItem.name === 'Dinner') {
            result = true;
        }
        return result;
    };

    const filterAppetizers = (menuItem) => {
        let result = false;
        if (menuItem.menuItems[0].tags[0] === 'Appetizers') {
            result = true;
        }
        return result;
    };

    const handleBreakfast = () => {
        _logger('working');
        const filtered = menus.menus.filter(filterBreakfast);
        _logger('filtered', filtered);
        setMenus((prevState) => {
            const copy = { ...prevState };
            copy.menuCards = filtered[0].menuItems.map(mapMenus);
            return copy;
        });
    };

    const handleBrunch = () => {
        const filtered = menus.menus.filter(filterBrunch);
        _logger('filtered', filtered);
        setMenus((prevState) => {
            const copy = { ...prevState };
            copy.menuCards = filtered[0].menuItems.map(mapMenus);
            return copy;
        });
    };

    const handleLunch = () => {
        _logger('handleLunch working');
        const filtered = menus.menus.filter(filterLunch);
        _logger('handleLunch filtered', filtered);
        setMenus((prevState) => {
            const copy = { ...prevState };

            _logger('handleLunch setMenus prevState', prevState);

            copy.menuCards = filtered[0].menuItems.map(mapMenus);

            _logger('handleLunch setMenus copy', copy);

            return copy;
        });
    };

    const handleDinner = () => {
        _logger('working');
        const filtered = menus.menus.filter(filterDinner);
        _logger('filtered', filtered);
        setMenus((prevState) => {
            const copy = { ...prevState };
            copy.menuCards = filtered[0].menuItems.map(mapMenus);
            return copy;
        });
    };

    const handleAppetizers = () => {
        _logger('working');
        const filtered = menus.menus.filter(filterAppetizers);
        _logger('filtered', filtered);
        setMenus((prevState) => {
            const copy = { ...prevState };
            copy.menuCards = filtered[0].menuItems.map(mapMenus);
            return copy;
        });
    };

    const handleText = (e) => {
        const value = e.target.value;
        setShowText(value);
        _logger('value', value);
        if (value === 'Option 0') {
            setShow(false);
        } else if (value === 'Option 1') {
            handleBreakfast();
        } else if (value === 'Option 2') {
            handleBrunch();
        } else if (value === 'Option 3') {
            handleLunch();
            setShow(true);
        } else if (value === 'Option 4') {
            handleDinner();
        } else if (value === 'Option 5') {
            handleAppetizers();
        } else {
            return;
        }
    };

    return (
        <>
            <div className="row">
                <select className="p-2 " onChange={handleText}>
                    <option value="Option 0">Menu Name</option>
                    <option value="Option 1">Breakfast</option>
                    <option value="Option 2">Brunch</option>
                    <option value="Option 3">Lunch</option>
                    <option value="Option 4">Dinner</option>
                    {show && <option value="Option 5">Appetizers</option>}
                </select>

                <div className="row">{menus.menuCards}</div>
            </div>
        </>
    );
}

export default MenuDropDown;
