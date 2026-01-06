from fastapi import APIRouter, Depends, HTTPException


router = APIRouter()


@router.post("/api/v1/products/", tags=["product"])
def create_product():
    pass



@router.get("/api/v1/products/", tags=["product"])
def list_all_products():
    # Add pagination
    pass



@router.post("/api/v1/order/", tags=["order"])
def create_order():
    pass



@router.get("/api/v1/order/", tags=["order"])
def list_all_orders():
    # Add pagination
    pass

@router.get("/api/v1/order/{order_id}", tags=["order"])
def get_order_by_id(order_id):
    # including the list of items inside
    pass


@router.patch("/api/v1/order/{order_id}", tags=["order", "status"])
def update_order_by_id(order_id):
    # Options: Pending, Shipped, Cancelled
    # Cancelled orders cannot be shipped or pending
    pass
