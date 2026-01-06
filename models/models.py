from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column, relationship
# from db.config import Base
from sqlalchemy import Integer, String, Column,DECIMAL, func
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String(200))
    price = Column(DECIMAL(precision=19, scale=2))
    stock_qty=Column(Integer)
    

class Order(Base):
    __tablename__ = "order"
    id = Column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    status = Column(String(10))

class OrderItem(Base):
    __tablename__ = "order_item"
    id = Column(Integer, primary_key=True, index=True)
    prod_id = relationship("Product", back_populates="order_item")
    qty_ordered = Column(Integer)
    price_at_time_of_order = Column(DECIMAL(precision=19, scale=2))
    

