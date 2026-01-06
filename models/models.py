from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column, relationship
# from db.config import Base
from sqlalchemy import Integer, String, Column,DECIMAL, func, ForeignKey
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String(200))
    price = Column(DECIMAL(precision=19, scale=2))
    stock_qty=Column(Integer)
    order_items = relationship("OrderItem", back_populates="product")
    

class Order(Base):
    __tablename__ = "order"
    id = Column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    status = Column(String(10))
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_item"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"))
    prod_id = Column(Integer, ForeignKey("product.id"))
    qty_ordered = Column(Integer)
    price_at_time_of_order = Column(DECIMAL(precision=19, scale=2))
    
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
    

