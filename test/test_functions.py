import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from decimal import Decimal
from models.models import Base, Product, Order, OrderItem
from api.functions import (
    ProductCreate, OrderItemCreate, OrderCreate,
    create_product_db, get_products_db, create_order_db,
    get_orders_db, get_order_by_id_db, update_order_status_db
)

@pytest.fixture
def db_session():
    """
    SQLite in-memory Isolated Testing 
    """
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

@pytest.fixture
def sample_product():
    "Create a test product"
    return ProductCreate(name="Test Product", price=Decimal("10.99"), stock_qty=100)

def test_create_product_db(db_session, sample_product):
    result = create_product_db(db_session, sample_product)
    assert result.name == "Test Product"
    assert result.price == Decimal("10.99")
    assert result.stock_qty == 100

def test_get_products_db(db_session, sample_product):
    create_product_db(db_session, sample_product)
    products = get_products_db(db_session)
    assert len(products) == 1
    assert products[0].name == "Test Product"

def test_create_order_db(db_session, sample_product):
    """Create order test

    Args:
        db_session (_type_): this is the db session
        sample_product (_type_): _description_
    """
    product = create_product_db(db_session, sample_product)
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=product.id, qty_ordered=5)])
    
    result = create_order_db(db_session, order_data)
    assert result.status == "Pending"
    assert len(result.order_items) == 1
    
    # Check stock was reduced
    updated_product = db_session.query(Product).filter(Product.id == product.id).first()
    assert updated_product.stock_qty == 95

def test_create_order_db_product_not_found(db_session):
    """Testing invalid product

    Args:
        db_session (_type_): this is the db session
    """
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=999, qty_ordered=5)])
    
    with pytest.raises(ValueError, match="Product 999 not found"):
        create_order_db(db_session, order_data)

def test_create_order_db_insufficient_stock(db_session, sample_product):
    """Testing the Insufficient Stock Levels

    Args:
        db_session (_type_): this is the db session
        sample_product (_type_): _description_
    """
    product = create_product_db(db_session, sample_product)
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=product.id, qty_ordered=150)])
    
    with pytest.raises(ValueError, match="Insufficient stock"):
        create_order_db(db_session, order_data)

def test_get_orders_db(db_session, sample_product):
    """Test the number of orders, given that we are sending only one product in test

    Args:
        db_session (_type_): this is the db session
        sample_product (_type_): _description_
    """
    product = create_product_db(db_session, sample_product)
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=product.id, qty_ordered=5)])
    create_order_db(db_session, order_data)
    
    orders = get_orders_db(db_session)
    assert len(orders) == 1

def test_update_order_status_db(db_session, sample_product):
    """Updating order status

    Args:
        db_session (_type_): _description_
        sample_product (_type_): _description_
    """
    product = create_product_db(db_session, sample_product)
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=product.id, qty_ordered=5)])
    order = create_order_db(db_session, order_data)
    
    result = update_order_status_db(db_session, order.id, "Shipped")
    assert result.status == "Shipped"

def test_update_order_status_db_order_not_found(db_session):
    """Invalid order id testing

    Args:
        db_session (_type_): _description_
    """
    result = update_order_status_db(db_session, 999, "Shipped")
    assert result is None

def test_update_order_status_db_cancelled_restriction(db_session, sample_product):
    """Testing order status restriction on cancelled orders 

    Args:
        db_session (_type_): _description_
        sample_product (_type_): _description_
    """
    product = create_product_db(db_session, sample_product)
    order_data = OrderCreate(items=[OrderItemCreate(prod_id=product.id, qty_ordered=5)])
    order = create_order_db(db_session, order_data)
    
    update_order_status_db(db_session, order.id, "Cancelled")
    
    with pytest.raises(ValueError, match="Cancelled orders cannot be changed"):
        update_order_status_db(db_session, order.id, "Pending")