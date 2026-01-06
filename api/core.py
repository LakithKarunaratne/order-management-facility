from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.config import get_db
from api.functions import (
    create_product_db, get_products_db, create_order_db,
    get_orders_db, get_order_by_id_db, update_order_status_db
)
from schema.schemas import OrderCreate, ProductCreate,OrderStatusUpdate, OrderItemCreate

router = APIRouter()


@router.post("/api/v1/products/", tags=["product"])
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product_db(db, product)

@router.get("/api/v1/products/", tags=["product"])
def list_all_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_products_db(db, skip, limit)

@router.post("/api/v1/order/", tags=["order"])
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        return create_order_db(db, order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/api/v1/order/", tags=["order"])
def list_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_orders_db(db, skip, limit)

@router.get("/api/v1/order/{order_id}", tags=["order"])
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = get_order_by_id_db(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/api/v1/order/{order_id}/status", tags=["order", "status"])
def update_order_by_id(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db)):
    if status_update.status not in ["Pending", "Shipped", "Cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        order = update_order_status_db(db, order_id, status_update.status)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
