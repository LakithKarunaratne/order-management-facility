from sqlalchemy.orm import Session
from models.models import Product, Order, OrderItem
from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

# Pydantic Schemas
class ProductCreate(BaseModel):
    name: str
    price: Decimal
    stock_qty: int

class OrderItemCreate(BaseModel):
    prod_id: int
    qty_ordered: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str

# Database functions
def create_product_db(db: Session, product: ProductCreate):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products_db(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def create_order_db(db: Session, order: OrderCreate):
    db_order = Order(status="Pending")
    db.add(db_order)
    db.flush()
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.prod_id).first()
        if not product:
            raise ValueError(f"Product {item.prod_id} not found")
        if product.stock_qty < item.qty_ordered:
            raise ValueError(f"Insufficient stock for product {item.prod_id}")
        
        db_item = OrderItem(
            order_id=db_order.id,
            prod_id=item.prod_id,
            qty_ordered=item.qty_ordered,
            price_at_time_of_order=product.price
        )
        db.add(db_item)
        product.stock_qty -= item.qty_ordered
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders_db(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def get_order_by_id_db(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def update_order_status_db(db: Session, order_id: int, status: str):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None
    if order.status == "Cancelled" and status in ["Pending", "Shipped"]:
        raise ValueError("Cancelled orders cannot be changed to Pending or Shipped")
    order.status = status
    db.commit()
    db.refresh(order)
    return order