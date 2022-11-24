/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Card, CardImg, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import debug from 'sabio-debug';
import AddToCart from './AddToCart';
const _logger = debug.extend('MobileMenuMainn');

const MenuItemCard = ({ item, onPurchaseMenuItem, userId, onToggle }) => {
    const mapFoodSafeTypes = (type, index) => {
        const popover = (
            <Popover key={`SafetyInfo${type.id}${item.id}${index}`} id="popover-basic">
                <Popover.Header className="text-center" as="h3">
                    {type.name}
                </Popover.Header>
                <Popover.Body>This item has been identified as {type.name}.</Popover.Body>
            </Popover>
        );
        return (
            <OverlayTrigger
                trigger={['click', 'hover']}
                placement="top"
                overlay={popover}
                key={`Safe${type.id}${item.id}${index}`}>
                <Badge pill className="me-1 bg-success food-type-label flex-shrink-1">
                    {type.name}
                </Badge>
            </OverlayTrigger>
        );
    };
    const mapFoodWarningTypes = (type, index) => {
        const popover = (
            <Popover key={`WarningInfo${type.id}${item.id}${index}`} id="popover-basic">
                <Popover.Header className="text-center" as="h3">
                    {type.name}
                </Popover.Header>
                <Popover.Body>This item has been identified as containing {type.name}.</Popover.Body>
            </Popover>
        );
        return (
            <OverlayTrigger
                trigger={['click', 'hover']}
                placement="top"
                overlay={popover}
                key={`Warning${type.id}${item.id}${index}`}>
                <Badge pill className="me-1 bg-danger mx-auto food-type-label">
                    {type.name}
                </Badge>
            </OverlayTrigger>
        );
    };

    _logger('item', item);

    const menuDescPopover = (
        <Popover id="popover-basic">
            <Popover.Header className="text-center" as="h3">
                {item.name}
            </Popover.Header>
            <Popover.Body>{item?.description}</Popover.Body>
        </Popover>
    );

    const onAddToCartClicked = (quantity) => {
        onPurchaseMenuItem(item, quantity || 1);
        _logger(quantity);
    };

    const onIngredientsClicked = () => {
        onToggle(item);
    };
    return (
        <>
            <div className="col-3 ">
                <Card className=" menu-accordion-card menu-item-card menu-menuitemcard" key={item.id}>
                    <div className="menu-item-img">
                        <CardImg className="rounded img-responsive menu-item-img" src={item.imageUrl} alt="menu item" />
                    </div>
                    <hr className="menu-card-divider m-0" />
                    <Card.Body className="menu-list-text menu-list-body" id={item}>
                        <p className="menu-list-text">
                            <strong>{item?.name}</strong>
                            {'- $'}
                            {item?.price?.toFixed(2)}
                        </p>
                        <OverlayTrigger
                            trigger={['click', 'hover']}
                            placement="top"
                            overlay={menuDescPopover}
                            key={item.name}>
                            <p></p>
                        </OverlayTrigger>
                        <Row className="m-0 food-type-labels d-flex justify-content-start p-0">
                            <Col sm={12} md={12} lg={12} xl={12} className="p-0">
                                {item?.foodSafe?.map(mapFoodSafeTypes)}

                                {item?.foodWarnings && item?.foodWarnings.map(mapFoodWarningTypes)}
                            </Col>
                        </Row>
                        <Row className="m-1">
                            <button
                                type="button"
                                className="btn btn-small btn-primary mt-1"
                                onClick={onIngredientsClicked}>
                                View/Change Ingredients
                            </button>
                        </Row>
                        <div className="add-menu-item-cart d-flex">
                            <AddToCart
                                className="mx-auto"
                                cardData={item}
                                userId={userId}
                                notifyMenuCard={onAddToCartClicked}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

// MenuItemCard.propTypes = {
//     item: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         id: PropTypes.number.isRequired,
//         price: PropTypes.number.isRequired,
//         description: PropTypes.string.isRequired,
//         imageUrl: PropTypes.string.isRequired,
//         foodSafe: PropTypes.arrayOf(
//             PropTypes.shape({
//                 name: PropTypes.string,
//             })
//         ),
//         foodWarnings: PropTypes.arrayOf(
//             PropTypes.shape({
//                 name: PropTypes.string,
//             })
//         ),
//     }).isRequired,
//     onPurchaseMenuItem: PropTypes.func.isRequired,
//     userId: PropTypes.number.isRequired,
//     onToggle: PropTypes.func.isRequired,
// };

export default React.memo(MenuItemCard);
