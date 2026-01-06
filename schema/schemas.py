from pydantic import BaseModel
from decimal import Decimal
from typing import List

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
